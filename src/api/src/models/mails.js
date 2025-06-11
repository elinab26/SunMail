// models/mails.js

const { all } = require("../routes/mails");

// In-memory storage separated per user
const inboxes = {};   // { userId: [mail, ...] }
const sentItems = {}; // { userId: [mail, ...] }
const drafts = {};    // { userId: [draftMail, ...] }
const allMails = {};
let nextId = 1;

/**
 * Ensure a mailbox exists for a given user in the specified store.
 */
function ensureMailbox(store, userId) {
  if (!store[userId]) {
    store[userId] = [];
  }
}

/**
 * Return the last 50 mails for a user in reverse chronological order.
 */
exports.getLast50 = (userId) => {
  ensureMailbox(inboxes, userId);
  return inboxes[userId].slice(-50).reverse();
};

/**
 * Return a single mail by ID for this user’s inbox.
 * If not found, returns undefined.
 */
exports.getById = (userId, mailId) => {
  ensureMailbox(inboxes, userId);
  return inboxes[userId].find(mail => mail.id === mailId);
};

/**
 * Create a new mail object, assign a unique id,
 * and save it to the recipient’s inbox and the sender’s sent items.
 * Returns the new mail object.
 */
exports.create = (toUserId, fromUserId, subject, body) => {
  const mail = {
    id: nextId++,
    from: fromUserId,
    to: toUserId,
    subject,
    body,
    date: new Date().toISOString(),
    labels: []
  };

  // Add to recipient’s inbox
  ensureMailbox(inboxes, toUserId);
  inboxes[toUserId].push(mail);

  // Add to sender’s sent items
  ensureMailbox(sentItems, fromUserId);
  sentItems[fromUserId].push(mail);

  // Add to the global array
  ensureMailbox(allMails, fromUserId);
  allMails[fromUserId].push(mail);

  return mail;
};

/**
 * Create a draft object and store it in drafts[userId].
 * Does not perform URL checks or send to inbox/sent.
 * Returns the draft object (with a unique id and `draft: true` flag).
 */
exports.createDraft = (fromUserId, toUserId, subject, body) => {
  const draftMail = {
    id: nextId++,
    from: fromUserId,
    to: toUserId,
    subject,
    body,
    date: new Date().toISOString(),
    draft: true
  };

  ensureMailbox(drafts, fromUserId);
  drafts[fromUserId].push(draftMail);

  // Add to the global array
  ensureMailbox(allMails, fromUserId);
  allMails[fromUserId].push(mail);
  return draftMail;
};

/**
 * Return all drafts for the given user in reverse chronological order.
 */
exports.getDrafts = (userId) => {
  ensureMailbox(drafts, userId);
  return drafts[userId].slice().reverse();
};

/**
 * Update a draft by merging in provided data. Returns the updated draft or null if not found.
 * (All fields are allowed to be overwritten here.)
 */
exports.updateDraft = (userId, draftId, data) => {
  ensureMailbox(drafts, userId);
  const draft = drafts[userId].find(d => d.id === draftId);
  if (!draft) return null;

  Object.assign(draft, data);
  draft.date = new Date().toISOString();
  return draft;
};

/**
 * Delete a draft with the specified id from the user’s drafts.
 * Returns true if a draft was removed, or false if none matched.
 */
exports.deleteDraft = (userId, draftId) => {
  ensureMailbox(drafts, userId);
  const beforeCount = drafts[userId].length;
  drafts[userId] = drafts[userId].filter(d => d.id !== draftId);
  return drafts[userId].length < beforeCount;
};

/**
 * Delete a mail with the specified id from the user’s inbox.
 * Returns true if a mail was removed, or false if none matched.
 */
exports.delete = (userId, mailId) => {
  ensureMailbox(inboxes, userId);
  const beforeCount = inboxes[userId].length;
  inboxes[userId] = inboxes[userId].filter(m => m.id !== mailId);
  return inboxes[userId].length < beforeCount;
};

/**
 * Search mails in the user’s inbox by subject or body (case-insensitive).
 * Returns an array of matching mail objects.
 */
exports.search = (userId, query) => {
  ensureMailbox(inboxes, userId);
  const lowerQuery = query.toLowerCase();
  return inboxes[userId].filter(mail =>
    mail.subject.toLowerCase().includes(lowerQuery) ||
    mail.body.toLowerCase().includes(lowerQuery)
  );
};

exports.getAllMails = (userId) => {
  ensureMailbox(allMails, userId);
  return allMails[userId];
}