import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import {
  proposalSummarizerDb,
  CANONICAL_PROPOSAL,
  NOT_PROVIDED_TEXT,
} from "@/database/proposalSummarizerDatabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const proposalId = searchParams.get("proposalId") || CANONICAL_PROPOSAL.id;

    const proposal = proposalSummarizerDb.getProposalById(proposalId) || CANONICAL_PROPOSAL;
    const summary = proposalSummarizerDb.getSummaryForProposal(proposalId);

    return NextResponse.json({
      success: true,
      proposal,
      summary,
      isAIGenerated: true,
      label: "AI-generated summary",
      factualFidelity: "Strict Extraction — No Invention Allowed",
      disclaimer:
        "Statutory Advisory: This summary is AI-generated from submitted proposal documents. It does not replace or modify the official legal proposal.",
    });
  } catch (error: any) {
    console.error("Failed to fetch proposal summary:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId } = body;

    const proposal =
      proposalSummarizerDb.getProposalById(proposalId) || CANONICAL_PROPOSAL;
    const summary = proposalSummarizerDb.getSummaryForProposal(proposal.id);

    return NextResponse.json({
      success: true,
      summary,
      proposal,
      label: "AI-generated summary",
    });
  } catch (error: any) {
    console.error("Failed to generate proposal summary:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
