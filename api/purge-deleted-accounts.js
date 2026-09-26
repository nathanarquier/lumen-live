// Daily cron job: permanently purges accounts whose 30-day deletion grace period
// has elapsed. Triggered by Vercel Cron (see vercel.json) — see the auth check
// below for how requests are verified.
//
// Uses the Supabase SERVICE ROLE KEY. This file must never be imported by, or
// have its key exposed to, any client-shipped file (index.html, supabase.js).
const { createClient } = require('@supabase/supabase-js');

// Same project URL already public in supabase.js (not a secret — only the
// service role key below is).
const SUPABASE_URL = 'https://inmxnwerojearlnyvbyy.supabase.co';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Tables holding user-owned rows, cleaned up before the auth user itself is
// deleted. Matches CLAUDE.md's "tables in active use" list.
// ('mission_progress' was removed from this list 2026-09-26 — it doesn't
// appear anywhere else in the codebase or in that doc; it was never a real
// table dependency, just an unverified assumption.)
const USER_OWNED_TABLES = [
  'conversations',
  'user_profile',
  'missions',
  'mission_cycles',
  'user_events',
];

module.exports = async function handler(req, res) {
  // --- Auth: Vercel automatically sends `Authorization: Bearer <CRON_SECRET>`
  // on requests it triggers via the schedule in vercel.json, when a CRON_SECRET
  // env var exists on the project. This is Vercel's documented mechanism —
  // there is no custom-header or query-param option for native Cron.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('purge-deleted-accounts: SUPABASE_SERVICE_ROLE_KEY not set');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const admin = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const cutoffIso = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();

    const { data: dueRows, error: selectError } = await admin
      .from('account_deletions')
      .select('user_id, requested_at')
      .lt('requested_at', cutoffIso);

    if (selectError) {
      console.error('purge-deleted-accounts: failed to query account_deletions:', selectError.message);
      return res.status(500).json({ error: 'Failed to query account_deletions' });
    }

    const results = [];

    for (const row of dueRows || []) {
      const userId = row.user_id;
      try {
        // Delete user-owned data first.
        for (const table of USER_OWNED_TABLES) {
          const { error: delErr } = await admin.from(table).delete().eq('user_id', userId);
          if (delErr) throw new Error(`delete from ${table} failed: ${delErr.message}`);
        }

        // Delete the tracking row explicitly rather than relying on the FK's
        // ON DELETE behaviour (unconfirmed) — this must happen before
        // deleteUser() below, since a non-cascading FK would otherwise block
        // the auth user delete with a foreign-key violation.
        const { error: trackingDelErr } = await admin
          .from('account_deletions')
          .delete()
          .eq('user_id', userId);
        if (trackingDelErr) throw new Error(`delete account_deletions row failed: ${trackingDelErr.message}`);

        // Finally, delete the auth user itself.
        const { error: authError } = await admin.auth.admin.deleteUser(userId);
        if (authError) throw new Error(`auth.admin.deleteUser failed: ${authError.message}`);

        console.log(`[purge-deleted-accounts] purged user ${userId} (requested_at=${row.requested_at})`);
        results.push({ user_id: userId, status: 'purged' });
      } catch (err) {
        console.error(`[purge-deleted-accounts] failed to purge user ${userId}:`, err.message);
        results.push({ user_id: userId, status: 'error', error: err.message });
      }
    }

    console.log(`[purge-deleted-accounts] run complete — checked ${(dueRows || []).length}, purged ${results.filter(r => r.status === 'purged').length}`);
    return res.status(200).json({ checked: (dueRows || []).length, results });
  } catch (err) {
    console.error('purge-deleted-accounts error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
