/**
 * lib/db.js
 * Supabase client + report storage/retrieval helpers
 *
 * Supabase SQL to run once in your project:
 * ─────────────────────────────────────────
 * create table reports (
 *   id           uuid default gen_random_uuid() primary key,
 *   date         date not null unique,
 *   report       jsonb not null,
 *   items_count  int,
 *   fetch_ms     int,
 *   ai_ms        int,
 *   created_at   timestamptz default now()
 * );
 *
 * create index on reports (date desc);
 * ─────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";

let _supabase = null;

function getClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[DB] Supabase env vars missing — running without persistence");
    return null;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

// ─── Save today's report ──────────────────────────────────────────────────────
export async function saveReport({ report, itemsCount, fetchMs, aiMs }) {
  const db = getClient();
  if (!db) return null;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await db
    .from("reports")
    .upsert(
      {
        date: today,
        report,
        items_count: itemsCount,
        fetch_ms: fetchMs,
        ai_ms: aiMs,
      },
      { onConflict: "date" }
    )
    .select()
    .single();

  if (error) {
    console.error("[DB] Save failed:", error.message);
    return null;
  }

  console.log(`[DB] Report saved for ${today}`);
  return data;
}

// ─── Get latest report ────────────────────────────────────────────────────────
export async function getLatestReport() {
  const db = getClient();
  if (!db) return null;

  const { data, error } = await db
    .from("reports")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.warn("[DB] Fetch latest failed:", error.message);
    return null;
  }

  return data;
}

// ─── Get report by date ───────────────────────────────────────────────────────
export async function getReportByDate(date) {
  const db = getClient();
  if (!db) return null;

  const { data, error } = await db
    .from("reports")
    .select("*")
    .eq("date", date)
    .single();

  if (error) return null;
  return data;
}

// ─── List available report dates ─────────────────────────────────────────────
export async function listReportDates(limit = 30) {
  const db = getClient();
  if (!db) return [];

  const { data, error } = await db
    .from("reports")
    .select("date, items_count, created_at")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ─── Check if today's report exists ──────────────────────────────────────────
export async function todayReportExists() {
  const db = getClient();
  if (!db) return false;

  const today = new Date().toISOString().split("T")[0];
  const { data } = await db
    .from("reports")
    .select("id")
    .eq("date", today)
    .single();

  return !!data;
}
