// Forty Acres Housing Map AI helper (Supabase Edge Function "ai").
// Needs secret GEMINI_API_KEY. Uses the free Gemini API tier.
// Actions: {action:"ask", question, history?} and {action:"add", query, website?}
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const GKEY = Deno.env.get("GEMINI_API_KEY") || "";
const DAILY = Number(Deno.env.get("AI_DAILY_LIMIT") || "25");
const ADMIN_DAILY = 200;
const MAX_DRIVE_MIN = 20; // same as the map's outer "~20 min drive" ring

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const out = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const CAMPUS: [number, number][] = [[-97.7420,30.2896],[-97.7420,30.2812],[-97.7398,30.2810],[-97.7392,30.2772],[-97.7345,30.2740],[-97.7318,30.2752],[-97.7300,30.2800],[-97.7284,30.2838],[-97.7270,30.2868],[-97.7298,30.2878],[-97.7340,30.2893],[-97.7380,30.2896]];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function edgeMiles(lng: number, lat: number) {
  const k = Math.cos(30.285 * Math.PI / 180), M = 69.0;
  const P = (p: [number, number]) => [p[0] * M * k, p[1] * M];
  const [x, y] = P([lng, lat]); const poly = CAMPUS.map(P);
  let inside = false, best = 1e12;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    const dx = xj - xi, dy = yj - yi, l2 = dx * dx + dy * dy;
    let u = l2 ? ((x - xi) * dx + (y - yi) * dy) / l2 : 0; u = Math.max(0, Math.min(1, u));
    const ex = xi + u * dx - x, ey = yi + u * dy - y; best = Math.min(best, ex * ex + ey * ey);
  }
  return inside ? 0 : Math.sqrt(best);
}
const times = (mi: number) => { const r = mi * 1.25; return { walk: Math.max(1, Math.round(r * 20)), drive: Math.max(3, Math.round(3 + r * 2.2)) }; };

