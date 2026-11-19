/* goed bezig: sync backend. Lives inside a Google Sheet (Extensions > Apps Script).
   Deployed as a web app: execute as me, access anyone. The game sends a secret code with
   every request; without it nothing is read or written.

   What it keeps in the Sheet:
   - "Progress": one row per day you played (words met, known, by heart, wafels, streak).
   - "Words":    all words with their strength, rewritten on every save.
   - "_state":   the game's own save, as text. Hidden. Do not edit.

   SECRET is set in the deployed copy only. The copy in the public GitHub repo keeps the placeholder. */
const SECRET = 'PASTE-A-LONG-RANDOM-CODE-HERE';
const TAB_STATE = '_state', TAB_PROGRESS = 'Progress', TAB_WORDS = 'Words';
const CHUNK = 40000, MAX_STATE = 900000;

function doGet() {
  return ContentService.createTextOutput('goed bezig sync is running.');
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad request' }); }
  if (SECRET.length < 24 || SECRET.indexOf('PASTE-') === 0) return out_({ ok: false, error: 'backend has no secret yet' });
  if (!body || body.key !== SECRET) return out_({ ok: false, error: 'wrong code' });

  const lock = LockService.getScriptLock();
  try { lock.waitLock(25000); } catch (err) { return out_({ ok: false, error: 'busy, try again' }); }
  try {
    const props = PropertiesService.getScriptProperties();
    const rev = Number(props.getProperty('REV') || 0);
    if (body.action === 'pull') return out_({ ok: true, rev: rev, state: readState_() });
    if (body.action === 'push') {
      if (Number(body.baseRev) !== rev) return out_({ ok: false, conflict: true, rev: rev, state: readState_() });
      const text = JSON.stringify(body.state || {});
      if (text.length > MAX_STATE) return out_({ ok: false, error: 'save too large' });
      writeState_(text);
      if (body.summary) writeProgress_(body.summary);
      if (body.words) writeWords_(body.words);
      props.setProperty('REV', String(rev + 1));
      return out_({ ok: true, rev: rev + 1 });
    }
    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err).slice(0, 200) });
  } finally {
    lock.releaseLock();
  }
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function tab_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (header) { sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold'); sh.setFrozenRows(1); }
    if (name === TAB_STATE) sh.hideSheet();
  }
  return sh;
}

function readState_() {
  const sh = tab_(TAB_STATE);
  const n = sh.getLastRow();
  if (!n) return null;
  const text = sh.getRange(1, 1, n, 1).getValues().map(function (r) { return r[0]; }).join('');
  try { return JSON.parse(text); } catch (err) { return null; }
}

function writeState_(text) {
  const sh = tab_(TAB_STATE);
  const rows = [];
  for (let i = 0; i < text.length; i += CHUNK) rows.push([text.slice(i, i + CHUNK)]);
  sh.clearContents();
  sh.getRange(1, 1, rows.length, 1).setNumberFormat('@').setValues(rows);
}

/* Text from the game goes into cells as text, never as a formula. */
function safe_(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const s = String(v == null ? '' : v).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function writeProgress_(s) {
  const header = ['Date', 'Words met', 'Known', 'By heart', 'Wafels', 'Level', 'Days in a row', 'Answers that day', 'Right that day', 'Last saved', 'From'];
  const sh = tab_(TAB_PROGRESS, header);
  const date = String(s.date || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  const row = [date, Number(s.met) || 0, Number(s.known) || 0, Number(s.byHeart) || 0, Number(s.wafels) || 0, safe_(s.level),
    Number(s.streak) || 0, Number(s.answers) || 0, Number(s.right) || 0, new Date(), safe_(s.device)];
  const n = sh.getLastRow();
  let at = n + 1;
  if (n > 1) {
    const dates = sh.getRange(2, 1, n - 1, 1).getDisplayValues();
    for (let i = 0; i < dates.length; i++) if (dates[i][0] === date) { at = i + 2; break; }
  }
  sh.getRange(at, 1).setNumberFormat('@');
  sh.getRange(at, 1, 1, row.length).setValues([row]);
}

function writeWords_(words) {
  const header = ['Place', 'Dutch', 'English', 'Strength (0 to 5)', 'Status', 'Right', 'Wrong', 'Comes back on'];
  const sh = tab_(TAB_WORDS, header);
  if (!Array.isArray(words) || !words.length || words.length > 1000) return;
  const rows = words.map(function (w) {
    const r = []; for (let i = 0; i < header.length; i++) r.push(safe_(w[i])); return r;
  });
  const n = sh.getLastRow();
  if (n > 1) sh.getRange(2, 1, n - 1, header.length).clearContent();
  sh.getRange(2, 1, rows.length, header.length).setValues(rows);
}
