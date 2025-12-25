import { MemoryStore } from "../core/MemoryStore.ts";
import { MemoryRecall } from "../core/MemoryRecall.ts";
import type { InvoiceContext } from "../core/MemoryRecall.ts";
import { MemoryApply } from "../core/MemoryApply.ts";
import { DecisionEngine } from "../core/DecisionEngine.ts";
import { Learner } from "../core/Learner.ts";

async function processInvoice(
  context: InvoiceContext,
  store: MemoryStore
) {
  const recall = new MemoryRecall(store);
  const apply = new MemoryApply();
  const decisionEngine = new DecisionEngine();

  const vendorMemories = await recall.recallVendor(context.vendorName);
  console.log("Recalled memories:", vendorMemories);

  const applyResult = apply.apply(context, vendorMemories);
  const decision = decisionEngine.decide(applyResult);

  console.log("Decision:", decision);
}

async function runDemo() {
  const store = new MemoryStore();
  await store.init();

  const learner = new Learner(store);

  // -------- Invoice #1 --------
  const invoice1: InvoiceContext = {
    invoiceId: "INV-001",
    vendorName: "Supplier GmbH",
    rawText: "Leistungsdatum: 12.05.2024",
    extractedFields: {}
  };

  console.log("\n--- Processing Invoice #1 ---");
  await processInvoice(invoice1, store);

  console.log("\nHuman correction applied. Learning...\n");

  await learner.learnFromCorrection({
    vendorName: "Supplier GmbH",
    signal: "Leistungsdatum",
    normalizedField: "serviceDate",
    rule: "Map Leistungsdatum → serviceDate",
    approved: true
  });

  // -------- Invoice #2 --------
  const invoice2: InvoiceContext = {
    invoiceId: "INV-002",
    vendorName: "Supplier GmbH",
    rawText: "Leistungsdatum: 18.06.2024",
    extractedFields: {}
  };

  console.log("\n--- Processing Invoice #2 ---");
  await processInvoice(invoice2, store);
}

runDemo();
