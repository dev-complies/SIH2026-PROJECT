import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import { getDocumentById, updateDocument } from "@/database/documentDatabase";

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

  if (result.error) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({
    success: true,
    document: result.document,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const result = updateDocument(id, body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      message: `Document ${id} updated successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
