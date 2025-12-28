import type { InvoiceContext } from "./MemoryRecall.ts";

export interface ApplyResult {
  normalizedFields: Record<string, any>;
  proposedCorrections: string[];
  reasoningNotes: string[];
}

export class MemoryApply {
  apply(
    context: InvoiceContext,
    vendorMemories: any[]
  ): ApplyResult {
    const normalizedFields: Record<string, any> = {};
    const proposedCorrections: string[] = [];
    const reasoningNotes: string[] = [];

    // Generate correction suggestions based on recalled memory.
    // No automatic changes are applied at this stage.
    for (const memory of vendorMemories) {
      // Example: vendor-specific field normalization
      if (
        memory.signal &&
        context.rawText.includes(memory.signal)
      ) {
        normalizedFields[memory.normalized_field] =
          context.extractedFields[memory.signal] ?? "INFERRED_FROM_MEMORY";

        proposedCorrections.push(
          `Mapped '${memory.signal}' to '${memory.normalized_field}'`
        );

        reasoningNotes.push(
          `Applied vendor memory rule: ${memory.rule} (confidence ${memory.confidence})`
        );
      }
    }

    return {
      normalizedFields,
      proposedCorrections,
      reasoningNotes
    };
  }
}
