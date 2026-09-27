import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import {
  queryDocuments,
  insertDocument,
  DocumentType,
  DocumentStatus,
  DocumentAccessLevel,
} from "@/database/documentDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = getAuthenticatedUser(request);

  const type = (searchParams.get("type") as DocumentType | "ALL") || undefined;
  const status = (searchParams.get("status") as DocumentStatus | "ALL") || undefined;
  const isTemplate = searchParams.has("isTemplate")
    ? searchParams.get("isTemplate") === "true"
    : undefined;
  const search = searchParams.get("search") || undefined;
  const pilotId = searchParams.get("pilotId") || undefined;
  const sortBy = (searchParams.get("sortBy") as any) || "updatedDate";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

  const userContext = user
    ? {
        role: user.role,
        organizationId: user.organizationId,
        id: user.id,
      }
    : undefined;

  const docs = queryDocuments(
    {
      type,
      status,
      isTemplate,
      search,
      pilotId,
      sortBy,
      sortOrder,
    },
    userContext
  );

  return NextResponse.json({
    success: true,
    documents: docs,
    totalCount: docs.length,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const body = await request.json();

    const {
      name,
      type,
      version,
      owner,
      expiryDate,
      status,
      access,
      isTemplate,
      description,
      fileSize,
      fileFormat,
      sha256Hash,
      pilotId,
      confidentialityLevel,
      signatories,
    } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Document name and type are required." },
        { status: 400 }
      );
    }

    const newDoc = insertDocument({
      name,
      type,
      version: version || "v1.0",
      owner: owner || (user ? `${user.firstName} ${user.lastName}` : "Directorate of Urban Dev"),
      expiryDate: expiryDate || "2027-12-31",
      status: (status as DocumentStatus) || "Draft",
      access: (access as DocumentAccessLevel) || "Restricted (Government & Startup)",
      isTemplate: Boolean(isTemplate),
      description: description || "Statutory pilot legal instrument and covenants.",
      fileSize: fileSize || "3.8 MB",
      fileFormat: fileFormat || "PDF",
      sha256Hash: sha256Hash || `sha256:${Math.random().toString(36).substring(2, 12)}...`,
      pilotId: pilotId || "PILOT-UP-UAQ-01",
      signatories: signatories || [],
      confidentialityLevel: confidentialityLevel || "RESTRICTED",
      downloadUrl: `/secure-vault/docs/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "_"))}.pdf`,
    });

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: "Document created successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
