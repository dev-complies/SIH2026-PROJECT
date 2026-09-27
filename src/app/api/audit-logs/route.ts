import { NextRequest, NextResponse } from "next/server";
import { auditDb, AuditActionType, AuditEntityType } from "@/database/auditDatabase";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import { normalizeRole } from "@/auth/permissions";

export async function GET(request: NextRequest) {
  const user = getAuthenticatedUser(request);

  // Verification: Audit logs are sensitive statutory records.
  // Permitted roles: ADMIN, GOVERNMENT_OFFICER, PROCUREMENT_OFFICER, VALIDATOR.
  if (user) {
    const role = normalizeRole(user.role);
    if (role === "STARTUP") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Startups cannot inspect sovereign system audit logs." },
        { status: 403 }
      );
    }
  }

  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || undefined;
  const userFilter = searchParams.get("user") || undefined;
  const role = searchParams.get("role") || undefined;
  const entity = searchParams.get("entity") || undefined;
  const action = searchParams.get("action") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const logs = auditDb.queryLogs({
    search,
    user: userFilter,
    role,
    entity,
    action,
    startDate,
    endDate,
  });

  const filterOptions = auditDb.getAvailableFilterOptions();
  const integrity = auditDb.verifyIntegrity();

  return NextResponse.json({
    success: true,
    totalCount: logs.length,
    logs,
    filterOptions,
    integrity,
    queriedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const body = await request.json();

    const {
      action,
      entity,
      entityId,
      entityName,
      previousState,
      newState,
      statutoryRuleRef,
    } = body;

    const actor = user
      ? {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          department: user.departmentId || "Government Agency",
        }
      : body.user || {
          id: "sys-01",
          name: "System Nodal Process",
          email: "system@govinnovate.gov.in",
        };

    const actorRole = user ? user.role : body.role || "ADMIN";

    const newEntry = auditDb.recordAction({
      user: actor,
      role: actorRole,
      action: action as AuditActionType,
      entity: entity as AuditEntityType,
      entityId,
      entityName,
      previousState: previousState || "N/A",
      newState: newState || "N/A",
      ipAddress: request.headers.get("x-forwarded-for") || "10.14.22.105",
      userAgent: request.headers.get("user-agent") || "GovInnovate-Portal/2.4",
      statutoryRuleRef,
    });

    return NextResponse.json({
      success: true,
      message: `Audit entry #${newEntry.sequenceNumber} cryptographically chained.`,
      entry: newEntry,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to append audit log." },
      { status: 500 }
    );
  }
}

// IMMUTABILITY ENFORCEMENT: Modifications and deletions strictly forbidden
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: "Statutory Violation: Audit information is legally immutable. Modifications are strictly prohibited under state procurement rules.",
    },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      success: false,
      error: "Statutory Violation: Audit logs cannot be patched or altered. Hash chains are cryptographically sealed.",
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Statutory Violation: Deletion of audit log records constitutes a criminal breach of procurement integrity laws. Deletions are architecturally blocked.",
    },
    { status: 403 }
  );
}
