import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export class MemoryStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  async init(dbPath: string = "data/memory.db"): Promise<void> {
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await this.createTables();
  }

  private async createTables(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS vendor_memory (
        id TEXT PRIMARY KEY,
        vendor_name TEXT,
        signal TEXT,
        normalized_field TEXT,
        rule TEXT,
        confidence REAL,
        evidence_count INTEGER,
        last_used_at TEXT,
        decay_rate REAL
      );

      CREATE TABLE IF NOT EXISTS correction_memory (
        id TEXT PRIMARY KEY,
        pattern_signature TEXT,
        correction_action TEXT,
        confidence REAL,
        times_applied INTEGER,
        times_rejected INTEGER,
        last_outcome TEXT
      );

      CREATE TABLE IF NOT EXISTS resolution_memory (
        id TEXT PRIMARY KEY,
        memory_id TEXT,
        resolution TEXT,
        timestamp TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_trail (
        id TEXT PRIMARY KEY,
        invoice_id TEXT,
        step TEXT,
        timestamp TEXT,
        details TEXT
      );
    `);
  }

  async getVendorMemory(vendorName: string) {
    return this.db.all(
      `SELECT * FROM vendor_memory WHERE vendor_name = ?`,
      vendorName
    );
  }

  async upsertVendorMemory(memory: any): Promise<void> {
    await this.db.run(
      `
      INSERT INTO vendor_memory (
        id, vendor_name, signal, normalized_field, rule,
        confidence, evidence_count, last_used_at, decay_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        confidence = excluded.confidence,
        evidence_count = excluded.evidence_count,
        last_used_at = excluded.last_used_at
      `,
      memory.id,
      memory.vendor_name,
      memory.signal,
      memory.normalized_field,
      memory.rule,
      memory.confidence,
      memory.evidence_count,
      memory.last_used_at,
      memory.decay_rate
    );
  }

  async logAudit(
    invoiceId: string,
    step: string,
    details: string
  ): Promise<void> {
    await this.db.run(
      `
      INSERT INTO audit_trail (id, invoice_id, step, timestamp, details)
      VALUES (?, ?, ?, ?, ?)
      `,
      crypto.randomUUID(),
      invoiceId,
      step,
      new Date().toISOString(),
      details
    );
  }
}
