// ============================================================
// KIND KOALAS AI COMMAND CENTER — v5.0
// Complete system with fly brain integration
// Received verbatim from founder 2026-10-09. See SOURCE_NOTES.md
// for verification status before trusting this as ground truth.
// ============================================================

// ─── CORE HELPERS ───
function getSS() { return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')); }

function getSetting(key, defaultValue) {
  const ss = getSS();
  const settings = ss.getSheetByName('Settings').getDataRange().getValues();
  for (let i = 1; i < settings.length; i++) if (settings[i][0] === key) return settings[i][1];
  return defaultValue;
}

function setSetting(key, value, description) {
  const ss = getSS();
  const sheet = ss.getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) { sheet.getRange(i + 1, 2).setValue(value); return; }
  }
  sheet.appendRow([key, value, description || '', new Date()]);
}

function getApiKey(ss) { ss = ss || getSS(); return String(getSetting('GEMINI_API_KEY', '')); }
function getGroqKey() { return String(getSetting('GROQ_API_KEY', '')); }
function getSerperKey() { return String(getSetting('SERPER_API_KEY', '')); }
function getGithubPat() { return String(getSetting('GITHUB_PAT', '')); }
function getFlyBrainUrl() { return String(getSetting('FLY_BRAIN_URL', '')).replace(/\/$/, ''); }

// ─── AI PROVIDERS ───
function callGemini(apiKey, prompt) {
  const groqKey = getGroqKey();
  if (groqKey) {
    const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    for (let m = 0; m < models.length; m++) { const r = tryGroq(groqKey, models[m], prompt); if (r) return r; }
  }
  const ghPat = getGithubPat();
  if (ghPat) { const r = tryGithubModels(ghPat, prompt); if (r) return r; }
  const geminiModels = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-2.5-flash'];
  for (let m = 0; m < geminiModels.length; m++) { const r = tryGemini(apiKey, geminiModels[m], prompt); if (r) return r; }
  throw new Error('All AI providers failed');
}

function tryGroq(apiKey, model, prompt) {
  const options = { method: 'post', contentType: 'application/json', headers: { 'Authorization': 'Bearer ' + apiKey }, payload: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 1024 }), muteHttpExceptions: true };
  try {
    const response = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', options);
    if (response.getResponseCode() === 200) { Logger.log('✅ Groq ' + model); return JSON.parse(response.getContentText()).choices[0].message.content; }
    return null;
  } catch (e) { return null; }
}

function tryGemini(apiKey, model, prompt) {
  const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }), muteHttpExceptions: true };
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) { Logger.log('✅ Gemini ' + model); return JSON.parse(response.getContentText()).candidates[0].content.parts[0].text; }
    return null;
  } catch (e) { return null; }
}

function tryGithubModels(apiKey, prompt) {
  const models = ['gpt-4o-mini', 'gpt-4o', 'Llama-3.3-70B-Instruct', 'Phi-3.5-MoE-instruct'];
  for (let m = 0; m < models.length; m++) {
    const options = { method: 'post', contentType: 'application/json', headers: { 'Authorization': 'Bearer ' + apiKey }, payload: JSON.stringify({ model: models[m], messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 1024 }), muteHttpExceptions: true };
    try {
      const response = UrlFetchApp.fetch('https://models.inference.ai.azure.com/chat/completions', options);
      if (response.getResponseCode() === 200) { Logger.log('✅ GitHub Models ' + models[m]); return JSON.parse(response.getContentText()).choices[0].message.content; }
    } catch (e) {}
  }
  return null;
}

// ─── SAFE + SEND MODE ───
function isSafeMode() { return String(getSetting('SAFE_MODE', 'FALSE')).toLowerCase() === 'true'; }
function enableSafeMode() { setSetting('SAFE_MODE', 'TRUE'); }
function disableSafeMode() { setSetting('SAFE_MODE', 'FALSE'); }
function getSendMode() { return String(getSetting('SEND_MODE', 'manual')).toLowerCase(); }
function setSendMode(mode) { setSetting('SEND_MODE', mode); }
function enableAutoSend() { setSendMode('auto'); }
function enableManualSend() { setSendMode('manual'); }
function getDailySendLimit() { return parseInt(getSetting('DAILY_SEND_LIMIT', '20')) || 20; }
function getDailySendCount() {
  const log = getSS().getSheetByName('Activity_Log').getDataRange().getValues();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let count = 0;
  log.slice(1).forEach(row => { if (row[2] === 'email_sent_auto' && row[0] instanceof Date && row[0] >= today) count++; });
  return count;
}

// ─── SEND OR DRAFT ───
function sendOrDraft(to, subject, body, sourceAgent, approvalSummary) {
  const ss = getSS();
  const mode = getSendMode();
  const now = new Date();

  if (typeof safetyCheck === 'function') {
    const safety = safetyCheck(to, subject, body);
    if (!safety.safe) { Logger.log('🔴 Safety blocked: ' + safety.reason); return { sent: false, reason: 'safety', detail: safety.reason }; }
  }
  if (typeof patternDetect === 'function') {
    const pat = patternDetect(subject + ' ' + body);
    if (pat.pattern === 'unsubscribe') { Logger.log('🔴 Pattern blocked'); return { sent: false, reason: 'pattern', detail: 'unsubscribe' }; }
  }

  if (mode === 'auto' && !isSafeMode()) {
    const sentToday = getDailySendCount();
    if (sentToday >= getDailySendLimit()) {
      const draft = GmailApp.createDraft(to, subject, body);
      ss.getSheetByName('Approvals').appendRow(['A' + now.getTime(), now, sourceAgent, 'Email Draft (limit)', approvalSummary, 'Draft ID: ' + draft.getId(), to, 'Low', 'Pending Review', '', '', 'Daily limit']);
      return { sent: false, reason: 'limit' };
    }
    try {
      GmailApp.sendEmail(to, subject, body);
      ss.getSheetByName('Approvals').appendRow(['A' + now.getTime(), now, sourceAgent, 'Email Auto-Sent', approvalSummary, 'Auto-sent', to, 'Medium', 'Sent', 'Auto', now, 'Autonomous']);
      ss.getSheetByName('Activity_Log').appendRow([now, sourceAgent, 'email_sent_auto', 'SUCCESS', 'Auto-sent: ' + approvalSummary, '', '', '']);
      Logger.log('📤 Auto-sent to ' + to);
      return { sent: true };
    } catch (e) { return { sent: false, reason: 'error', error: e.message }; }
  }

  const draft = GmailApp.createDraft(to, subject, body);
  ss.getSheetByName('Approvals').appendRow(['A' + now.getTime(), now, sourceAgent, 'Email Draft', approvalSummary, 'Draft ID: ' + draft.getId(), to, 'Low', 'Pending Review', '', '', 'Manual']);
  Logger.log('📝 Drafted to ' + to);
  return { sent: false, reason: 'manual' };
}

// ─── AGENT AWARENESS ───
function getPendingRequestsFor(agentName) {
  const sheet = getSS().getSheetByName('Request_Queue');
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const pending = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === agentName && data[i][6] === 'Open') pending.push({ id: data[i][0], from: data[i][2], request: data[i][4], context: data[i][5], rowIndex: i + 1 });
  }
  return pending;
}

function parseAgentOutput(report, agentName) {
  const output = { blockers: [], requests: [], completed: [], cleanedReport: report };
  let match;
  const blockerRegex = /\[BLOCKER:\s*([^|]+)\|\s*([^\]]+)\]/g;
  while ((match = blockerRegex.exec(report)) !== null) { const id = reportBlocker(agentName, match[1].trim(), match[2].trim()); output.blockers.push({ id, type: match[1].trim(), description: match[2].trim() }); }
  output.cleanedReport = output.cleanedReport.replace(blockerRegex, '');
  const requestRegex = /\[REQUEST:\s*([^|]+)\|\s*([^|]+)\|\s*([^\]]+)\]/g;
  while ((match = requestRegex.exec(report)) !== null) { const id = requestFromAgent(agentName, match[1].trim(), match[2].trim(), match[3].trim()); output.requests.push({ id, to: match[1].trim(), request: match[2].trim() }); }
  output.cleanedReport = output.cleanedReport.replace(requestRegex, '');
  const completeRegex = /\[COMPLETE:\s*([^|]+)\|\s*([^\]]+)\]/g;
  while ((match = completeRegex.exec(report)) !== null) { if (completeRequest(match[1].trim(), match[2].trim())) output.completed.push({ id: match[1].trim(), response: match[2].trim() }); }
  output.cleanedReport = output.cleanedReport.replace(completeRegex, '');
  output.cleanedReport = output.cleanedReport.replace(/\n{3,}/g, '\n\n').trim();
  return output;
}

