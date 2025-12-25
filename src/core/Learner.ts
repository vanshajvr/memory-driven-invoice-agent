import type { MemoryStore } from "./MemoryStore.ts";

export interface HumanCorrection {
  vendorName: string;
  signal: string;
  normalizedField: string;
  rule: string;
  approved: boolean;
}

export class Learner {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  async learnFromCorrection(correction: HumanCorrection) {
    const confidenceChange = correction.approved ? 0.1 : -0.2;

    const memory = {
      id: `${correction.vendorName}-${correction.signal}`,
      vendor_name: correction.vendorName,
      signal: correction.signal,
      normalized_field: correction.normalizedField,
      rule: correction.rule,
      confidence: Math.max(0, Math.min(1, 0.5 + confidenceChange)),
      evidence_count: 1,
      last_used_at: new Date().toISOString(),
      decay_rate: 0.01
    };

    await this.store.upsertVendorMemory(memory);
  }
}
