// controllers/mails.js

const Mail = require('../models/mails');
const User = require('../models/users');
const util = require('../utils/userUtils.js');
const { extractUrls, validateUrls } = require('../utils/urlUtils');

/**
 * Helper: resolve an email address to a userId.
 * If no matching user is found, returns null.
 */
function resolveToUserId(email) {
  const users = User.getAllUsers();
  const match = users.find(u => u.email === email);
  return match ? match.id : null;
}

/**
 * GET /api/mails
 * Return the last 50 mails for this user (inbox).
 */
exports.getAllMails = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;
  const mails = Mail.getLast50(userId);
  res.json(mails);
};

/**
 * GET /api/mails/:id
 * Return a single mail by ID for this user’s inbox.
 */
exports.getMailById = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;

  const mailId = parseInt(req.params.id, 10);
  const mail = Mail.getById(userId, mailId);
  if (!mail) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  res.json(mail);
};

/**
 * POST /api/mails
 * Create a new mail (inbox + sent) after URL checks,
 * or store as a draft if req.body.draft === true.
 */
exports.createMail = async (req, res) => {
  const fromUserId = util.getUserId(req, res);
  if (!fromUserId) return;

  const { to, subject, body, draft } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Resolve recipient userId
  const toUserId = resolveToUserId(to);
  if (!toUserId) {
    return res.status(400).json({ error: 'Receiver user not found' });
  }

  // URL validation (throws if any URL is blacklisted or service fails)
  try {
    await validateUrls(subject, body);
  } catch (err) {
    // err.status is either 400 (blacklisted) or 500 (service unavailable)
    return res.status(err.status).json({ error: err.message, url: err.url });
  }

  // If draft === true, store as draft and return
  if (draft === true) {
    const draftItem = Mail.createDraft(fromUserId, toUserId, subject, body);
    return res.status(201).json(draftItem);
  }

  // Otherwise, create and send the mail immediately
  const mail = Mail.create(toUserId, fromUserId, subject, body);
  res.status(201).json(mail);
};

/**
 * PATCH /api/mails/:id
 * Update a draft. If req.body.draft === false, send the mail,
 * create it in inbox/sentItems, then delete the draft.
 * If the draft doesn’t exist, return 404.
 */
exports.updateMail = async (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;

  const draftId = parseInt(req.params.id, 10);
  const updates = req.body;

  // 1) Check if draft exists for this user
  const existingDrafts = Mail.getDrafts(userId);
  const draft = existingDrafts.find(d => d.id === draftId);
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }

  // 2) If user changed draft to false => send now
  if (updates.hasOwnProperty('draft') && updates.draft === false) {
    // Merge all updates (including subject, body, to, etc.)
    Object.assign(draft, updates);

    // If "to" changed, resolve new recipient userId
    if (updates.to) {
      const newRecipientId = resolveToUserId(updates.to);
      if (!newRecipientId) {
        return res.status(400).json({ error: 'Receiver user not found' });
      }
      draft.to = newRecipientId;
    }

    // 3) Re-validate URLs in finalized content
    try {
      await validateUrls(draft.subject, draft.body);
    } catch (err) {
      return res.status(err.status).json({ error: err.message, url: err.url });
    }

    // 4) Create the final mail in inbox and sentItems
    const sentMail = Mail.create(draft.to, draft.from, draft.subject, draft.body);

    // 5) Delete the draft
    Mail.deleteDraft(userId, draftId);

    return res.status(201).json(sentMail);
  }

  // 6) Otherwise, just update the draft itself
  const updatedDraft = Mail.updateDraft(userId, draftId, updates);
  res.json(updatedDraft);
};

/**
 * DELETE /api/mails/:id
 * Delete a mail from the user’s inbox.
 */
exports.deleteMail = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;

  const mailId = parseInt(req.params.id, 10);
  const success = Mail.delete(userId, mailId);
  if (!success) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  res.status(204).send();
};

/**
 * GET /api/mails/search/:query
 * Search mails in the user’s inbox.
 */
exports.searchMails = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;

  const query = req.params.query;
  const results = Mail.search(userId, query);
  res.json(results);
};

/**
 * GET /api/mails/drafts
 * Return all drafts for this user.
 */
exports.getDrafts = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;
  const allDrafts = Mail.getDrafts(userId);
  res.json(allDrafts);
};

/**
 * DELETE /api/mails/drafts/:id
 * Delete a draft for this user.
 */
exports.deleteDraft = (req, res) => {
  const userId = util.getUserId(req, res);
  if (!userId) return;
  const draftId = parseInt(req.params.id, 10);
  const success = Mail.deleteDraft(userId, draftId);
  if (!success) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  res.status(204).send();
};