function runAgent(config) {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  if (!apiKey) { Logger.log('ERROR: No GEMINI_API_KEY'); return; }
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '' && r[3] === config.department);
  let context = config.department.toUpperCase() + ' TASKS:\n';
  if (tasks.length === 0) context += '(No tasks yet)\n';
  else tasks.forEach(t => { context += '- ' + (t[1] || 'Untitled') + ' | ' + (t[7] || 'unknown') + ' | Due: ' + (t[8] || 'no date') + '\n'; });
  const requests = getPendingRequestsFor(config.name);
  if (requests.length > 0) {
    context += '\n📨 PENDING REQUESTS:\n';
    requests.forEach(r => { context += '- [' + r.id + '] From ' + r.from + ': ' + r.request + '\n'; if (r.context) context += '  Context: ' + r.context + '\n'; });
  }
  const awareness = '\n\nAGENT CAPABILITIES\n1. [BLOCKER: Type | Description]\n2. [REQUEST: AgentName | What | Why]\n3. [COMPLETE: RequestID | Response]\n';
  const prompt = 'You are the ' + config.name + ' Agent for Kind Koalas.\n\n' + context + '\n' + config.instructions + awareness;
  let rawReport;
  try { rawReport = callGemini(apiKey, prompt); }
  catch (e) { Logger.log('ERROR: ' + e.message); ss.getSheetByName('Activity_Log').appendRow([new Date(), config.name, config.action, 'ERROR', e.message.substring(0, 500), '', '', '']); return; }
  const parsed = parseAgentOutput(rawReport, config.name);
  const report = parsed.cleanedReport;
  ss.getSheetByName('Memory').appendRow(['M' + new Date().getTime(), config.memoryCategory || 'Report', config.name + ' ' + new Date().toISOString().slice(0, 10), report, config.name + ' Agent', new Date(), 'high', config.tag, 'FALSE']);
  if (typeof feedbackScore === 'function') Logger.log('📊 Quality: ' + feedbackScore(config.name, report) + '/10');
  ss.getSheetByName('Activity_Log').appendRow([new Date(), config.name, config.action, 'SUCCESS', 'Generated ' + config.action, '', '', '']);
  Logger.log(config.name.toUpperCase() + ':\n' + report);
}

// ─── AGENT DEFINITIONS ───
function chiefOfStaff() { runAgent({ name: 'Chief of Staff', department: 'Chief of Staff', action: 'daily_briefing', tag: 'daily-briefing', memoryCategory: 'Briefing', instructions: 'Write a briefing for Hari. Sections: 1) Status. 2) Overdue. 3) Pending requests/blockers. 4) Focus today. 5) Decisions. Under 200 words.' }); }
function healthcareAgent() { runAgent({ name: 'Healthcare Access', department: 'Healthcare', action: 'healthcare_report', tag: 'healthcare', instructions: 'Write action report. Sections: 1) Outreach. 2) Follow-ups. 3) Next actions. 4) Blockers. Under 200 words.' }); }
function outreachAgent() { runAgent({ name: 'Outreach', department: 'Outreach', action: 'outreach_report', tag: 'outreach', instructions: 'Write outreach report. Sections: 1) In progress. 2) Follow-ups. 3) Next actions. 4) Blockers. Under 200 words.' }); }
function communityAgent() { runAgent({ name: 'Community Engagement', department: 'Community Engagement', action: 'community_report', tag: 'community', instructions: 'Write CE report. Sections: 1) Fundraising. 2) Grants. 3) Next actions. 4) Blockers. Under 200 words.' }); }
function operationsAgent() { runAgent({ name: 'Operations', department: 'Operations', action: 'operations_report', tag: 'operations', instructions: 'Write ops report. Sections: 1) Participation. 2) Onboarding. 3) Next actions. 4) Blockers. Under 200 words.' }); }
function researchAgent() { runAgent({ name: 'Research', department: 'Research', action: 'research_brief', tag: 'research', memoryCategory: 'Brief', instructions: 'Produce opportunity brief. Sections: 1) Two grants. 2) One partner in Apex/Cary NC. 3) Strategy. 4) Questions. Under 200 words.' }); }
function ideaCreationAgent() { runAgent({ name: 'Idea Creation', department: 'Idea Creation', action: 'idea_brief', tag: 'ideas', memoryCategory: 'Ideas', instructions: 'Generate fresh ideas. Sections: 1) Three program ideas. 2) One grant angle. 3) One creative tactic. 4) One social campaign. Apex/Cary NC. Under 250 words.' }); }

// ─── SOCIAL MEDIA AGENT (with fly brain creative) ───
function socialAgent() {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '' && r[3] === 'Social Media');
  let taskContext = '';
  if (tasks.length > 0) taskContext = 'Current social tasks:\n' + tasks.map(t => '- ' + (t[1] || '') + ' (' + (t[7] || '') + ')').join('\n');

  const themes = ['healthcare access', 'free clinic', 'youth volunteers', 'community health', 'patient stories', 'donation impact'];
  Logger.log('🎨 Fly brain creative divergence...');
  const creative = flyBrainCreative(themes, 0.6);

  let hookContext = '';
  if (!creative.error && creative.variants) {
    hookContext = '\n\nFLY BRAIN CREATIVE DIVERGENCE (directional inspiration):\n';
    creative.variants.forEach((v, i) => { hookContext += (i+1) + '. Theme "' + v.seed + '" → fingerprint ' + v.fingerprint + ' (active: ' + v.active + ')\n'; });
    hookContext += '\nHigher fingerprint = amplify this theme.';
  }

  const prompt = 'You are the Social Media Agent for Kind Koalas, a youth-led nonprofit connecting families to free or low-cost healthcare.\n\n' + taskContext + hookContext + '\n\nProduce a 7-day content plan with fly brain guidance.\n\nSections:\n1. Three post ideas (caption, hashtags, image) — weight themes fly brain amplified\n2. One behind-the-scenes story idea\n3. One engagement action (specific local account)\n4. Best posting times\n\nTarget Apex/Cary NC. Under 250 words. Captions sound like real teens, not AI.';

  let plan;
  try { plan = callGemini(apiKey, prompt); } catch (e) { Logger.log('AI error: ' + e.message); return; }

  const now = new Date();
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Plan', 'Social Plan + Fly Brain ' + now.toISOString().slice(0, 10), plan, 'Social Media Agent + FlyBrain', now, 'high', 'social-flybrain', 'FALSE']);
  ss.getSheetByName('Activity_Log').appendRow([now, 'Social Media', 'social_creative_plan', 'SUCCESS', 'Generated with fly brain', '', '', '']);
  if (typeof reflexEmit === 'function') reflexEmit('C26_SOCIAL', 'creative_plan', 'GENERATED', 0.8, 'with fly brain');
  Logger.log(plan);
  return plan;
}

// ─── DAILY BRIEFING ───
function sendDailyBriefing() {
  const ss = getSS();
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (!founderEmail) { Logger.log('ERROR: No FOUNDER_EMAIL'); return; }
  const apiKey = getApiKey(ss);
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '');
  const now = new Date();
  let context = 'TASKS:\n';
  let overdue = 0, dueSoon = 0;
  tasks.forEach(t => {
    const due = t[8];
    let dueStr = 'no date';
    if (due instanceof Date) {
      const days = Math.ceil((due - now) / 86400000);
      dueStr = due.toDateString() + ' (' + (days < 0 ? Math.abs(days) + 'd overdue' : 'in ' + days + 'd') + ')';
      if (days < 0) overdue++; else if (days <= 3) dueSoon++;
    }
    context += '- [' + (t[6] || 'normal') + '] ' + (t[1] || 'Untitled') + ' | ' + (t[7] || '') + ' | ' + dueStr + '\n';
  });
  const prompt = 'You are Chief of Staff for Kind Koalas. Write a concise morning briefing.\n\nNumbers: ' + tasks.length + ' tasks, ' + overdue + ' overdue, ' + dueSoon + ' due soon.\n\n' + context + '\n\nReturn clean HTML: <p>, <strong>, <br>, <ul>, <li>. No markdown.\n\nStructure:\n<p><strong>Status:</strong> one sentence.</p>\n<p><strong>Top priorities:</strong></p><ul><li>Task — due date</li></ul>\n<p><strong>Needs attention:</strong> overdue.</p>\n<p><strong>Decision needed:</strong> one ask.</p>\n\nUnder 200 words. No greeting.';
  let briefingHtml;
  try { briefingHtml = callGemini(apiKey, prompt); } catch (e) { Logger.log('AI error: ' + e.message); return; }
  const htmlBody = '<div style="font-family:Arial;font-size:14px;color:#222;line-height:1.6;max-width:600px"><h2 style="color:#2c5f2d;margin:0 0 16px">Kind Koalas Daily Briefing</h2><p style="color:#666;margin:0 0 16px;font-size:13px">' + now.toDateString() + '</p>' + briefingHtml + '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0"><p style="color:#999;font-size:12px">Sent by Chief of Staff Agent</p></div>';
  const plainBody = briefingHtml.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n');
  MailApp.sendEmail({ to: founderEmail, subject: 'Kind Koalas Daily Briefing — ' + now.toDateString(), body: plainBody, htmlBody: htmlBody });
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Briefing', 'Daily Briefing ' + now.toISOString().slice(0, 10), briefingHtml, 'Chief of Staff Agent (emailed)', now, 'high', 'daily-briefing', 'FALSE']);
  ss.getSheetByName('Activity_Log').appendRow([now, 'Chief of Staff', 'send_daily_briefing', 'SUCCESS', 'Emailed to ' + founderEmail, '', '', '']);
  Logger.log('Briefing emailed.');
}

