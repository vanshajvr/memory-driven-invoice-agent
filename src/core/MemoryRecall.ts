import type { MemoryStore } from "./MemoryStore.ts";

export interface InvoiceContext {
  invoiceId: string;
  vendorName: string;
  rawText: string;
  extractedFields: Record<string, any>;
}

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
