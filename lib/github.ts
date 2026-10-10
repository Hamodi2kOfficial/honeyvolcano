/**
 * Minimal GitHub Contents API client used by the /admin dashboard to read and
 * write the content/*.json files. The owner's fine-grained token (repo Contents
 * read/write) lives only in their browser (localStorage) — never in this code,
 * never shipped to visitors. Writing a file commits to `main`, which triggers a
 * Netlify rebuild, so edits go live in ~1–2 minutes.
 */
const OWNER = "Hamodi2kOfficial";
const REPO = "honeyvolcano";
const BRANCH = "main";
// content files live under the Next app folder in the repo
const BASE = "medaus-site";
const API = "https://api.github.com";

const TOKEN_KEY = "hv-admin-token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token.trim());
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function b64ToText(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function textToB64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

/** Verify the token can access the repo; returns the repo's full name on success. */
export async function verifyToken(token: string): Promise<string> {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(
      res.status === 401 || res.status === 403
        ? "That token was rejected. Check it has access to the honeyvolcano repository (Contents: read & write)."
        : `Could not reach GitHub (${res.status}).`
    );
  }
  const json = await res.json();
  return json.full_name as string;
}

export type LoadedFile<T> = { data: T; sha: string };

/** Read and parse a JSON file from the repo, returning its data + sha (needed to save). */
export async function loadJson<T>(path: string, token: string): Promise<LoadedFile<T>> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${BASE}/${path}?ref=${BRANCH}`,
    { headers: headers(token), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Could not read ${path} (${res.status}).`);
  const json = await res.json();
  return { data: JSON.parse(b64ToText(json.content)) as T, sha: json.sha };
}

/** Write a JSON file back to the repo (commits to main → Netlify rebuild). */
export async function saveJson(
  path: string,
  data: unknown,
  sha: string,
  token: string,
  message: string
): Promise<string> {
  const text = JSON.stringify(data, null, 2) + "\n";
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${BASE}/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: textToB64(text), sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Save failed (${res.status}). ${detail.slice(0, 160)}`);
  }
  const json = await res.json();
  return json.content.sha as string;
}