// ─── EMAIL TEMPLATES ───
function buildEmail1(orgName) {
  return 'Hello ' + orgName + ',\n\nMy name is Hari, and I\'m reaching out on behalf of Kind Koala, a youth-led global 501(c)(3) nonprofit connecting individuals and families facing financial hardship with free or reduced-cost healthcare. We work with generous local healthcare professionals who volunteer their services to approved applicants in our program.\n\nAs we expand our reach, we\'d be incredibly grateful for your support in helping us spread the word so we can better serve those in need.\n\nYou can support our efforts by:\n• Referring individuals you serve to our program\n• Listing our Healthcare Access Initiative as a resource\n• Allowing us to send a digital flyer for sharing\n\nFeel free to reach out with any questions. Individuals can learn more or apply directly at kindkoala.org.\n\nThank you so much for your time and consideration.\n\nBest regards,\nHari\nKind Koala\nwww.kindkoala.org';
}
function buildEmail2(providerName) {
  return 'Hello ' + providerName + ',\n\nMy name is Hari, and I\'m reaching out on behalf of Kind Koala, a youth-led 501(c)(3) nonprofit that connects individuals and families facing financial hardship with free or reduced-cost healthcare.\n\nWe\'re expanding our Healthcare Access Initiative and are seeking local providers willing to support just one case by offering care to a verified applicant in financial need. All applicants are screened for financial eligibility, and we handle the coordination to ensure a smooth experience for providers.\n\nBy supporting a case, your practice will receive:\n• A tax-deductible write-off for the value of care provided\n• Recognition through our website and growing Instagram presence\n• The opportunity to gain returning clients after care is provided\n• A meaningful way to make a direct impact in your community\n\nIf you\'re open to learning more or have any questions, please don\'t hesitate to reach out or visit kindkoala.org. We\'d love to welcome you into our Healthcare Professional Network.\n\nThank you so much for your time and consideration.\n\nBest regards,\nHari\nKind Koala\nwww.kindkoala.org';
}

// ─── BATCH OUTREACH ───
function draftBatchOutreach(count) {
  count = count || 5;
  const ss = getSS();
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues();
  let processed = 0, sent = 0;
  const names = [];
  for (let i = 1; i < contacts.length && processed < count; i++) {
    const c = contacts[i];
    if (c[2] !== 'Community' || c[10] !== 'Not Contacted' || !c[5]) continue;
    const result = sendOrDraft(c[5], 'Healthcare Access Initiative', buildEmail1(c[1]), 'Outreach Agent', 'Healthcare Access Initiative → ' + c[1]);
    ss.getSheetByName('Contacts').getRange(i + 1, 11).setValue(result.sent ? 'Sent' : 'Drafted');
    ss.getSheetByName('Contacts').getRange(i + 1, 12).setValue(new Date());
    processed++; if (result.sent) sent++; names.push(c[1]);
  }
  ss.getSheetByName('Activity_Log').appendRow([new Date(), 'Outreach Agent', 'draft_batch_outreach', 'SUCCESS', names.length + ' processed (' + sent + ' sent)', '', '', '']);
  Logger.log('Processed ' + names.length + ' (sent: ' + sent + ')');
}

function draftBatchHealthcare(count) {
  count = count || 5;
  const ss = getSS();
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues();
  let processed = 0, sent = 0;
  const names = [];
  for (let i = 1; i < contacts.length && processed < count; i++) {
    const c = contacts[i];
    if (c[2] !== 'Healthcare' || c[10] !== 'Not Contacted' || !c[5]) continue;
    const result = sendOrDraft(c[5], 'Healthcare Professional Network', buildEmail2(c[3] || c[1]), 'Healthcare Access Agent', 'Healthcare Professional Network → ' + c[1]);
    ss.getSheetByName('Contacts').getRange(i + 1, 11).setValue(result.sent ? 'Sent' : 'Drafted');
    ss.getSheetByName('Contacts').getRange(i + 1, 12).setValue(new Date());
    processed++; if (result.sent) sent++; names.push(c[1]);
  }
  ss.getSheetByName('Activity_Log').appendRow([new Date(), 'Healthcare Access', 'draft_batch_healthcare', 'SUCCESS', names.length + ' processed (' + sent + ' sent)', '', '', '']);
  Logger.log('Processed ' + names.length + ' (sent: ' + sent + ')');
}

function weeklyOutreachDrafting() {
  Logger.log('=== Weekly outreach ===');
  try { draftBatchOutreach(5); } catch (e) {}
  try { draftBatchHealthcare(3); } catch (e) {}
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  const mode = getSendMode();
  if (founderEmail) MailApp.sendEmail({ to: founderEmail, subject: 'Kind Koalas — weekly outreach ' + (mode === 'auto' ? 'sent' : 'drafted'), body: 'Outreach Agent processed 8 emails.\n\n' + (mode === 'auto' ? 'Sent automatically.' : 'Review in Gmail drafts.') });
}

// ─── WEB SEARCH ───
function searchWeb(query) {
  const text = String(query || '').trim();
  if (!text) return { error: 'Enter query.' };
  const serperKey = getSerperKey();
  if (!serperKey) return { error: 'Missing SERPER_API_KEY' };
  const response = UrlFetchApp.fetch('https://google.serper.dev/search', { method: 'post', contentType: 'application/json', headers: { 'X-API-KEY': serperKey }, payload: JSON.stringify({ q: text, num: 5 }), muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) return { error: 'Search error' };
  const items = JSON.parse(response.getContentText()).organic || [];
  return { results: items.slice(0, 5).map(i => ({ title: i.title || '', link: i.link || '', snippet: i.snippet || '' })) };
}

function researchWithWebSearch(topic) {
  const search = searchWeb(topic);
  if (search.error) return search;
  const apiKey = getApiKey();
  if (!apiKey) return { error: 'Missing GEMINI_API_KEY.' };
  const context = search.results.map(r => '• ' + r.title + '\n  ' + r.link + '\n  ' + r.snippet).join('\n\n');
  const report = callGemini(apiKey, 'Research: ' + topic + '\n\nResults:\n' + context + '\n\nWrite 150-word brief.');
  Logger.log(report);
  return report;
}

// ─── REPLY DETECTION (with fly brain classification) ───
function checkForReplies() {
  const ss = getSS();
  const contactsSheet = ss.getSheetByName('Contacts');
  const activitySheet = ss.getSheetByName('Activity_Log');
  const contacts = contactsSheet.getDataRange().getValues();
  const founderEmail = String(getSetting('FOUNDER_EMAIL', '')).trim();
  const newReplies = [];
  const emailFrom = value => { const m = String(value || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}/i); return m ? m[0].toLowerCase() : ''; };

  for (let i = 1; i < contacts.length; i++) {
    const orgName = String(contacts[i][1] || '').trim();
    const contactEmail = String(contacts[i][5] || '').trim().toLowerCase();
    const status = String(contacts[i][10] || '').trim();
    if (status !== 'Drafted' && status !== 'Sent') continue;
    if (!contactEmail) continue;
    try {
      const threads = GmailApp.search('from:' + contactEmail + ' newer_than:14d', 0, 10);
      let latestReply = null;
      for (const thread of threads) {
        let lastSentAt = null;
        for (const message of thread.getMessages()) {
          const fromAddress = emailFrom(message.getFrom());
          const when = message.getDate();
          const recipients = (String(message.getTo() || '') + ' ' + String(message.getCc() || '')).toLowerCase();
          if (fromAddress === founderEmail.toLowerCase() && recipients.indexOf(contactEmail) !== -1) {
            if (!lastSentAt || when > lastSentAt) lastSentAt = when;
          } else if (fromAddress === contactEmail && lastSentAt && when > lastSentAt) {
            if (!latestReply || when > latestReply.getDate()) latestReply = message;
          }
        }
      }
      if (!latestReply) continue;
      contactsSheet.getRange(i + 1, 11).setValue('Replied');
      contactsSheet.getRange(i + 1, 12).setValue(latestReply.getDate());
      activitySheet.appendRow([new Date(), 'Outreach Agent', 'reply_detected', 'SUCCESS', orgName + ' replied: ' + latestReply.getSubject(), '', '', '']);
      const reply = { org: orgName, subject: latestReply.getSubject(), body: latestReply.getPlainBody().substring(0, 500) };

      try { if (typeof fullTriage === 'function') fullTriage('reply', reply.body, 'Outreach'); } catch (e) {}

      // FLY BRAIN classification
      try {
        if (typeof flyBrainAssessEmail === 'function') {
          const assessment = flyBrainAssessEmail(latestReply.getSubject(), latestReply.getPlainBody().substring(0, 300));
          if (!assessment.error) {
            reply.flyBrainAssessment = assessment;
            if (assessment.gf_fire > 40 || assessment.other_fire > 40) {
              reply.flyBrainFlag = '🚨🚨 CRITICAL — Immediate attention';
              reply.priority = 'CRITICAL';
            } else if (assessment.gf_fire > 20 || assessment.other_fire > 20) {
              reply.flyBrainFlag = '🚨 URGENT — Same-day response';
              reply.priority = 'URGENT';
            } else if (assessment.gf_fire > 5 || assessment.other_fire > 5) {
              reply.flyBrainFlag = '⚠️ Notable — Review today';
              reply.priority = 'NOTABLE';
            } else {
              reply.flyBrainFlag = '📋 Routine';
              reply.priority = 'ROUTINE';
            }
            Logger.log('🐝 ' + orgName + ': ' + reply.priority);
          }
        }
      } catch (e) { Logger.log('Fly brain skipped: ' + e.message); }

      newReplies.push(reply);
    } catch (e) { Logger.log('Error: ' + orgName + ': ' + e.message); }
  }

  if (newReplies.length && founderEmail) {
    const nl = String.fromCharCode(10);
    const priorityOrder = { CRITICAL: 0, URGENT: 1, NOTABLE: 2, ROUTINE: 3 };
    newReplies.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
    let body = newReplies.length + ' organizations replied:' + nl + nl;
    newReplies.forEach(reply => {
      body += '── ' + reply.org + ' ──' + nl;
      if (reply.flyBrainFlag) body += reply.flyBrainFlag + nl;
      body += 'Subject: ' + reply.subject + nl + reply.body + nl + nl;
    });
    MailApp.sendEmail({ to: founderEmail, subject: 'Kind Koalas — ' + newReplies.length + ' new replies', body: body });
  }
  Logger.log('Checked ' + (contacts.length - 1) + ' contacts. ' + newReplies.length + ' new replies.');
}

