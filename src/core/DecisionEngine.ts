import type { ApplyResult } from "./MemoryApply.ts";

export interface DecisionResult {
  requiresHumanReview: boolean;
  confidenceScore: number;
  reasoning: string;
}

export class DecisionEngine {
  decide(applyResult: ApplyResult): DecisionResult {
    // No suggestions → nothing to act on
    if (applyResult.proposedCorrections.length === 0) {
      return {
        requiresHumanReview: false,
        confidenceScore: 0.9,
        reasoning: "No discrepancies detected. Invoice accepted as-is."
      };
    }

    // Suggestions exist → be cautious for now
    return {
      requiresHumanReview: true,
      confidenceScore: 0.4,
      reasoning:
        "Proposed corrections found, but confidence is insufficient for auto-action."
    };
  }
}