// ---- Gemini ----
let MODEL: string | null = Deno.env.get("GEMINI_MODEL") || null;
const PREF = ["gemini-3.5-flash-lite","gemini-3.1-flash-lite","gemini-2.5-flash-lite","gemini-2.5-flash","gemini-2.0-flash-lite","gemini-2.0-flash","gemini-flash-lite-latest","gemini-flash-latest"];
async function pickModel() {
  if (MODEL) return MODEL;
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${GKEY}`);
  const j = await r.json();
  const names: string[] = (j.models || []).filter((m: any) => (m.supportedGenerationMethods || []).includes("generateContent")).map((m: any) => m.name.replace(/^models\//, ""));
  MODEL = PREF.find(p => names.includes(p)) || names.find(n => /flash-lite/.test(n) && !/preview|exp|tts|image|live|audio/.test(n)) || names.find(n => /flash/.test(n) && !/preview|exp|tts|image|live|audio/.test(n)) || "gemini-2.5-flash-lite";
  return MODEL;
}
async function gemini(contents: any[], opts: { system?: string; json?: boolean; search?: boolean } = {}) {
  const model = await pickModel();
  const body: any = { contents, generationConfig: { temperature: 0.2, maxOutputTokens: 2048 } };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };
  if (opts.json) body.generationConfig.responseMimeType = "application/json";
  if (opts.search) body.tools = [{ google_search: {} }];
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GKEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) { const e: any = new Error(j?.error?.message || ("Gemini error " + r.status)); e.status = r.status; throw e; }
  const c = j.candidates?.[0];
  const text = (c?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
  const urls = (c?.groundingMetadata?.groundingChunks || []).map((g: any) => g.web?.uri).filter(Boolean);
  return { text, urls };
}
const parseJson = (t: string) => { try { return JSON.parse(t.replace(/^```(json)?|```$/g, "").trim()); } catch { const m = t.match(/\{[\s\S]*\}/); if (m) try { return JSON.parse(m[0]); } catch { /* */ } return null; } };

// ---- helpers ----
async function geocode(q: string) {
  const u = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=us&viewbox=-97.85,30.40,-97.62,30.18&bounded=1&q=" + encodeURIComponent(q);
  const r = await fetch(u, { headers: { "User-Agent": "FortyAcresHousingMap/1.0 (student housing map)" } });
  if (!r.ok) return null; const j = await r.json(); const h = j?.[0];
  return h ? { lat: Number(h.lat), lng: Number(h.lon), label: h.display_name as string } : null;
}
async function pageText(url: string) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (FortyAcresHousingMap)" }, redirect: "follow", signal: AbortSignal.timeout(12000) });
    if (!r.ok) return null; const h = await r.text();
    return h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").slice(0, 40000);
  } catch { return null; }
}
const safeUrl = (u: unknown) => typeof u === "string" && /^https?:\/\/[^\s"'<>]{3,300}$/.test(u) ? u : null;
const str = (v: unknown, n = 300) => typeof v === "string" ? v.slice(0, n) : null;
const num = (v: unknown) => typeof v === "number" && isFinite(v) && v > 0 && v < 10000 ? Math.round(v) : null;
const bool = (v: unknown) => v === true ? true : v === false ? false : null;

const FIELDS = `Return JSON only, with these keys (use null when unknown, never guess):
{"found":true|false,"name":string,"kind":"apartment"|"dorm"|"house"|"condo","address":"street, Austin, TX zip","website":"official site url","neighborhood":"West Campus"|"North Campus"|"Riverside"|"Hyde Park"|"Downtown"|"East Austin"|"Other",
"priceMin":number (lowest monthly price per person for one bedroom),"priceMax":number,"priceNote":"what the price covers, which floor plan, and the date you saw it",
"plans":["1x1","2x2","4x4",...],"pool":true|false|null,"privateBath":"all"|"some"|"none"|null,"windowsEveryBedroom":true|false|null,"balcony":"all units"|"some units"|"none"|null,
"furnished":true|false|null,"gym":true|false|null,"petFriendly":true|false|null,"inUnitLaundry":true|false|null,"parkingPerMonth":number|null,"utilitiesIncluded":string|null,
"notes":"one or two short helpful sentences","sources":["urls you used"]}
Set found=false if you can't confirm this is a real housing place in Austin, TX.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return out({ error: "POST only" }, 405);
  if (!GKEY) return out({ error: "The AI isn't set up yet (missing key)." }, 503);
  const auth = req.headers.get("Authorization") || "";
  const userSb = createClient(SB_URL, ANON, { global: { headers: { Authorization: auth } } });
  const { data: u } = await userSb.auth.getUser();
  if (!u?.user) return out({ error: "Please sign in." }, 401);
  const { data: approved } = await userSb.rpc("is_approved");
  if (approved !== true) return out({ error: "Your account isn't approved yet." }, 403);
  const { data: admin } = await userSb.rpc("is_admin");
  const db = createClient(SB_URL, SERVICE);

  // daily limit
  const day = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const { data: used, error: uerr } = await db.from("ai_usage").select("count").eq("user_id", u.user.id).eq("day", day).maybeSingle();
  const limit = admin ? ADMIN_DAILY : DAILY;
  if (!uerr) {
    if ((used?.count || 0) >= limit) return out({ error: `You've used today's ${limit} AI questions. Try again tomorrow.` }, 429);
    await db.from("ai_usage").upsert({ user_id: u.user.id, day, count: (used?.count || 0) + 1 }, { onConflict: "user_id,day" });
  }

  let body: any = {}; try { body = await req.json(); } catch { /* */ }
  try {
    if (body.action === "ask") return out(await ask(db, u.user.id, String(body.question || "").slice(0, 600), Array.isArray(body.history) ? body.history.slice(-6) : []));
    if (body.action === "add") return out(await add(db, u.user, String(body.query || "").slice(0, 200), safeUrl(body.website)));
    return out({ error: "Unknown action" }, 400);
  } catch (e: any) {
    const msg = e?.status === 429 ? "The free AI is busy or out of free uses for now. Try again in a minute (or tomorrow)." : "Something went wrong with the AI. Try again.";
    console.error(e?.message || e);
    return out({ error: msg }, 500);
  }
});

