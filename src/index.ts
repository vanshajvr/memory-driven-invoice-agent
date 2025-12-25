import { MemoryStore } from "../src/core/MemoryStore.ts";
import { MemoryRecall } from "../src/core/MemoryRecall.ts";
import { MemoryApply } from "../src/core/MemoryApply.ts";
import { DecisionEngine } from "../src/core/DecisionEngine.ts";

async function runDemo() {
  const store = new MemoryStore();
  await store.init();

  const recall = new MemoryRecall(store);
  const apply = new MemoryApply();
  const decisionEngine = new DecisionEngine();

  const context = {
    invoiceId: "INV-001",
    vendorName: "Supplier GmbH",
    rawText: "Leistungsdatum: 12.05.2024",
    extractedFields: {}
  };

  const vendorMemories = await recall.recallVendor(context.vendorName);
  const applyResult = apply.apply(context, vendorMemories);
  const decision = decisionEngine.decide(applyResult);

  console.log("Decision:", decision);
}

runDemo();