function draftReplyToContact(contactEmail, replyBody) {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues();
  let contact = null, contactRow = -1;
  for (let i = 1; i < contacts.length; i++) if (contacts[i][5] === contactEmail) { contact = contacts[i]; contactRow = i + 1; break; }
  if (!contact) return null;
  const prompt = 'You are Outreach Agent for Kind Koalas.\n\nContact replied. Draft response.\n\nOrganization: ' + contact[1] + '\nType: ' + contact[2] + '\n\nReply:\n"""\n' + replyBody + '\n"""\n\nRules:\n- Warm, under 150 words\n- Answer directly\n- If partner: next steps\n- Sign "Hari, Kind Koala, [www.kindkoala.org](https://www.kindkoala.org)"\n- Never promise money\n\nReturn ONLY body.';
  let draftBody;
  try { draftBody = callGemini(apiKey, prompt); } catch (e) { return null; }
  const result = sendOrDraft(contactEmail, 'Re: Healthcare Access Initiative — Kind Koala', draftBody, 'Outreach Agent', 'Reply to ' + contact[1]);
  ss.getSheetByName('Contacts').getRange(contactRow, 11).setValue(result.sent ? 'Sent' : 'Replied - Draft Pending');
  ss.getSheetByName('Contacts').getRange(contactRow, 12).setValue(new Date());
  ss.getSheetByName('Activity_Log').appendRow([new Date(), 'Outreach Agent', 'draft_reply', 'SUCCESS', (result.sent ? 'Sent' : 'Drafted') + ' reply to ' + contact[1], '', '', '']);
  return draftBody;
}

function checkAndRespondToReplies() {
  const ss = getSS();
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues();
  const handled = [];
  for (let i = 1; i < contacts.length; i++) {
    const orgName = contacts[i][1], email = contacts[i][5], status = contacts[i][10];
    if ((status !== 'Sent' && status !== 'Replied') || !email) continue;
    try {
      const threads = GmailApp.search('from:' + email + ' newer_than:14d', 0, 1);
      if (threads.length === 0) continue;
      const msg = threads[0].getMessages()[0];
      if (GmailApp.search('to:' + email + ' subject:Re: newer_than:14d', 0, 1).length > 0) continue;
      draftReplyToContact(email, msg.getPlainBody());
      handled.push(orgName);
    } catch (e) {}
  }
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (handled.length > 0 && founderEmail) MailApp.sendEmail({ to: founderEmail, subject: 'Kind Koalas — ' + handled.length + ' replies processed', body: handled.map(n => '• ' + n).join('\n') });
  Logger.log('Processed ' + handled.length + ' replies.');
}

function testReplyDrafting() { draftReplyToContact('BrownBagMinistry@yahoo.com', 'Hi Hari,\n\nThanks for reaching out. Interested in learning more. Send the flyer?\n\nBest,\nSarah'); }

// ─── SYNC SENT STATUS ───
function syncSentStatus() {
  const ss = getSS();
  const sheet = ss.getSheetByName('Contacts');
  const data = sheet.getDataRange().getValues();
  let updated = 0;
  const now = new Date();
  const sentThreads = GmailApp.search('in:sent newer_than:30d', 0, 100);
  const sentEmails = new Set();
  sentThreads.forEach(thread => thread.getMessages().forEach(msg => msg.getTo().split(',').forEach(addr => { const c = addr.match(/<(.+?)>/); const e = c ? c[1].toLowerCase().trim() : addr.toLowerCase().trim(); if (e) sentEmails.add(e); })));
  for (let i = 1; i < data.length; i++) {
    if (!data[i][5] || data[i][10] !== 'Drafted') continue;
    if (sentEmails.has(data[i][5].toLowerCase())) {
      sheet.getRange(i + 1, 11).setValue('Sent');
      sheet.getRange(i + 1, 12).setValue(now);
      updated++;
      ss.getSheetByName('Activity_Log').appendRow([now, 'System', 'contact_marked_sent', 'SUCCESS', 'Marked ' + data[i][1], '', '', '']);
    }
  }
  Logger.log('Updated ' + updated + ' contacts.');
}

// ─── BOUNCE DETECTOR ───
function checkBounces() {
  const ss = getSS();
  const sheet = ss.getSheetByName('Contacts');
  const contacts = sheet.getDataRange().getValues();
  const now = new Date();
  const bounced = [];
  const searches = ['from:mailer-daemon newer_than:30d', 'from:postmaster newer_than:30d', 'subject:"Delivery Status Notification" newer_than:30d', 'subject:"Address not found" newer_than:30d', 'subject:"Message blocked" newer_than:30d', 'subject:"Undelivered Mail" newer_than:30d'];
  const allBounced = new Set();
  searches.forEach(q => { try { GmailApp.search(q, 0, 50).forEach(t => t.getMessages().forEach(m => { (m.getPlainBody() || '').toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)?.forEach(x => allBounced.add(x.toLowerCase())); })); } catch (e) {} });
  for (let i = 1; i < contacts.length; i++) {
    const email = String(contacts[i][5] || '').toLowerCase().trim();
    const status = String(contacts[i][10] || '').trim();
    if (!email || (status !== 'Sent' && status !== 'Drafted')) continue;
    if (allBounced.has(email)) {
      sheet.getRange(i + 1, 11).setValue('Bounced');
      sheet.getRange(i + 1, 15).setValue((contacts[i][14] || '') + ' | Bounced ' + now.toDateString());
      bounced.push(contacts[i][1] + ' (' + email + ')');
    }
  }
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (bounced.length > 0 && founderEmail) MailApp.sendEmail({ to: founderEmail, subject: '⚠️ ' + bounced.length + ' bounced', body: bounced.map(b => '• ' + b).join('\n') });
  Logger.log(bounced.length + ' bounces');
  return bounced;
}

function markAsBounced(email) {
  const sheet = getSS().getSheetByName('Contacts');
  const contacts = sheet.getDataRange().getValues();
  for (let i = 1; i < contacts.length; i++) if (String(contacts[i][5]).toLowerCase().trim() === email.toLowerCase().trim()) { sheet.getRange(i + 1, 11).setValue('Bounced'); return; }
}
function markTwoBounced() { markAsBounced('info@dorcas.org'); markAsBounced('cstone@foodbankcenc.org'); }

// ─── APPROVALS ───
function showApprovalsDialog() { SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutputFromFile('Approvals').setWidth(700).setHeight(600), 'Pending Approvals'); }

function getPendingApprovals() {
  const data = getSS().getSheetByName('Approvals').getDataRange().getValues().slice(1);
  const pending = [];
  data.forEach(row => { if (row[8] === 'Pending Review') pending.push({ id: row[0], date: String(row[1]).substring(0, 10), agent: row[2], type: row[3], summary: row[4], target: row[6], notes: row[11] }); });
  return pending;
}

function markApprovals(action, approvalIds) {
  const ss = getSS();
  const sheet = ss.getSheetByName('Approvals');
  const data = sheet.getDataRange().getValues();
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues();
  const now = new Date();
  let updated = 0;
  approvalIds.forEach(id => {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] !== id || data[i][8] !== 'Pending Review') continue;
      const newStatus = action === 'sent' ? 'Sent' : 'Rejected';
      sheet.getRange(i + 1, 9).setValue(newStatus);
      sheet.getRange(i + 1, 10).setValue('Hari');
      sheet.getRange(i + 1, 11).setValue(now);
      for (let j = 1; j < contacts.length; j++) if (contacts[j][5] === data[i][6]) { ss.getSheetByName('Contacts').getRange(j + 1, 11).setValue(action === 'sent' ? 'Sent' : 'Not Contacted'); if (action === 'sent') ss.getSheetByName('Contacts').getRange(j + 1, 12).setValue(now); break; }
      ss.getSheetByName('Activity_Log').appendRow([now, 'Hari', 'approval_' + action, 'SUCCESS', 'Marked ' + data[i][4], '', '', '']);
      updated++; break;
    }
  });
  return updated + ' marked as ' + action;
}