async function allPlaces(db: any) {
  const rows: any[] = [];
  for (let f = 0; ; f += 1000) { const { data } = await db.from("places").select("id,data").range(f, f + 999); rows.push(...(data || [])); if (!data || data.length < 1000) break; }
  return rows.map(r => ({ id: r.id, ...r.data }));
}
const yn = (v: any) => v === true ? "yes" : v === false ? "no" : v == null ? "?" : String(v);
function line(p: any) {
  const t = p.lat && p.lng ? times(edgeMiles(p.lng, p.lat)) : null;
  return `${p.name} | ${p.kind || "apartment"} | ${p.neighborhood || ""} | ${p.priceMin ? "$" + p.priceMin + (p.priceMax && p.priceMax !== p.priceMin ? "-" + p.priceMax : "") : "price ?"} | walk ${t ? t.walk + " min" : "?"} | pool ${yn(p.pool)} | own bath ${yn(p.privateBath)} | balcony ${yn(p.balcony)} | windows every bedroom ${yn(p.windowsEveryBedroom)} | plans ${(p.plans || []).join(",")}`;
}

async function ask(db: any, uid: string, q: string, history: any[]) {
  if (!q.trim()) return { answer: "Ask me anything about the places on the map." };
  const places = await allPlaces(db);
  const { data: hearts } = await db.from("hearts").select("place_id").eq("user_id", uid);
  const saved = new Set((hearts || []).map((h: any) => h.place_id));
  const ql = q.toLowerCase();
  const detail = places.filter(p => saved.has(p.id) || (p.name && ql.includes(p.name.toLowerCase()))).slice(0, 40)
    .map(p => { const { sources, tags, special, ...rest } = p; return JSON.stringify({ ...rest, saved: saved.has(p.id) }); });
  const system = `You help UT Austin students compare student housing on the Forty Acres Housing Map.
Answer ONLY from the place data below. If something isn't in the data, say you don't know and suggest checking the place's website. Prices are per person per month unless the note says otherwise. Walk times are to the closest edge of campus.
Be short, plain and friendly. Use short bullet lists for comparisons. Don't make up places or numbers. Today is ${new Date().toDateString()}.
The user's saved places are marked saved:true.

ALL PLACES (one per line):
${places.map(line).join("\n")}

DETAILS FOR SAVED OR MENTIONED PLACES:
${detail.join("\n")}`;
  const contents = [...history.filter((h: any) => h && typeof h.text === "string").map((h: any) => ({ role: h.role === "ai" ? "model" : "user", parts: [{ text: h.text.slice(0, 1500) }] })), { role: "user", parts: [{ text: q }] }];
  const r = await gemini(contents, { system });
  return { answer: r.text || "I couldn't come up with an answer. Try asking another way." };
}

