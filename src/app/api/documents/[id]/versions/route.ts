import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { sanitizeString } from "@/lib/security";
import { getDocumentById, addDocumentVersion } from "@/database/documentDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthenticatedUser(request);
  const { id } = await params;

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
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return unauthorizedResponse("Authentication required to commit new document versions.");
  }

  const role = normalizeRole(user.role);
  if (role !== "ADMIN" && role !== "GOVERNMENT_OFFICER" && role !== "PROCUREMENT_OFFICER" && role !== "STARTUP") {
    return forbiddenResponse("Forbidden: You do not have authorization to commit document versions.");
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { versionNumber, summaryOfChanges, fileSize, newHash } = body;

    if (!versionNumber || !summaryOfChanges) {
      return NextResponse.json(
        { success: false, error: "versionNumber and summaryOfChanges are required to commit a new version." },
        { status: 400 }
      );
    }

    const sanitizedVersion = sanitizeString(versionNumber, 50);
    const sanitizedSummary = sanitizeString(summaryOfChanges, 1000);
    const updatedBy = `${user.firstName} ${user.lastName} (${user.role})`;

    const result = addDocumentVersion(
      id,
      sanitizedVersion,
      sanitizedSummary,
      updatedBy,
      fileSize ? sanitizeString(fileSize, 50) : undefined,
      newHash ? sanitizeString(newHash, 100) : undefined
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      message: `Version ${sanitizedVersion} committed successfully with changelog entry.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
