import { normalizeSession } from "./sessionNormalizer.js";

function mergeTwo(a, b) {
  const out = { ...a };

  if (b.session_stop) out.session_stop = b.session_stop;

  if (!out.session_updated && b.session_updated) {
    out.session_updated = b.session_updated;
  } else if (out.session_updated && b.session_updated) {
    if (new Date(b.session_updated) > new Date(out.session_updated)) {
      out.session_updated = b.session_updated;
    }
  }

  for (const k of Object.keys(out)) {
    if ((out[k] === null || out[k] === "") && b[k] != null) {
      out[k] = b[k];
    }
  }

  return out;
}

export function mergeSessions(startArr = [], endArr = []) {
  const map = new Map();

  for (const s of startArr) {
    const row = normalizeSession(s);
    if (!row.session_id) continue;
    map.set(row.session_id, row);
  }

  for (const s of endArr) {
    const row = normalizeSession(s);
    if (!row.session_id) continue;

    const existing = map.get(row.session_id);
    map.set(row.session_id, existing ? mergeTwo(existing, row) : row);
  }

  return [...map.values()];
}