async function add(db: any, user: any, query: string, website: string | null) {
  if (query.trim().length < 3) return { ok: false, message: "Type the name of the place." };
  const places = await allPlaces(db);
  const qs = slug(query);
  const dup = places.find(p => p.id === qs || slug(p.name || "").includes(qs) || qs.includes(slug(p.name || "") || "@@"));
  if (dup) return { ok: false, exists: true, id: dup.id, message: `${dup.name} is already on the map.` };

  // 1) Try web search (Gemini + Google Search). 2) Fall back to the website the user gave.
  let info: any = null, urls: string[] = [];
  try {
    const r = await gemini([{ role: "user", parts: [{ text: `Find this student housing place near the University of Texas at Austin: "${query}"${website ? " (website: " + website + ")" : ""}. Use its official website first, then other reliable sources. For prices, use the 2027-28 school year if listed, otherwise the newest.\n${FIELDS}` }] }], { search: true });
    info = parseJson(r.text); urls = r.urls;
  } catch (e) { console.error("search failed", (e as any)?.message); }
  if ((!info || !info.found) && website) {
    const text = await pageText(website);
    if (!text) return { ok: false, message: "I couldn't open that website. Check the link and try again." };
    const r = await gemini([{ role: "user", parts: [{ text: `This is the text of ${website}. Pull out the facts about "${query}" from it only.\n${FIELDS}\n\nPAGE TEXT:\n${text}` }] }], { json: true });
    info = parseJson(r.text); if (info) info.sources = [website, ...(info.sources || [])];
  }
  if (!info || !info.found || !str(info.name)) {
    return { ok: false, needWebsite: !website, message: website ? `I couldn't confirm "${query}" is a real place in Austin.` : `I couldn't find "${query}". If you have its website link, add it and try again.` };
  }
  // Check it's real: the address has to be a real spot in Austin.
  const geo = (info.address && await geocode(info.address)) || await geocode(`${info.name}, Austin, TX`);
  if (!geo) return { ok: false, message: `I found "${info.name}" but couldn't confirm its address on a map, so I didn't add it.` };
  const mi = edgeMiles(geo.lng, geo.lat), t = times(mi);
  if (t.drive > MAX_DRIVE_MIN) return { ok: false, tooFar: true, message: `${info.name} is about a ${t.drive}-minute drive from campus, which is outside the map's area, so I didn't add it.` };

  const name = str(info.name, 80)!;
  const id = slug(name);
  if (places.some(p => p.id === id)) return { ok: false, exists: true, id, message: `${name} is already on the map.` };
  const sources = [...new Set([...(Array.isArray(info.sources) ? info.sources : []), ...urls].map(safeUrl).filter(Boolean))].slice(0, 6);
  const kinds = ["apartment", "dorm", "house", "condo"];
  const data: any = {
    name, lat: Math.round(geo.lat * 1e5) / 1e5, lng: Math.round(geo.lng * 1e5) / 1e5, coordsEstimated: true,
    kind: kinds.includes(info.kind) ? info.kind : "apartment", address: str(info.address, 160) || geo.label.slice(0, 160),
    neighborhood: str(info.neighborhood, 40) || "Other", website: safeUrl(info.website) || website || null,
    priceMin: num(info.priceMin), priceMax: num(info.priceMax) || num(info.priceMin), priceNote: str(info.priceNote, 300),
    plans: Array.isArray(info.plans) ? info.plans.filter((x: any) => typeof x === "string" && /^(studio|\d+x\d+(\.5)?)$/i.test(x)).slice(0, 12) : [],
    pool: bool(info.pool), privateBath: ["all", "some", "none"].includes(info.privateBath) ? info.privateBath : null,
    windowsEveryBedroom: bool(info.windowsEveryBedroom), balcony: str(info.balcony, 30), furnished: bool(info.furnished), gym: bool(info.gym),
    petFriendly: bool(info.petFriendly), inUnitLaundry: bool(info.inUnitLaundry), parkingPerMonth: num(info.parkingPerMonth),
    utilitiesIncluded: str(info.utilitiesIncluded, 80), notes: str(info.notes, 300), sources, tags: [], special: [],
    addedByAI: true, addedBy: user.email, addedAt: new Date().toISOString(),
  };
  if (data.pool) data.tags.push("pool");
  if (data.privateBath === "all") data.tags.push("private_bathrooms");
  const { data: mx } = await db.from("places").select("ord").order("ord", { ascending: false, nullsFirst: false }).limit(1);
  const ord = ((mx?.[0]?.ord) || places.length) + 1;
  const { error } = await db.from("places").insert({ id, data, ord });
  if (error) { console.error(error); return { ok: false, message: "I found it but couldn't save it. Try again." }; }
  return { ok: true, id, place: data, walk: t.walk, message: `Added ${name}. It's about a ${t.walk}-minute walk to campus.` };
}
