import type { MemoryStore } from "./MemoryStore.ts";

export interface InvoiceContext {
  invoiceId: string;
  vendorName: string;
  rawText: string;
  extractedFields: Record<string, any>;
}

// Responsible only for fetching relevant historical memory.
// Does not apply rules or make decisions.
export class MemoryRecall {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  async recallVendor(vendorName: string) {
    const memories = await this.store.getVendorMemory(vendorName);
    return memories;
  }
}
