import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";
import { validateFileFormat, sanitizeString } from "@/lib/security";
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
    if (!user) {
      return unauthorizedResponse("Authentication required to create official contract documents.");
    }

    const role = normalizeRole(user.role);
    if (role !== "ADMIN" && role !== "GOVERNMENT_OFFICER" && role !== "PROCUREMENT_OFFICER" && role !== "STARTUP") {
      return forbiddenResponse("Forbidden: You do not possess clearance to create statutory pilot documents.");
    }

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

    const formatCheck = validateFileFormat(fileFormat || "PDF");
    if (!formatCheck.isValid) {
      return NextResponse.json({ success: false, error: formatCheck.error }, { status: 400 });
    }

    const safeName = sanitizeString(name, 150);

    const newDoc = insertDocument({
      name: safeName,
      type,
      version: version ? sanitizeString(version, 20) : "v1.0",
      owner: owner ? sanitizeString(owner, 100) : `${user.firstName} ${user.lastName}`,
      expiryDate: expiryDate ? sanitizeString(expiryDate, 20) : "2027-12-31",
      status: (status as DocumentStatus) || "Draft",
      access: (access as DocumentAccessLevel) || "Restricted (Government & Startup)",
      isTemplate: Boolean(isTemplate),
      description: sanitizeString(description || "Statutory pilot legal instrument and covenants.", 2000),
      fileSize: fileSize ? sanitizeString(fileSize, 20) : "3.8 MB",
      fileFormat: formatCheck.normalizedFormat,
      sha256Hash: sha256Hash ? sanitizeString(sha256Hash, 64) : `sha256:${Math.random().toString(36).substring(2, 12)}...`,
      pilotId: sanitizeString(pilotId || "PILOT-UP-UAQ-01", 64),
      signatories: signatories || [],
      confidentialityLevel: confidentialityLevel || "RESTRICTED",
      downloadUrl: `/secure-vault/docs/${encodeURIComponent(safeName.toLowerCase().replace(/\s+/g, "_"))}.pdf`,
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
