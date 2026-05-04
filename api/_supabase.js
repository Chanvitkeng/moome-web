// Shared Supabase client (server-side using service_role)
// Used by API routes only · never exposed to frontend

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  if (!url || !serviceKey) {
    throw new Error('Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Helper: upsert user by line_user_id or email
export async function upsertUser({ lineUserId, email, displayName, pictureUrl, birthDate, archetype }) {
  const sb = getSupabase();

  // Try find by line_user_id first
  if (lineUserId) {
    const { data: existing } = await sb
      .from('moome_users')
      .select('*')
      .eq('line_user_id', lineUserId)
      .maybeSingle();

    if (existing) {
      const updates = {};
      if (displayName && displayName !== existing.display_name) updates.display_name = displayName;
      if (pictureUrl && pictureUrl !== existing.picture_url) updates.picture_url = pictureUrl;
      if (email && !existing.email) updates.email = email;
      if (birthDate && !existing.birth_date) updates.birth_date = birthDate;
      if (archetype && !existing.archetype) updates.archetype = archetype;
      updates.last_seen_at = new Date().toISOString();

      const { data: updated } = await sb
        .from('moome_users')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      return updated || existing;
    }
  }

  // Try find by email
  if (email) {
    const { data: existing } = await sb
      .from('moome_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (existing) {
      const updates = { last_seen_at: new Date().toISOString() };
      if (lineUserId && !existing.line_user_id) updates.line_user_id = lineUserId;
      if (displayName) updates.display_name = displayName;
      if (pictureUrl) updates.picture_url = pictureUrl;
      const { data: updated } = await sb
        .from('moome_users')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      return updated || existing;
    }
  }

  // Insert new
  const { data: created, error } = await sb
    .from('moome_users')
    .insert({
      line_user_id: lineUserId || null,
      email: email || null,
      display_name: displayName || null,
      picture_url: pictureUrl || null,
      birth_date: birthDate || null,
      archetype: archetype || null,
    })
    .select()
    .single();

  if (error) throw new Error('User insert failed: ' + error.message);
  return created;
}

export async function saveChatMessage({ userId, role, content, voices, suggestions }) {
  const sb = getSupabase();
  const { error } = await sb.from('moome_chat_messages').insert({
    user_id: userId,
    role,
    content,
    voices: voices || null,
    suggestions: suggestions || null,
  });
  if (error) console.error('saveChatMessage failed:', error);
}

export async function getChatHistory(userId, limit = 20) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('moome_chat_messages')
    .select('role, content, voices, suggestions, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getChatHistory failed:', error);
    return [];
  }
  return (data || []).reverse(); // oldest first
}

export async function getUserFacts(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('moome_user_facts')
    .select('fact_key, fact_value, source')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('getUserFacts failed:', error);
    return [];
  }
  return data || [];
}

export async function updateUserBirth(userId, birthDate, archetype) {
  const sb = getSupabase();
  const { error } = await sb
    .from('moome_users')
    .update({
      birth_date: birthDate,
      archetype,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', userId);
  if (error) console.error('updateUserBirth failed:', error);
}