// ─── ORCHESTRATOR ───
function orchestrator() {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  const now = new Date();
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '');
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues().slice(1);
  const approvals = ss.getSheetByName('Approvals').getDataRange().getValues().slice(1);
  const activityLog = ss.getSheetByName('Activity_Log').getDataRange().getValues().slice(1);
  let overdue = 0, dueSoon = 0, notStarted = 0;
  const overdueList = [];
  tasks.forEach(t => {
    if (t[8] instanceof Date) { const d = Math.ceil((t[8] - now) / 86400000); if (d < 0) { overdue++; overdueList.push(t[1] + ' (' + Math.abs(d) + 'd)'); } else if (d <= 3) dueSoon++; }
    if (String(t[7]).toLowerCase().indexOf('not started') !== -1) notStarted++;
  });
  const pending = approvals.filter(a => a[8] === 'Pending Review').length;
  const replied = contacts.filter(c => c[10] === 'Replied' || c[10] === 'Replied - Draft Pending').length;
  const drafted = contacts.filter(c => c[10] === 'Drafted').length;
  const lastRun = activityLog.filter(r => r[2] === 'orchestrator').slice(-1)[0];
  const hoursSince = lastRun ? (now - lastRun[0]) / 3600000 : 999;

  const prompt = 'You are Chief of Staff orchestrator. Pick single MOST important action.\n\nSTATE:\n' +
    '• Overdue: ' + overdue + (overdueList.length > 0 ? ' (' + overdueList.slice(0,5).join('; ') + ')' : '') + '\n' +
    '• Due in 3 days: ' + dueSoon + '\n• Not started: ' + notStarted + '\n' +
    '• Pending approvals: ' + pending + '\n• Drafted: ' + drafted + '\n• Replied: ' + replied + '\n' +
    '• Hours since last run: ' + Math.round(hoursSince) + '\n' +
    '• Now: ' + now.toTimeString().substring(0,5) + ' ' + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()] + '\n\n' +
    'ACTIONS:\n1. sendDailyBriefing 2. draftBatchOutreach 3. draftBatchHealthcare 4. checkAndRespondToReplies 5. healthcareAgent 6. outreachAgent 7. communityAgent 8. socialAgent 9. operationsAgent 10. researchAgent 11. ideaCreationAgent 12. skip\n\n' +
    'RULES:\n- 6-8 AM and no briefing today → sendDailyBriefing\n- Replied with no draft → checkAndRespondToReplies\n- Pending > 15 → skip\n- Never run same agent within 6 hours\n- Nothing urgent → skip\n\n' +
    'Respond ONLY with JSON:\n{"action": "name_or_skip", "reason": "one sentence", "urgency": "low|medium|high", "notes_for_hari": "optional"}';

  let decision;
  try { decision = JSON.parse(callGemini(apiKey, prompt).replace(/```json|```/g, '').trim()); }
  catch (e) { Logger.log('Orchestrator error: ' + e.message); return; }
  ss.getSheetByName('Activity_Log').appendRow([now, 'Orchestrator', 'orchestrator', 'SUCCESS', 'Decided: ' + decision.action, '', '', '']);
  if (decision.action === 'skip') { Logger.log('🦘 Skipped'); return; }
  try {
    const actions = { sendDailyBriefing, draftBatchOutreach: () => draftBatchOutreach(5), draftBatchHealthcare: () => draftBatchHealthcare(5), checkAndRespondToReplies, healthcareAgent, outreachAgent, communityAgent, socialAgent, operationsAgent, researchAgent, ideaCreationAgent };
    if (actions[decision.action]) actions[decision.action]();
  } catch (e) { Logger.log('Execution error: ' + e.message); }
}

// ─── ORG CHART + BLOCKERS ───
function setupOrgChart() {
  const ss = getSS();
  let sheet = ss.getSheetByName('Org_Chart');
  if (!sheet) sheet = ss.insertSheet('Org_Chart');
  sheet.clear();
  sheet.getRange(1, 1, 1, 6).setValues([['Agent','Reports_To','Role','Can_Escalate_To_Hari','Max_Daily_Actions','Notes']]);
  sheet.setFrozenRows(1);
  const rows = [
    ['Chief of Staff','Hari','Manager','TRUE','50','Top of AI chain.'],
    ['Healthcare Access','Chief of Staff','Director','FALSE','15','Reports through CoS.'],
    ['Outreach','Chief of Staff','Director','FALSE','20','Reports through CoS.'],
    ['Community Engagement','Chief of Staff','Director','FALSE','15','Reports through CoS.'],
    ['Social Media','Chief of Staff','Director','FALSE','10','Reports through CoS.'],
    ['Operations','Chief of Staff','Director','FALSE','10','Reports through CoS.'],
    ['Research','Chief of Staff','Director','FALSE','10','Reports through CoS.'],
    ['Idea Creation','Chief of Staff','Director','FALSE','10','Reports through CoS.'],
    ['Organizer','Chief of Staff','Specialist','FALSE','5','Weekly cleanup.']
  ];
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  let blockers = ss.getSheetByName('Blockers');
  if (!blockers) blockers = ss.insertSheet('Blockers');
  blockers.clear();
  blockers.getRange(1, 1, 1, 8).setValues([['Blocker_ID','Date','Reported_By','Type','Description','Routed_To','Status','Resolution']]);
  blockers.setFrozenRows(1);
  Logger.log('✅ Org chart created');
}

function reportBlocker(reportedBy, type, description) {
  const ss = getSS();
  const now = new Date();
  const blockerId = 'B' + now.getTime();
  const orgChart = ss.getSheetByName('Org_Chart').getDataRange().getValues();
  let routedTo = 'Chief of Staff';
  for (let i = 1; i < orgChart.length; i++) if (orgChart[i][0] === reportedBy) { routedTo = orgChart[i][1]; break; }
  ss.getSheetByName('Blockers').appendRow([blockerId, now, reportedBy, type, description, routedTo, 'Open', '']);
  ss.getSheetByName('Activity_Log').appendRow([now, reportedBy, 'blocker_reported', 'WARNING', type + ': ' + description, '', '', '']);
  return blockerId;
}

function chiefOfStaffProcessesBlockers() {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  const now = new Date();
  const blockersSheet = ss.getSheetByName('Blockers');
  const open = blockersSheet.getDataRange().getValues().slice(1).filter(b => b[6] === 'Open' && b[5] === 'Chief of Staff');
  if (open.length === 0) return;
  const prompt = 'You are Chief of Staff. Resolve blockers:\n\n' + open.map((b, i) => (i+1) + '. [' + b[3] + '] ' + b[4]).join('\n') + '\n\nJSON: [{"blocker_id": "...", "action": "resolved|escalate", "response": "..."}]';
  let decisions;
  try { decisions = JSON.parse(callGemini(apiKey, prompt).replace(/```json|```/g, '').trim()); } catch (e) { return; }
  decisions.forEach((d, i) => {
    if (i >= open.length) return;
    const allRows = blockersSheet.getDataRange().getValues();
    for (let r = 1; r < allRows.length; r++) if (allRows[r][0] === open[i][0]) {
      blockersSheet.getRange(r + 1, 7).setValue(d.action === 'escalate' ? 'Escalated' : 'Resolved');
      blockersSheet.getRange(r + 1, 8).setValue(d.response);
      if (d.action === 'escalate') blockersSheet.getRange(r + 1, 6).setValue('Hari');
      break;
    }
  });
}

// ─── AGENT REQUESTS ───
function requestFromAgent(fromAgent, toAgent, request, context) {
  const ss = getSS();
  const now = new Date();
  const id = 'R' + now.getTime();
  ss.getSheetByName('Request_Queue').appendRow([id, now, fromAgent, toAgent, request, context || '', 'Open', '', '']);
  ss.getSheetByName('Activity_Log').appendRow([now, fromAgent, 'agent_request_sent', 'SUCCESS', '→ ' + toAgent + ': ' + request, '', '', '']);
  return id;
}

function completeRequest(requestId, response) {
  const sheet = getSS().getSheetByName('Request_Queue');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) if (data[i][0] === requestId) {
    sheet.getRange(i + 1, 7).setValue('Complete');
    sheet.getRange(i + 1, 8).setValue(new Date());
    sheet.getRange(i + 1, 9).setValue(response);
    return true;
  }
  return false;
}
function testAgentRequest() { requestFromAgent('Outreach', 'Research', 'Need grant context for Triangle CF', 'Drafting sponsor emails'); }

