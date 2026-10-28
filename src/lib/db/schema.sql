-- SHARESPACE Relational Database Schema
-- Institutional Resource-Sharing and Lifecycle Management Platform
-- Target: SQLite (Native) and PostgreSQL/Supabase compatible

PRAGMA foreign_keys = ON;

-- 1. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  location TEXT,
  policy_settings TEXT NOT NULL DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('seeker', 'owner', 'institution_manager', 'admin')),
  institution_id TEXT REFERENCES institutions(id) ON DELETE SET NULL,
  department TEXT,
  avatar_url TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'pending_verification')),
  suspension_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK(resource_type IN ('equipment', 'room', 'laboratory', 'workspace', 'facility')),
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  location TEXT NOT NULL,
  images TEXT NOT NULL DEFAULT '[]', -- JSON array of URLs
  operating_hours TEXT NOT NULL DEFAULT '{"start": "08:00", "end": "20:00", "days": [1,2,3,4,5]}',
  min_duration_minutes INTEGER NOT NULL DEFAULT 30,
  max_duration_minutes INTEGER NOT NULL DEFAULT 480,
  lead_time_hours INTEGER NOT NULL DEFAULT 24,
  max_capacity INTEGER DEFAULT 1,
  deposit_amount REAL DEFAULT 0,
  usage_instructions TEXT,
  safety_instructions TEXT,
  supervision_required INTEGER NOT NULL DEFAULT 0, -- 0 or 1
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'maintenance', 'suspended', 'retired')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Eligibility Requirements for Resources
CREATE TABLE IF NOT EXISTS eligibility_requirements (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  requirement_type TEXT NOT NULL, -- 'training', 'safety_cert', 'qualification', 'project_approval', 'background_check'
  title TEXT NOT NULL,
  description TEXT,
  is_mandatory INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Eligibility Verifications
CREATE TABLE IF NOT EXISTS eligibility_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requirement_type TEXT NOT NULL,
  institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('not_required', 'pending', 'verified', 'rejected', 'expired')),
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verification_notes TEXT,
  verification_document TEXT,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, requirement_type, institution_id)
);

-- 7. Bookings Table (Persistent Lifecycle State Machine)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  purpose TEXT NOT NULL,
  project_name TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK(status IN (
    'pending_approval',
    'approved',
    'rejected',
    'waitlisted',
    'checked_in',
    'return_pending_inspection',
    'returned',
    'cancelled',
    'overdue',
    'incident_under_review',
    'closed'
  )),
  decision_reason TEXT,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at DATETIME,
  cancellation_reason TEXT,
  cancelled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Waiting List Entries (Fair Allocation & Explainable FIFO)
CREATE TABLE IF NOT EXISTS waiting_list_entries (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  requested_start_time DATETIME NOT NULL,
  requested_end_time DATETIME NOT NULL,
  explanation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'promoted', 'expired', 'cancelled')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  promoted_at DATETIME
);

-- 9. Check-in Records (Handover Authentication & Initial Condition)
CREATE TABLE IF NOT EXISTS check_in_records (
  id TEXT PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  conducted_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  handover_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  initial_condition TEXT NOT NULL CHECK(initial_condition IN ('pristine', 'good', 'acceptable', 'fair', 'minor_wear')),
  accessories_included TEXT NOT NULL DEFAULT '[]', -- JSON array
  notes TEXT,
  image_urls TEXT NOT NULL DEFAULT '[]', -- JSON array of image URLs
  user_acknowledged INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Return Records (Return Inspection & Condition Audit)
CREATE TABLE IF NOT EXISTS return_records (
  id TEXT PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  conducted_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  return_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  final_condition TEXT NOT NULL CHECK(final_condition IN ('pristine', 'good', 'acceptable', 'fair', 'damaged', 'heavily_soiled')),
  accessories_returned TEXT NOT NULL DEFAULT '[]', -- JSON array
  condition_changed INTEGER NOT NULL DEFAULT 0, -- 0 = unchanged, 1 = altered/damaged
  inspection_status TEXT NOT NULL DEFAULT 'passed' CHECK(inspection_status IN ('passed', 'flagged_for_review', 'failed')),
  notes TEXT,
  image_urls TEXT NOT NULL DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Incidents Table (Damage, Delays, Security & Operational Issues)
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  incident_reference TEXT UNIQUE NOT NULL,
  booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
  reporter_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category TEXT NOT NULL CHECK(category IN (
    'equipment_damage',
    'missing_accessories',
    'late_return',
    'unsafe_use',
    'unauthorized_access',
    'scheduling_dispute',
    'other'
  )),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  evidence_urls TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'under_review', 'awaiting_information', 'resolved', 'escalated')),
  assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Persistent In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Log Events (Immutable Activity History)
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  prev_state TEXT,
  new_state TEXT,
  decision_reason TEXT,
  metadata TEXT DEFAULT '{}',
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and high-throughput queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_institution ON resources(institution_id);
CREATE INDEX IF NOT EXISTS idx_resources_owner ON resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);

CREATE INDEX IF NOT EXISTS idx_bookings_resource_times ON bookings(resource_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_waiting_list_resource ON waiting_list_entries(resource_id, status);
CREATE INDEX IF NOT EXISTS idx_waiting_list_user ON waiting_list_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_incidents_resource ON incidents(resource_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
