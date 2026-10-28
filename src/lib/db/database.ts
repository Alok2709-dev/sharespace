import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { getInitialSeedData } from './seed-data';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
  const dataDir = isServerless ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'sharespace.db');
  const db = new DatabaseSync(dbPath);

  // Enable WAL mode for high concurrency & foreign keys
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  // Run Schema
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schemaSql);
  } else {
    // Fallback embedded schema DDL for serverless environments where static files may not be traced
    db.exec(`
      CREATE TABLE IF NOT EXISTS institutions (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, domain TEXT NOT NULL, description TEXT, location TEXT, policy_settings TEXT NOT NULL DEFAULT '{}', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, full_name TEXT NOT NULL, role TEXT NOT NULL, institution_id TEXT, department TEXT, avatar_url TEXT, phone TEXT, status TEXT NOT NULL DEFAULT 'active', suspension_reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS resources (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, resource_type TEXT NOT NULL, institution_id TEXT NOT NULL, owner_id TEXT NOT NULL, location TEXT NOT NULL, images TEXT NOT NULL DEFAULT '[]', operating_hours TEXT NOT NULL DEFAULT '{}', min_duration_minutes INTEGER NOT NULL DEFAULT 30, max_duration_minutes INTEGER NOT NULL DEFAULT 480, lead_time_hours INTEGER NOT NULL DEFAULT 24, max_capacity INTEGER DEFAULT 1, deposit_amount REAL DEFAULT 0, usage_instructions TEXT, safety_instructions TEXT, supervision_required INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS eligibility_requirements (id TEXT PRIMARY KEY, resource_id TEXT NOT NULL, requirement_type TEXT NOT NULL, title TEXT NOT NULL, description TEXT, is_mandatory INTEGER NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS eligibility_verifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, requirement_type TEXT NOT NULL, institution_id TEXT, status TEXT NOT NULL DEFAULT 'pending', verified_by TEXT, verification_notes TEXT, verification_document TEXT, expires_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, requirement_type, institution_id));
      CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, booking_reference TEXT UNIQUE NOT NULL, resource_id TEXT NOT NULL, user_id TEXT NOT NULL, purpose TEXT NOT NULL, project_name TEXT, start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, status TEXT NOT NULL DEFAULT 'pending_approval', decision_reason TEXT, decided_by TEXT, decided_at DATETIME, cancellation_reason TEXT, cancelled_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS waiting_list_entries (id TEXT PRIMARY KEY, resource_id TEXT NOT NULL, booking_id TEXT UNIQUE NOT NULL, user_id TEXT NOT NULL, position INTEGER NOT NULL, requested_start_time DATETIME NOT NULL, requested_end_time DATETIME NOT NULL, explanation TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, promoted_at DATETIME);
      CREATE TABLE IF NOT EXISTS check_in_records (id TEXT PRIMARY KEY, booking_id TEXT UNIQUE NOT NULL, resource_id TEXT NOT NULL, user_id TEXT NOT NULL, conducted_by TEXT NOT NULL, handover_time DATETIME DEFAULT CURRENT_TIMESTAMP, initial_condition TEXT NOT NULL, accessories_included TEXT NOT NULL DEFAULT '[]', notes TEXT, image_urls TEXT NOT NULL DEFAULT '[]', user_acknowledged INTEGER NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS return_records (id TEXT PRIMARY KEY, booking_id TEXT UNIQUE NOT NULL, resource_id TEXT NOT NULL, user_id TEXT NOT NULL, conducted_by TEXT NOT NULL, return_time DATETIME DEFAULT CURRENT_TIMESTAMP, final_condition TEXT NOT NULL, accessories_returned TEXT NOT NULL DEFAULT '[]', condition_changed INTEGER NOT NULL DEFAULT 0, inspection_status TEXT NOT NULL DEFAULT 'passed', notes TEXT, image_urls TEXT NOT NULL DEFAULT '[]', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS incidents (id TEXT PRIMARY KEY, incident_reference TEXT UNIQUE NOT NULL, booking_id TEXT, resource_id TEXT NOT NULL, reporter_id TEXT NOT NULL, category TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'medium', description TEXT NOT NULL, evidence_urls TEXT NOT NULL DEFAULT '[]', status TEXT NOT NULL DEFAULT 'open', assigned_to TEXT, resolution_notes TEXT, resolved_at DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, link TEXT, is_read INTEGER NOT NULL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, actor_id TEXT, actor_name TEXT NOT NULL, actor_role TEXT NOT NULL, action_type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, prev_state TEXT, new_state TEXT, decision_reason TEXT, metadata TEXT DEFAULT '{}', ip_address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);
  }

  // Check if seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (!userCount || userCount.count === 0) {
    seedDatabase(db);
  }

  dbInstance = db;
  return db;
}

function seedDatabase(db: DatabaseSync) {
  const data = getInitialSeedData();

  // 1. Institution
  const insertInst = db.prepare(`
    INSERT INTO institutions (id, name, slug, domain, description, location, policy_settings)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertInst.run(
    data.institution.id,
    data.institution.name,
    data.institution.slug,
    data.institution.domain,
    data.institution.description,
    data.institution.location,
    data.institution.policy_settings
  );

  // 2. Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, institution_id, department, avatar_url, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const u of data.users) {
    insertUser.run(u.id, u.email, u.password_hash, u.full_name, u.role, u.institution_id, u.department, u.avatar_url, u.phone, u.status);
  }

  // 3. Resources
  const insertResource = db.prepare(`
    INSERT INTO resources (
      id, title, slug, description, category, resource_type, institution_id, owner_id,
      location, images, operating_hours, min_duration_minutes, max_duration_minutes,
      lead_time_hours, max_capacity, deposit_amount, usage_instructions, safety_instructions,
      supervision_required, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of data.resources) {
    insertResource.run(
      r.id, r.title, r.slug, r.description, r.category, r.resource_type, r.institution_id, r.owner_id,
      r.location, r.images, r.operating_hours, r.min_duration_minutes, r.max_duration_minutes,
      r.lead_time_hours, r.max_capacity, r.deposit_amount, r.usage_instructions, r.safety_instructions,
      r.supervision_required, r.status
    );
  }

  // 4. Eligibility Requirements
  const insertReq = db.prepare(`
    INSERT INTO eligibility_requirements (id, resource_id, requirement_type, title, description, is_mandatory)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const req of data.eligibilityRequirements) {
    insertReq.run(req.id, req.resource_id, req.requirement_type, req.title, req.description, req.is_mandatory);
  }

  // 5. Eligibility Verifications
  const insertVer = db.prepare(`
    INSERT INTO eligibility_verifications (id, user_id, requirement_type, institution_id, status, verified_by, verification_notes, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const ver of data.eligibilityVerifications) {
    insertVer.run(ver.id, ver.user_id, ver.requirement_type, ver.institution_id, ver.status, ver.verified_by, ver.verification_notes, ver.expires_at);
  }

  // 6. Bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, booking_reference, resource_id, user_id, purpose, project_name, start_time, end_time, status, decision_reason, decided_by, decided_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const b of data.bookings) {
    insertBooking.run(b.id, b.booking_reference, b.resource_id, b.user_id, b.purpose, b.project_name, b.start_time, b.end_time, b.status, b.decision_reason, b.decided_by, b.decided_at);
  }

  // 7. Waiting List Entries
  const insertWl = db.prepare(`
    INSERT INTO waiting_list_entries (id, resource_id, booking_id, user_id, position, requested_start_time, requested_end_time, explanation, status, joined_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const wl of data.waitingListEntries) {
    insertWl.run(wl.id, wl.resource_id, wl.booking_id, wl.user_id, wl.position, wl.requested_start_time, wl.requested_end_time, wl.explanation, wl.status, wl.joined_at);
  }

  // 8. Check-in Records
  const insertChk = db.prepare(`
    INSERT INTO check_in_records (id, booking_id, resource_id, user_id, conducted_by, handover_time, initial_condition, accessories_included, notes, image_urls, user_acknowledged)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of data.checkInRecords) {
    insertChk.run(c.id, c.booking_id, c.resource_id, c.user_id, c.conducted_by, c.handover_time, c.initial_condition, c.accessories_included, c.notes, c.image_urls, c.user_acknowledged);
  }

  // 9. Return Records
  const insertRet = db.prepare(`
    INSERT INTO return_records (id, booking_id, resource_id, user_id, conducted_by, return_time, final_condition, accessories_returned, condition_changed, inspection_status, notes, image_urls)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const ret of data.returnRecords) {
    insertRet.run(ret.id, ret.booking_id, ret.resource_id, ret.user_id, ret.conducted_by, ret.return_time, ret.final_condition, ret.accessories_returned, ret.condition_changed, ret.inspection_status, ret.notes, ret.image_urls);
  }

  // 10. Incidents
  const insertInc = db.prepare(`
    INSERT INTO incidents (id, incident_reference, booking_id, resource_id, reporter_id, category, severity, description, evidence_urls, status, assigned_to, resolution_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const inc of data.incidents) {
    insertInc.run(inc.id, inc.incident_reference, inc.booking_id, inc.resource_id, inc.reporter_id, inc.category, inc.severity, inc.description, inc.evidence_urls, inc.status, inc.assigned_to, inc.resolution_notes);
  }

  // 11. Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const n of data.notifications) {
    insertNotif.run(n.id, n.user_id, n.type, n.title, n.message, n.link, n.is_read);
  }

  // 12. Audit Events
  const insertAudit = db.prepare(`
    INSERT INTO audit_events (id, actor_id, actor_name, actor_role, action_type, entity_type, entity_id, prev_state, new_state, decision_reason, metadata, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of data.auditEvents) {
    insertAudit.run(a.id, a.actor_id, a.actor_name, a.actor_role, a.action_type, a.entity_type, a.entity_id, a.prev_state, a.new_state, a.decision_reason, a.metadata, a.ip_address);
  }
}

// Helper query wrappers
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  const result = stmt.get(...params) as T | undefined;
  return result ?? null;
}

export function execute(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number | bigint } {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    changes: Number(result.changes),
    lastInsertRowid: result.lastInsertRowid
  };
}

export function runTransaction<T>(fn: () => T): T {
  const db = getDatabase();
  db.exec('BEGIN TRANSACTION');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
