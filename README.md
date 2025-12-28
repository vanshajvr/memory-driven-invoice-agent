# Memory-Driven Invoice Agent

This project implements a **memory-based learning layer** for invoice automation systems.
Instead of treating every invoice as a fresh case, the system **learns from repeated human corrections** and applies those learnings to future invoices in a **safe, explainable, and auditable** manner.

The focus of this assignment is **decision intelligence**, not OCR or extraction accuracy.
All invoice data is assumed to be pre-extracted.

---

## Core Idea

> The system starts cautious, observes repeated human decisions, gains confidence over time, and only acts autonomously when trust is earned.

Learning is achieved through **structured memory**, not ML training.

---

## Architecture Overview

The system follows a clear, staged pipeline:
```
Invoice → MemoryRecall → MemoryApply → DecisionEngine → Learner (after human feedback)
```

Each stage has a single responsibility, making the system easy to reason about and audit.

---

## Components

### 1. MemoryStore
- SQLite-backed persistent storage
- Stores vendor-specific memory, corrections, and audit logs
- Ensures memory persists across runs

### 2. MemoryRecall
- Fetches relevant historical memory for a given invoice
- Provides context without making decisions
- Example: vendor-specific field naming patterns

### 3. MemoryApply
- Applies recalled memory to generate **suggestions**
- Does not auto-correct
- Produces explainable reasoning notes

### 4. DecisionEngine
- Decides between:
  - Auto-accept
  - Auto-correct
  - Human review
- Uses confidence thresholds to prevent unsafe automation

### 5. Learner
- Observes human corrections
- Creates or updates memory
- Reinforces or weakens confidence
- Prevents bad learning from dominating

---

## Memory Types Implemented

- **Vendor Memory**
  - Vendor-specific labels, tax behavior, currency inference
- **Correction Memory**
  - Repeated human fixes turned into reusable rules
- **Resolution Awareness**
  - Confidence adjusted based on human approval or rejection

---

## Confidence Logic

- Memory starts with low confidence
- Confidence increases on repeated human approval
- Confidence decreases on rejection
- Auto-application only occurs above a safe threshold
- Low-confidence memory is **suggested**, not enforced

This ensures human-in-the-loop behavior by default.

---

## Demo: Learning Over Time

The demo intentionally processes **two invoices** from the same vendor.

### Invoice #1
- No prior memory
- System stays cautious
- Human correction is applied
- Memory is stored

### Invoice #2
- Vendor memory is recalled
- System suggests corrections
- Confidence is still below auto-action threshold
- Human review is requested with clear reasoning

This demonstrates **real learning across invoices**, not within a single execution step.

---

## How to Run

### Install dependencies
```bash
npm install
```
### Optional: Reset memory (cold start)

To simulate a fresh system with no prior learning (useful for demos or onboarding a new vendor):

```bash
rm data/memory.db
```

### Run demo
```bash
npm run demo
```
The console output shows:
- Memory recall
- Decision reasoning
- Confidence evolution

## Project Structure
```
src/
 ├─ core/
 │   ├─ MemoryStore.ts
 │   ├─ MemoryRecall.ts
 │   ├─ MemoryApply.ts
 │   ├─ DecisionEngine.ts
 │   └─ Learner.ts
 ├─ demo/
 │   └─ runInvoice.ts
 └─ index.ts
data/
 └─ memory.db
```

## Design Principles

- Explainability over automation
- Confidence before autonomy
- Human-in-the-loop by default
- Simple heuristics over opaque models
- Auditability at every stage

## Notes
- No ML training is used; heuristics are intentionally chosen
- The system is designed to be extended with additional memory types
- The demo focuses on correctness and safety, not UI

## Conclusion
This project demonstrates how an AI agent can learn responsibly by remembering past human decisions, improving automation rates without sacrificing trust or control.