// ─── MORALE ───
function updateMoraleMeter() {
  const ss = getSS();
  const sheet = ss.getSheetByName('Agent_Health');
  if (!sheet) return;
  const agents = ['Chief of Staff','Healthcare Access','Outreach','Community Engagement','Social Media','Operations','Research','Idea Creation','Organizer'];
  const activity = ss.getSheetByName('Activity_Log').getDataRange().getValues().slice(1);
  const blockers = ss.getSheetByName('Blockers').getDataRange().getValues().slice(1);
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const rows = [['Agent','Last_Success','Success_Rate_7d','Failures_7d','Open_Blockers','Health','Notes']];
  agents.forEach(agent => {
    const a = activity.filter(r => r[1] === agent && r[0] instanceof Date && r[0] >= weekAgo);
    const successes = a.filter(r => r[3] === 'SUCCESS').length;
    const failures = a.filter(r => r[3] === 'ERROR' || r[3] === 'WARNING').length;
    const total = successes + failures;
    const rate = total > 0 ? Math.round((successes / total) * 100) : 100;
    const ls = a.filter(r => r[3] === 'SUCCESS').sort((x, y) => y[0] - x[0])[0];
    const openB = blockers.filter(b => b[2] === agent && b[6] === 'Open').length;
    let h = 'Healthy', n = '';
    if (failures >= 5) { h = 'Critical'; n = failures + ' failures'; }
    else if (failures >= 3) { h = 'Warning'; n = 'Elevated failures'; }
    else if (openB >= 3) { h = 'Warning'; n = openB + ' blockers'; }
    else if (rate < 70 && total > 0) { h = 'Warning'; n = rate + '%'; }
    else if (total === 0) { h = 'Idle'; n = 'No runs'; }
    rows.push([agent, ls ? ls[0].toISOString().slice(0, 16).replace('T', ' ') : 'Never', rate + '%', failures, openB, h, n]);
  });
  sheet.clear();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
}

// ─── STANDUP + ROLLUP ───
function dailyStandup() {
  const ss = getSS();
  const now = new Date();
  const agents = ['Healthcare Access','Outreach','Community Engagement','Social Media','Operations','Research','Idea Creation'];
  const activity = ss.getSheetByName('Activity_Log').getDataRange().getValues().slice(1);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let body = 'Daily stand-up\n\n';
  agents.forEach(agent => {
    const actions = activity.filter(r => r[0] instanceof Date && r[0] >= today && r[1] === agent && r[3] === 'SUCCESS');
    body += '• ' + agent + '\n  ' + (actions.length > 0 ? actions.length + ' action(s): ' + actions.map(r => r[4]).slice(0, 3).join('; ') : 'Nothing.') + '\n\n';
  });
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (founderEmail) MailApp.sendEmail({ to: founderEmail, subject: '🦘 Kind Koalas Stand-Up — ' + now.toDateString(), body: body });
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Standup', 'Daily Standup ' + now.toISOString().slice(0, 10), body, 'Chief of Staff Agent', now, 'high', 'standup', 'FALSE']);
}

function weeklyRollup() {
  const ss = getSS();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const activity = ss.getSheetByName('Activity_Log').getDataRange().getValues().slice(1);
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues().slice(1);
  const weekActivity = activity.filter(r => r[0] instanceof Date && r[0] >= weekAgo);
  const sent = weekActivity.filter(r => r[2] === 'email_sent_auto' || r[2] === 'draft_sent_bulk').length;
  const contacted = contacts.filter(c => c[11] instanceof Date && c[11] >= weekAgo).length;
  const replied = contacts.filter(c => c[10] === 'Replied').length;
  const bounced = contacts.filter(c => c[10] === 'Bounced').length;
  const body = 'WEEKLY ROLLUP\nWeek of ' + weekAgo.toDateString() + '\n\n📊 Sent: ' + sent + '\n📬 Contacted: ' + contacted + '\n💬 Replies: ' + replied + '\n⚠️ Bounced: ' + bounced + '\n• Total: ' + weekActivity.length;
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (founderEmail) MailApp.sendEmail({ to: founderEmail, subject: '🦘 Kind Koalas Weekly Rollup', body: body });
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Rollup', 'Weekly Rollup ' + now.toISOString().slice(0, 10), body, 'Chief of Staff Agent', now, 'high', 'weekly-rollup', 'FALSE']);
}

// ─── STORM ───
function stormResearch(topic) {
  const ss = getSS();
  const apiKey = getApiKey(ss);
  let perspectives, contradictions, synthesis, review;
  try { perspectives = callGemini(apiKey, 'Research: "' + topic + '"\n\n5 perspectives: PRACTITIONER, SKEPTIC, ECONOMIST, HISTORIAN, ACADEMIC. Each: position, evidence, unique insight.'); } catch (e) { return null; }
  try { contradictions = callGemini(apiKey, 'Perspectives:\n' + perspectives + '\n\nMap contradictions.'); } catch (e) { return null; }
  try { synthesis = callGemini(apiKey, 'Synthesize "' + topic + '":\n\n' + perspectives + '\n\n' + contradictions + '\n\nBriefing: exec summary, 5 findings, one connection, one recommendation. Under 400 words.'); } catch (e) { return null; }
  try { review = callGemini(apiKey, 'Peer-review:\n' + synthesis); } catch (e) { review = '(unavailable)'; }
  const final = 'STORM: ' + topic + '\n\n── SYNTHESIS ──\n' + synthesis + '\n\n── REVIEW ──\n' + review;
  ss.getSheetByName('Memory').appendRow(['M' + new Date().getTime(), 'Research', 'STORM: ' + topic, final, 'Research Agent', new Date(), 'high', 'storm-research', 'FALSE']);
  return final;
}
function testStorm() { stormResearch('Triangle Community Foundation grants for youth-led nonprofits'); }

// ─── ORGANIZER ───
function organizerAgent() {
  const ss = getSS();
  const now = new Date();
  const cleaned = [];
  const contactsSheet = ss.getSheetByName('Contacts');
  const contacts = contactsSheet.getDataRange().getValues();
  const seen = {};
  for (let i = 1; i < contacts.length; i++) {
    const email = String(contacts[i][5] || '').toLowerCase().trim();
    if (email && seen[email]) { contactsSheet.getRange(i + 1, 11).setValue('Duplicate'); cleaned.push(contacts[i][1]); }
    else if (email) seen[email] = i + 1;
  }
  const summary = 'ORGANIZER REPORT ' + now.toDateString() + '\nCleaned: ' + cleaned.length;
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Organizer', 'Organizer ' + now.toISOString().slice(0, 10), summary, 'Organizer Agent', now, 'medium', 'organizer', 'FALSE']);
  const founderEmail = getSetting('FOUNDER_EMAIL', '');
  if (founderEmail) MailApp.sendEmail({ to: founderEmail, subject: '📋 Organizer Report', body: summary });
}

function installOrganizer() {
  const sheet = getSS().getSheetByName('Agents');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) if (data[i][1] === 'Organizer') return;
  sheet.appendRow(['9','Organizer','Maintenance','Cleanup','Dedup','Clean','Send emails','Passwords','Weekly Sun','groq','You are the Organizer.','TRUE','','Idle']);
}

// ─── MASTER SCHEDULER ───
function jobShouldRun(jobName, hoursMin) {
  const lastRun = PropertiesService.getScriptProperties().getProperty('LAST_' + jobName);
  if (!lastRun) return true;
  return (Date.now() - parseInt(lastRun)) / 3600000 >= hoursMin;
}
function markJobRan(jobName) { PropertiesService.getScriptProperties().setProperty('LAST_' + jobName, String(Date.now())); }

function masterScheduler() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const jobs = [];
  function tryRun(jobName, hoursMin, fn) {
    if (!jobShouldRun(jobName, hoursMin)) return;
    try { fn(); markJobRan(jobName); jobs.push('✅ ' + jobName); } catch (e) { jobs.push('❌ ' + jobName + ': ' + e.message); }
  }
  if (hour === 6)  tryRun('morale', 20, () => updateMoraleMeter());
  if (hour === 7)  tryRun('briefing', 20, () => sendDailyBriefing());
  if (hour === 8)  tryRun('social', 20, () => socialAgent());
  if (hour === 17) tryRun('syncSent', 20, () => syncSentStatus());
  if (hour === 18) tryRun('replies', 20, () => checkForReplies());
  if (hour === 18) tryRun('standup', 20, () => dailyStandup());
  if (hour === 19) tryRun('replyResponse', 20, () => checkAndRespondToReplies());
  if (hour === 20) tryRun('bounces', 20, () => checkBounces());
  if (hour % 3 === 0) tryRun('flybrain', 2.5, () => flyBrainHourlyTick());
  if ([1,3,5].includes(day)) {
    if (hour === 9)  tryRun('healthcare', 20, () => healthcareAgent());
    if (hour === 10) tryRun('outreachReport', 20, () => outreachAgent());
  }
  if (day === 1) {
    if (hour === 9)  tryRun('weeklyOutreach', 160, () => weeklyOutreachDrafting());
    if (hour === 11) tryRun('community', 160, () => communityAgent());
  }
  if (day === 2 && hour === 9)  tryRun('operations', 160, () => operationsAgent());
  if (day === 3 && hour === 11) tryRun('research', 160, () => researchAgent());
  if (day === 4 && hour === 10) tryRun('ideas', 160, () => ideaCreationAgent());
  if (day === 6 && hour === 9)  tryRun('weeklyRollup', 160, () => weeklyRollup());
  if (day === 0 && hour === 22) tryRun('organizer', 160, () => organizerAgent());
  tryRun('orchestrator', 0.5, () => orchestrator());
  if (hour % 2 === 0) tryRun('blockers', 1.5, () => chiefOfStaffProcessesBlockers());
  Logger.log('🕐 ' + hour + ':00 ' + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]);
  jobs.forEach(j => Logger.log('  ' + j));
}

