// models/mails.js

// In-memory storage separated per user
const inboxes = {};   // { userId: [mail, ...] }
const sentItems = {}; // { userId: [mail, ...] }
const allMails = {};

/**
 * Generate a unique ID using timestamp + random number
 */
function generateMailId() {
  return `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Ensure a mailbox exists for a given user in the specified store.
 */
exports.ensureMailbox = (store, userId) => {
  if (!store[userId]) {
    store[userId] = [];
  }
}

/**
 * Return the last 50 mails for a user in reverse chronological order.
 */
exports.getLast50 = (userId) => {
  exports.ensureMailbox(inboxes, userId);
  return inboxes[userId].slice(-50).reverse();
};

/**
 * Return a single mail by ID for this user's inbox.
 * If not found, returns undefined.
 */
exports.getById = (userId, mailId) => {
  exports.ensureMailbox(inboxes, userId);
  return inboxes[userId].find(mail => mail.id === mailId);
};

/**
 * Create a new mail object, assign a unique id,
 * and save it to the recipient's inbox and the sender's sent items.
 * Returns the new mail object with email addresses instead of user IDs.
 */
exports.create = (toUserId, fromUserId, subject, body) => {
  const User = require('./users'); // Import User model

  const mail = {
    id: generateMailId(), // Utilise la nouvelle fonction au lieu de nextId++
    from: fromUserId,
    to: toUserId,
    subject,
    body,
    date: new Date().toISOString(),
    labels: []
  };

  // Add to recipient's inbox
  exports.ensureMailbox(inboxes, toUserId);
  inboxes[toUserId].push(mail);

  // Add to sender's sent items
  exports.ensureMailbox(sentItems, fromUserId);
  sentItems[fromUserId].push(mail);

  // Add to the global array for both users
  exports.ensureMailbox(allMails, fromUserId);
  allMails[fromUserId].push(mail);

  exports.ensureMailbox(allMails, toUserId);
  allMails[toUserId].push(mail);

  // Return mail with email addresses for frontend
  const users = User.getAllUsers();
  const fromUser = users.find(u => u.id === fromUserId);
  const toUser = users.find(u => u.id === toUserId);

  return {
    ...mail,
    fromEmail: fromUser ? fromUser.email : 'unknown',
    toEmail: toUser ? toUser.email : 'unknown'
  };
};

/**
 * Delete a mail with the specified id from the user's inbox.
 * Returns true if a mail was removed, or false if none matched.
 */
exports.delete = (userId, mailId) => {
  exports.ensureMailbox(inboxes, userId);
  const beforeCount = inboxes[userId].length;
  inboxes[userId] = inboxes[userId].filter(m => m.id !== mailId);
  return inboxes[userId].length < beforeCount;
};

/**
 * Search mails in the user's inbox by subject or body (case-insensitive).
 * Returns an array of matching mail objects.
 */
exports.search = (userId, query) => {
  exports.ensureMailbox(inboxes, userId);
  const lowerQuery = query.toLowerCase();
  return inboxes[userId].filter(mail =>
    mail.subject.toLowerCase().includes(lowerQuery) ||
    mail.body.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get all mails for a user (inbox + sent)
 */
exports.getAllMails = (userId) => {
  exports.ensureMailbox(allMails, userId);
  return allMails[userId];
};

/**
 * Get sent items for a user
 */
exports.getSentItems = (userId) => {
  exports.ensureMailbox(sentItems, userId);
  return sentItems[userId].slice().reverse();
};


exports.getLabelsOfMail = (mail, userId) => {
  exports.ensureMailbox(allMails, userId);
  return mail.labels;
}