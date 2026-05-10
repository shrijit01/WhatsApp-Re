export function parseDateStr(dateStr, fmt) {
  const p = dateStr.split('/[\/\.]/');
  if (p.length < 3) return null;
  const day   = parseInt(fmt === 'MM/DD' ? p[1] : p[0]);
  const month = parseInt(fmt === 'MM/DD' ? p[0] : p[1]) - 1;
  const year  = p[2].length === 2 ? 2000 + parseInt(p[2]) : parseInt(p[2]);
  const dt    = new Date(year, month, day);
  return isNaN(dt.getTime()) ? null : dt;
}

export function formatDateLabel(dateStr, fmt) {
  try {
    const dt = parseDateStr(dateStr, fmt);
    if (!dt) return dateStr;
    const now       = new Date();
    const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dtDay     = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    if (dtDay.getTime() === today.getTime())     return 'Today';
    if (dtDay.getTime() === yesterday.getTime()) return 'Yesterday';
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