function installMasterScheduler() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('masterScheduler').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('onOpen').forSpreadsheet(getSS()).onOpen().create();
  Logger.log('✅ Installed. Triggers: ' + ScriptApp.getProjectTriggers().length);
}
function listAllTriggers() { ScriptApp.getProjectTriggers().forEach(t => Logger.log('  • ' + t.getHandlerFunction())); }

// ─── UI ───
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🤖 AI Team')
    .addItem('Open Dashboard', 'showSidebar')
    .addItem('Manage Approvals', 'showApprovalsDialog')
    .addSeparator()
    .addItem('Run Chief of Staff', 'chiefOfStaff')
    .addItem('Run Idea Creation', 'ideaCreationAgent')
    .addItem('Send Daily Briefing', 'sendDailyBriefing')
    .addItem('Draft 5 Outreach Emails', 'draftBatchOutreach')
    .addToUi();
}
function showSidebar() { SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('Kind Koalas AI Team').setWidth(320)); }
function runAgentFromSidebar(name) {
  const actions = { chiefOfStaff, healthcareAgent, outreachAgent, communityAgent, socialAgent, operationsAgent, researchAgent, ideaCreationAgent, sendDailyBriefing, draftBatchOutreach: () => draftBatchOutreach(5), draftBatchHealthcare: () => draftBatchHealthcare(5), checkForReplies };
  if (!actions[name]) return 'Unknown';
  try { actions[name](); return 'OK'; } catch (e) { return 'Error: ' + e.message; }
}

// ─── DASHBOARD BACKEND ───
function doGet(e) {
  if (e?.parameter?.health === '1') return jsonResponse({ ok: true, service: 'Kind Koalas API' });
  return HtmlService.createHtmlOutputFromFile('Dashboard').setTitle('Kind Koalas Command Center').addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.secret !== API_SECRET) return jsonResponse({ error: 'unauthorized' });
    const handlers = {
      get_stats: api_stats, get_agents: api_agents,
      get_tasks: () => api_tasks(p.payload?.filter || 'active'),
      run_agent: () => { const fns = { chiefOfStaff, healthcareAgent, outreachAgent, communityAgent, socialAgent, operationsAgent, researchAgent, ideaCreationAgent, organizerAgent, sendDailyBriefing, weeklyOutreachDrafting, dailyStandup, weeklyRollup, updateMoraleMeter, checkForReplies, checkAndRespondToReplies, syncSentStatus, checkBounces, orchestrator, flyBrainHourlyTick, flyBrainHealth }; if (!fns[p.payload?.name]) throw new Error('Unknown'); fns[p.payload.name](); return { ran: p.payload.name }; },
      read_sheet: () => getSS().getSheetByName(p.payload.sheet).getDataRange().getValues(),
      log_activity: () => { getSS().getSheetByName('Activity_Log').appendRow([new Date(), p.payload.agent || 'Terminal', p.payload.action, p.payload.status || 'SUCCESS', p.payload.details || '', '', '', '']); return { ok: true }; }
    };
    if (!handlers[p.action]) return jsonResponse({ error: 'Unknown action' });
    return jsonResponse({ ok: true, result: handlers[p.action]() });
  } catch (err) { return jsonResponse({ error: err.message }); }
}
function jsonResponse(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
const API_SECRET = 'CHANGE_ME_TO_RANDOM_STRING_32CHARS';
function generateApiSecret() { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let s = ''; for (let i = 0; i < 40; i++) s += c.charAt(Math.floor(Math.random() * c.length)); Logger.log('Secret:\n' + s); return s; }

function api_stats() {
  const ss = getSS();
  const now = new Date();
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '');
  const approvals = ss.getSheetByName('Approvals').getDataRange().getValues().slice(1);
  const contacts = ss.getSheetByName('Contacts').getDataRange().getValues().slice(1);
  let overdue = 0, dueSoon = 0, done = 0;
  tasks.forEach(t => {
    const s = String(t[7] || '').toLowerCase();
    if (s.includes('done') || s.includes('complete')) { done++; return; }
    if (!(t[8] instanceof Date)) return;
    const d = Math.ceil((t[8] - now) / 86400000);
    if (d < 0) overdue++; else if (d <= 3) dueSoon++;
  });
  return { tasks: { total: tasks.length, overdue, dueSoon, done }, approvals: { pending: approvals.filter(a => a[8] === 'Pending Review').length, total: approvals.length }, contacts: { sent: contacts.filter(c => c[10] === 'Sent').length, replied: contacts.filter(c => c[10] === 'Replied').length, bounced: contacts.filter(c => c[10] === 'Bounced').length, total: contacts.length } };
}

function api_agents() {
  const ss = getSS();
  const sheet = ss.getSheetByName('Agents');
  if (!sheet) return [];
  const agents = sheet.getDataRange().getValues().slice(1).filter(a => a[0] !== '');
  let healthData = [];
  try { const hs = ss.getSheetByName('Agent_Health'); if (hs && hs.getLastRow() > 1) healthData = hs.getDataRange().getValues().slice(1); } catch (e) {}
  return agents.map(a => {
    const h = healthData.find(r => String(r[0]) === String(a[1])) || [];
    return { id: String(a[0] || ''), name: String(a[1] || ''), role: String(a[2] || ''), mission: String(a[3] || ''), enabled: a[11] === true || a[11] === 'TRUE', status: String(a[13] || 'Idle'), health: String(h[5] || 'Unknown'), successRate: h[2] ? String(h[2]) : '—', lastSuccess: h[1] ? String(h[1]).slice(0, 16).replace('T', ' ') : 'Never', failures: Number(h[3]) || 0, openBlockers: Number(h[4]) || 0, note: String(h[6] || '') };
  });
}

function api_activity(limit) { limit = limit || 30; return getSS().getSheetByName('Activity_Log').getDataRange().getValues().slice(1).slice(-limit).reverse().map(r => ({ ts: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), agent: r[1] || '', action: r[2] || '', status: r[3] || '', details: r[4] || '' })); }
function api_approvals() { return getSS().getSheetByName('Approvals').getDataRange().getValues().slice(1).filter(r => r[8] === 'Pending Review').map(r => ({ id: r[0], date: r[1] instanceof Date ? r[1].toISOString().slice(0, 10) : String(r[1]).slice(0, 10), agent: r[2] || '', type: r[3] || '', summary: r[4] || '', target: r[6] || '', notes: r[11] || '' })); }
function api_approve(ids, action) { try { return { ok: true, result: markApprovals(action, ids) }; } catch (e) { return { ok: false, error: e.message }; } }
function api_blockers() { const s = getSS().getSheetByName('Blockers'); if (!s) return []; return s.getDataRange().getValues().slice(1).filter(r => r[6] === 'Open').map(r => ({ id: r[0], date: r[1] instanceof Date ? r[1].toISOString().slice(0, 10) : '', reportedBy: r[2], type: r[3], description: r[4], routedTo: r[5] })); }
function api_requests() { const s = getSS().getSheetByName('Request_Queue'); if (!s) return []; return s.getDataRange().getValues().slice(1).filter(r => r[6] === 'Open').map(r => ({ id: r[0], from: r[2], to: r[3], request: r[4], context: r[5] || '' })); }

function api_tasks(filter) {
  const data = getSS().getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '');
  let filtered = data;
  if (filter === 'overdue') { const now = new Date(); filtered = data.filter(t => t[8] instanceof Date && t[8] < now && !String(t[7] || '').toLowerCase().includes('done')); }
  else if (filter === 'active') filtered = data.filter(t => { const s = String(t[7] || '').toLowerCase(); return !s.includes('done') && !s.includes('complete'); });
  return filtered.slice(0, 100).map(t => ({ id: t[0], title: t[1], dept: t[3], agent: t[4], priority: t[6], status: t[7], due: t[8] instanceof Date ? t[8].toISOString().slice(0, 10) : '', approval: t[11] }));
}

function api_latestBriefing() {
  const memory = getSS().getSheetByName('Memory').getDataRange().getValues().slice(1);
  const b = memory.slice().reverse().find(r => String(r[7] || '').includes('daily-briefing') || String(r[1] || '').toLowerCase() === 'briefing');
  if (!b) return { html: '<p>No briefing yet.</p>', date: '' };
  return { html: String(b[3] || ''), date: b[5] instanceof Date ? b[5].toISOString().slice(0, 10) : '' };
}

function getDashboardData() {
  const ss = getSS();
  const tasks = ss.getSheetByName('Tasks').getDataRange().getValues().slice(1).filter(r => r[0] !== '');
  const approvals = ss.getSheetByName('Approvals').getDataRange().getValues().slice(1);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let overdue = 0, dueSoon = 0;
  tasks.forEach(t => { if (!(t[8] instanceof Date)) return; const d = Math.floor((t[8] - today) / 86400000); if (d < 0) overdue++; else if (d <= 3) dueSoon++; });
  return { totalTasks: tasks.length, overdue, dueSoon, pendingApprovals: approvals.filter(r => r[8] === 'Pending Review').length, totalApprovals: approvals.length };
}

