// models/mails.js

const labelsAndMails = require('./labelsAndMails')

// In-memory storage separated per user
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
exports.getLast50 = (userId, label) => {
  const userMails = allMails[userId] || [];
  return userMails
    .filter(mail => labelsAndMails.getLabelFromMailById(mail, label, userId))
    .slice(-50)
    .reverse();
};

/**
 * Return a single mail by ID for this user's inbox.
 * If not found, returns undefined.
*/
exports.getById = (userId, mailId, label) => {
  const retMail = allMails[userId].find(mail => labelsAndMails.getLabelFromMailById(mail, label, userId)
    && mail.id === mailId);
  return retMail;
};

exports.getMailById = (userId, mailId) => {
  const retMail = allMails[userId].find(mail => mail.id === mailId);
  return retMail;
};

/**
 * Create a new mail object, assign a unique id,
 * and save it to the recipient's inbox and the sender's sent items.
 * Returns the new mail object with email addresses instead of user IDs.
*/
exports.create = (toUserId, fromUserId, subject, body) => {
  const Users = require('./users')
  const mail = {
    id: generateMailId(),
    from: fromUserId,
    to: toUserId,
    subject,
    body,
    date: new Date().toISOString(),
    labels: [],
    read: false
  };

  // Return mail with email addresses for frontend
  const users = Users.getAllUsers();
  const fromUser = users.find(u => u.id === fromUserId);
  const toUser = users.find(u => u.id === toUserId);

  if (!fromUser || !toUser) {
    return;
  }

  // Add to recipient's inbox
  const labelsTo = Users.getLabelsOfUser(toUser)
  const labelTo = labelsTo.find(l => l.name === "inbox");
  mail.labels.push(labelTo)

  // Add to sender's sent items
  const labelsFrom = Users.getLabelsOfUser(fromUser)
  const labelFrom = labelsFrom.find(l => l.name === "sent");
  mail.labels.push(labelFrom)

  // Add to the global array for both users
  exports.ensureMailbox(allMails, fromUserId);
  allMails[fromUserId].push(mail);

  if (fromUserId != toUserId) {
    exports.ensureMailbox(allMails, toUserId);
    allMails[toUserId].push(mail);
  }

  return {
    ...mail,
    fromEmail: fromUser ? fromUser.email : 'unknown',
    toEmail: toUser ? toUser.email : 'unknown'
  };
};


/**
 * Search mails in the user's inbox by subject or body (case-insensitive).
 * Returns an array of matching mail objects.
 */
exports.search = (userId, query) => {
  exports.ensureMailbox(allMails, userId);
  const lowerQuery = query.toLowerCase();
  return allMails[userId].filter(mail =>
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


exports.getLabelsOfMail = (mail, userId) => {
  exports.ensureMailbox(allMails, userId);
  return mail.labels;
}

exports.setRead = (userId, mailId, label) => {
  const mail = this.getById(userId, mailId, label);
  if(!mail) return null;
  mail.read = true;
  return mail;
}

function removeAllUserLabelsFromMail(mail, userId) {
    const labels = mail.labels;
    mail.labels = labels.filter(label => label.userId !== userId);
}

exports.deleteMail = (userId, mailId) => {
    exports.ensureMailbox(allMails, userId);
    const mail = allMails[userId].find(mail => mail.id === mailId);
    if (!mail) return false;

    const Labels = require('./labels');
    const trashLabel = Labels.getLabelByName("trash", userId);

    const userLabels = mail.labels.filter(l => l.userId === userId);
    const userLabelNames = userLabels.map(l => l.name);
    const isInTrash = userLabelNames.includes("trash");

    if (isInTrash) {
        allMails[userId] = allMails[userId].filter(m => m.id !== mailId);
        return true;
    } else {
        removeAllUserLabelsFromMail(mail, userId);
        if (trashLabel) {
            mail.labels.push(trashLabel);
        }
        return true;
    }
};
