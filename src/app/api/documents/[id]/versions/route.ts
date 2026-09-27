import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import { getDocumentById, addDocumentVersion } from "@/database/documentDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  const { id } = params;

  const result = getDocumentById(
    id,
    user
      ? {
          role: user.role,
          organizationId: user.organizationId,
          id: user.id,
        }
      : undefined
  );

  if (result.error || !result.document) {
    return NextResponse.json({ success: false, error: result.error || "Not found" }, { status: result.status || 404 });
  }

  return NextResponse.json({
    success: true,
    documentId: id,
    currentVersion: result.document.version,
    versionHistory: result.document.versionHistory,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  const { id } = params;

  try {
    const body = await request.json();
    const { versionNumber, summaryOfChanges, fileSize, newHash } = body;

    if (!versionNumber || !summaryOfChanges) {
      return NextResponse.json(
        { success: false, error: "versionNumber and summaryOfChanges are required to commit a new version." },
        { status: 400 }
      );
    }

    const updatedBy = user ? `${user.firstName} ${user.lastName} (${user.role})` : (body.updatedBy || "Authorized Legal Counsel");

    const result = addDocumentVersion(
      id,
      versionNumber,
      summaryOfChanges,
      updatedBy,
      fileSize,
      newHash
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      message: `Version ${versionNumber} committed successfully with changelog entry.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