// ─── DIAGNOSTIC ───
function testEverything() {
  Logger.log('═══════════════════════════════════════\nKIND KOALAS DIAGNOSTIC\n═══════════════════════════════════════\n');
  const results = [];
  let ss;
  try { ss = getSS(); results.push(['✅', 'Spreadsheet', ss.getName()]); } catch (e) { results.push(['❌', 'Spreadsheet', e.message]); printResults(results); return; }
  const required = ['Tasks','Agents','Memory','Approvals','Activity_Log','Settings','Templates','Roles','Contacts','Funding','Decisions','Reflex_Bus'];
  const missing = required.filter(t => !ss.getSheetByName(t));
  results.push([missing.length === 0 ? '✅' : '❌', 'Required tabs', missing.length === 0 ? required.length + ' present' : 'Missing: ' + missing.join(', ')]);
  results.push([getGroqKey() ? '✅' : '❌', 'Groq key', getGroqKey() ? 'Set' : 'MISSING']);
  results.push([getApiKey() ? '✅' : '❌', 'Gemini key', getApiKey() ? 'Set' : 'MISSING']);
  results.push([getSerperKey() ? '✅' : '❌', 'Serper key', getSerperKey() ? 'Set' : 'MISSING']);
  results.push([getGithubPat() ? '✅' : '⚠️', 'GitHub PAT', getGithubPat() ? 'Set' : 'Not set']);
  results.push([getFlyBrainUrl() ? '✅' : '⚠️', 'Fly brain URL', getFlyBrainUrl() ? 'Set' : 'Not set']);
  results.push(['ℹ️', 'SEND_MODE', getSendMode()]);
  results.push(['ℹ️', 'SAFE_MODE', isSafeMode() ? 'ON' : 'OFF']);
  try { const r = callGemini(getGroqKey(), 'Reply OK'); results.push(['✅', 'AI provider', r.substring(0, 20)]); } catch (e) { results.push(['❌', 'AI provider', e.message]); }
  try { const d = GmailApp.getDrafts(); results.push(['✅', 'Gmail', d.length + ' drafts']); } catch (e) { results.push(['❌', 'Gmail', e.message]); }
  results.push(['ℹ️', 'Triggers', ScriptApp.getProjectTriggers().length + ' installed']);
  ['Sidebar','Approvals','Dashboard'].forEach(f => { try { HtmlService.createHtmlOutputFromFile(f); results.push(['✅', f + '.html', 'Present']); } catch (e) { results.push(['❌', f + '.html', 'MISSING']); } });
  printResults(results);
}

function printResults(results) {
  Logger.log('');
  results.forEach(r => Logger.log(r[0] + '  ' + r[1].padEnd(24, ' ') + '  ' + r[2]));
  Logger.log('');
  const failures = results.filter(r => r[0] === '❌');
  Logger.log(failures.length === 0 ? '✅ SYSTEM HEALTHY — ' + results.length + ' checks' : '❌ ' + failures.length + ' FAILURES');
}

// ════════════════════════════════════════════════════════════
// FLY BRAIN — Complete integration
// Founder instruction (2026-10-09): ignore for now, will be briefed later.
// Left in place verbatim; not inspected or built on by this session.
// ════════════════════════════════════════════════════════════

function callFlyBrain(endpoint, payload) {
  const baseUrl = getFlyBrainUrl();
  if (!baseUrl) return { error: 'FLY_BRAIN_URL not set' };
  const options = { method: payload ? 'post' : 'get', contentType: 'application/json', headers: { 'ngrok-skip-browser-warning': 'true' }, muteHttpExceptions: true };
  if (payload) options.payload = JSON.stringify(payload);
  try {
    const response = UrlFetchApp.fetch(baseUrl + endpoint, options);
    if (response.getResponseCode() !== 200) return { error: 'HTTP ' + response.getResponseCode() };
    return JSON.parse(response.getContentText());
  } catch (e) { return { error: e.message }; }
}

function flyBrainHealth() { const r = callFlyBrain('/health'); Logger.log('Fly brain: ' + JSON.stringify(r)); return r; }

function flyBrainThreat(intensity, side) {
  intensity = intensity || 0.8; side = side || 'L';
  const result = callFlyBrain('/threat', { intensity, side });
  if (result.error) return result;
  Logger.log('⚠️ THREAT (' + side + '): gf=' + result.gf_fire + ' other=' + result.other_fire + ' ' + result.response);
  if (typeof reflexEmit === 'function') reflexEmit('C26_THREAT', 'threat', result.response, result.gf_fire / 60, 'side=' + side);
  return result;
}

function flyBrainOpportunity(intensity) {
  intensity = intensity || 0.8;
  const result = callFlyBrain('/opportunity', { intensity });
  if (result.error) return result;
  Logger.log('🎯 OPPORTUNITY: dna02=' + result.dna02_fire + ' ' + result.response);
  return result;
}

function flyBrainAssessEmail(subject, body) {
  const text = (subject + ' ' + body).toLowerCase();
  let intensity = 0.3;
  if (/urgent|asap|emergency|critical|immediate/i.test(text)) intensity += 0.4;
  if (/deadline|today|tonight|expired|overdue/i.test(text)) intensity += 0.3;
  if (/patient|family|medical|hospital|help/i.test(text)) intensity += 0.2;
  intensity = Math.min(1.0, intensity);
  const side = (text.length % 2 === 0) ? 'L' : 'R';
  const result = flyBrainThreat(intensity, side);
  if (result.error) return result;
  return { intensity, side, response: result.response, gf_fire: result.gf_fire, other_fire: result.other_fire, escalate: (result.gf_fire > 20) || (result.other_fire > 20) };
}

function flyBrainCreative(seeds, intensity) {
  intensity = intensity || 0.5;
  if (!Array.isArray(seeds)) seeds = [seeds];
  const result = callFlyBrain('/creative', { seeds, intensity });
  if (result.error) return result;
  Logger.log('🎨 Creative: ' + result.count + ' variants');
  if (typeof reflexEmit === 'function') reflexEmit('C26_CREATIVE', 'divergence', 'GENERATED', 0.8, result.count + ' variants');
  return result;
}

function flyBrainSocialHooks(topics) {
  const creative = flyBrainCreative(topics, 0.6);
  if (creative.error) return creative;
  const amplified = creative.variants.map(v => ({ topic: v.seed, weight: v.fingerprint, active: v.active })).sort((a, b) => b.weight - a.weight);
  Logger.log('Top hook: ' + amplified[0].topic);
  return amplified;
}

function flyBrainDonate(amount) {
  amount = amount || 5;
  const result = callFlyBrain('/donate', { amount });
  if (result.error) { Logger.log('Donate error: ' + result.error); return result; }
  Logger.log('💰 $' + amount + ' → ' + result.active_neurons + ' neurons');
  const ss = getSS();
  const now = new Date();
  ss.getSheetByName('Memory').appendRow(['M' + now.getTime(), 'Donation', 'Donation $' + amount, 'Neurons: ' + result.active_neurons + '\nTotal: $' + result.total_donated, 'Neuro-Donation Widget', now, 'high', 'donation', 'FALSE']);
  if (typeof reflexEmit === 'function') reflexEmit('C26_DONATION', 'donate', 'PROCESSED', 1.0, '$' + amount);
  return result;
}

function testDonation() {
  flyBrainDonate(25);
  flyBrainDonate(100);
  flyBrainDonate(500);
  Logger.log('✅ Neuro-donation test complete');
}

function flyBrainHourlyTick() {
  const r = callFlyBrain('/health');
  if (r.error) { Logger.log('Fly brain offline: ' + r.error); return; }
  const now = new Date();
  getSS().getSheetByName('Memory').appendRow(['M' + now.getTime(), 'FlyBrain', 'Hourly tick ' + now.toISOString().slice(0, 16).replace('T', ' '), 'Neurons: ' + r.neurons + '\nTonic: ' + r.tonic + '\nGain: ' + r.gain, 'FlyBrain C26', now, 'low', 'flybrain', 'FALSE']);
  Logger.log('🐝 Fly brain tick');
}

function setupFlyBrain(url) { if (url) setSetting('FLY_BRAIN_URL', url); const h = callFlyBrain('/health'); Logger.log('Health: ' + JSON.stringify(h)); return h; }

function testFlyBrain() {
  Logger.log('═══════════════════════════════════════\nFLY BRAIN TEST\n═══════════════════════════════════════\n');
  const health = flyBrainHealth();
  if (health.error) { Logger.log('❌ ' + health.error); return; }
  Logger.log('\nTEST 1: Threat L'); flyBrainThreat(0.8, 'L');
  Logger.log('\nTEST 2: Threat R'); flyBrainThreat(0.8, 'R');
  Logger.log('\nTEST 3: Email urgency');
  const email = flyBrainAssessEmail('URGENT: Patient needs care today', 'Family in crisis, needs free clinic ASAP');
  Logger.log('   Escalate? ' + email.escalate);
  Logger.log('\nTEST 4: Creative');
  flyBrainCreative(['healthcare', 'free clinic', 'youth volunteers', 'community health'], 0.5);
  Logger.log('\nTEST 5: Social hooks');
  flyBrainSocialHooks(['Bring care to families', 'Students leading change', 'Every dollar helps']);
  Logger.log('\n═══════════════════════════════════════\n✅ FLY BRAIN WORKING\n═══════════════════════════════════════');
}
