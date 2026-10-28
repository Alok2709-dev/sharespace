import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryOne, execute, runTransaction } from '@/lib/db/database';
import { getCurrentUser } from '@/lib/auth/session';
import { recordAuditEvent } from '@/lib/services/audit-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const resourceType = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';

    let sql = `
      SELECT r.*, u.full_name as owner_name, u.email as owner_email, i.name as institution_name,
             (SELECT COUNT(*) FROM bookings b WHERE b.resource_id = r.id AND b.status IN ('approved', 'checked_in')) as active_bookings_count,
             (SELECT COUNT(*) FROM eligibility_requirements er WHERE er.resource_id = r.id) as requirements_count
      FROM resources r
      JOIN users u ON r.owner_id = u.id
      JOIN institutions i ON r.institution_id = i.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (r.title LIKE ? OR r.description LIKE ? OR r.location LIKE ? OR r.category LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (category && category !== 'all') {
      sql += ` AND r.category = ?`;
      params.push(category);
    }
    if (resourceType && resourceType !== 'all') {
      sql += ` AND r.resource_type = ?`;
      params.push(resourceType);
    }
    if (status) {
      sql += ` AND r.status = ?`;
      params.push(status);
    } else {
      // By default show active and maintenance (hide suspended from general browse)
      sql += ` AND r.status != 'suspended'`;
    }

    sql += ` ORDER BY r.created_at DESC`;

    const resources = queryAll<any>(sql, params);
    const formatted = resources.map(r => ({
      ...r,
      images: JSON.parse(r.images || '[]'),
      operating_hours: JSON.parse(r.operating_hours || '{}')
    }));

    return NextResponse.json({ resources: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!['owner', 'institution_manager', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Permission denied: Only owners and managers can list resources' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, description, category, resource_type, location,
      images, operating_hours, min_duration_minutes, max_duration_minutes,
      lead_time_hours, max_capacity, deposit_amount, usage_instructions,
      safety_instructions, supervision_required, eligibility_requirements: reqs
    } = body;

    if (!title || !description || !category || !resource_type || !location) {
      return NextResponse.json({ error: 'Title, description, category, type, and location are required' }, { status: 400 });
    }

    const resourceId = 'res-' + Math.random().toString(36).substring(2, 9);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    runTransaction(() => {
      execute(`
        INSERT INTO resources (
          id, title, slug, description, category, resource_type, institution_id, owner_id,
          location, images, operating_hours, min_duration_minutes, max_duration_minutes,
          lead_time_hours, max_capacity, deposit_amount, usage_instructions, safety_instructions,
          supervision_required, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        resourceId,
        title,
        slug,
        description,
        category,
        resource_type,
        user.institution_id || 'inst-apex-01',
        user.id,
        location,
        JSON.stringify(images || []),
        JSON.stringify(operating_hours || { start: '08:00', end: '20:00', days: [1,2,3,4,5] }),
        min_duration_minutes || 60,
        max_duration_minutes || 480,
        lead_time_hours || 24,
        max_capacity || 1,
        deposit_amount || 0,
        usage_instructions || null,
        safety_instructions || null,
        supervision_required ? 1 : 0
      ]);

      if (Array.isArray(reqs)) {
        for (const r of reqs) {
          const reqId = 'req-' + Math.random().toString(36).substring(2, 9);
          execute(`
            INSERT INTO eligibility_requirements (id, resource_id, requirement_type, title, description, is_mandatory)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [reqId, resourceId, r.requirement_type || 'training', r.title, r.description || null, r.is_mandatory ? 1 : 0]);
        }
      }

      recordAuditEvent({
        actorId: user.id,
        actorName: user.full_name,
        actorRole: user.role,
        actionType: 'RESOURCE_CREATED',
        entityType: 'resource',
        entityId: resourceId,
        prevState: null,
        newState: 'active',
        decisionReason: 'Resource created and published by authorized custodian',
        metadata: { title, category, resource_type }
      });
    });

    return NextResponse.json({ success: true, resourceId, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
