/**
 * parseWhatsAppChat
 * Supports Android (DD/MM/YYYY, HH:MM - Name: msg)
 *         iOS     ([DD/MM/YYYY, HH:MM:SS] Name: msg)
 *         12-hour and 24-hour clocks
 *         Edited messages   (<This message was edited>)
 *         System messages
 *         Multi-line messages (continuation lines)
 */

const iOSMsg = /^\[(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\]\s(.+?):\s(.*)$/;
const androidMsg = /^(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s?[AaPp][Mm])?)\s[-–]\s(.+?):\s(.*)$/;
const iOSSys = /^\[(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\]\s(.*)$/;
const androidSys = /^(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s?[AaPp][Mm])?)\s[-–]\s(.*)$/;
const EDITED_RE = /\s*<This message was edited>\s*$/i;

function stripEdited(t) {
  const clean = t.replace(EDITED_RE, '').trimEnd();
  return { clean, edited: clean.length < t.trimEnd().length };
}

export function parseWhatsAppChat(text) {
  const lines = text.split(/\r?\n/);
  const msgs = [];
  let cur = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    let m;

    if ((m = iOSMsg.exec(t))) {
      if (cur) msgs.push(cur);
      const { clean, edited } = stripEdited(m[4]);
      cur = { date: m[1], time: m[2], sender: m[3].trim(), text: clean, edited, type: 'msg' };

    } else if ((m = androidMsg.exec(t))) {
      if (cur) msgs.push(cur);
      const { clean, edited } = stripEdited(m[4]);
      cur = { date: m[1], time: m[2], sender: m[3].trim(), text: clean, edited, type: 'msg' };

    } else if ((m = iOSSys.exec(t))) {
      if (cur) msgs.push(cur);
      cur = { date: m[1], time: m[2], sender: null, text: m[3], edited: false, type: 'sys' };

    } else if ((m = androidSys.exec(t))) {
      if (cur) msgs.push(cur);
      cur = { date: m[1], time: m[2], sender: null, text: m[3], edited: false, type: 'sys' };

    } else if (cur) {
      // Continuation line
      const combined = cur.text + '\n' + t;
      const { clean, edited } = stripEdited(combined);
      cur.text = clean;
      if (edited) cur.edited = true;
    }
  }

  if (cur) msgs.push(cur);
  return msgs;
}

export function getSenders(msgs) {
  const s = new Set();
  msgs.forEach(m => { if (m.sender) s.add(m.sender); });
  return [...s];
}

export function groupByDate(msgs) {
  const g = {};
  msgs.forEach(m => { (g[m.date] = g[m.date] || []).push(m); });
  return g;
}

/** Auto-detect DD/MM vs MM/DD by checking which first-part value ever exceeds 12 */
export function detectDateFormat(msgs) {
  let firstMax = 0, secondMax = 0;
  for (const m of msgs) {
    const p = m.date.split(/[\/\.]/);
    if (p.length >= 2) {
      firstMax  = Math.max(firstMax,  parseInt(p[0]) || 0);
      secondMax = Math.max(secondMax, parseInt(p[1]) || 0);
    }
  }
  if (firstMax  > 12) return 'DD/MM';
  if (secondMax > 12) return 'MM/DD';
  return 'DD/MM'; // international default
}
