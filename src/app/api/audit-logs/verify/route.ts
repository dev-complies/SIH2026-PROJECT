import { NextRequest, NextResponse } from "next/server";
import { auditDb } from "@/database/auditDatabase";

export async function GET(request: NextRequest) {
  const result = auditDb.verifyIntegrity();

  return NextResponse.json({
    success: true,
    isTamperFree: result.isValid,
    verifiedRecordsCount: result.verifiedCount,
    verificationAlgorithm: "SHA-256 Chained Hash Digest",
    auditState: result.isValid ? "100% UNMODIFIED & CRYPTOGRAPHICALLY SECURE" : "TAMPER_DETECTED",
    error: result.error,
    verifiedAt: new Date().toISOString(),
  });
}
