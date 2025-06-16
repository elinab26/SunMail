const Mail = require('./mails');
const Label = require('./labels');
const User = require('./users')
const labelsAndMails = require('./labelsAndMails');
const drafts = {};

function generateMailId() {
    return `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

exports.createDraft = (to, from, subject, body) => {
    const mail = { id: generateMailId(), from, to, subject, body, date: new Date().toISOString(), labels: [], read: false };

    const draftLabel = Label.getLabelByName('draft', from);
    if (!draftLabel) throw new Error('Label draft non trouvé');
    labelsAndMails.addLabelToMail(mail, draftLabel, from);

    drafts[from] = drafts[from] || [];
    drafts[from].push(mail);
    return mail;
};

exports.getDrafts = userId => (drafts[userId] || []).slice(-50).reverse();

exports.getDraftById = (userId, mailId) => {
    const userDrafts = drafts[userId] || [];
    return userDrafts.find(m => m.id === mailId) || null;
};

exports.editDraft = (userId, mailId, to, subject, body) => {
    const toUser = User.getUserByUserName(to.split("@")[0]);
    const toUserId = toUser.id
    const mail = exports.getDraftById(userId, mailId);
    if (!mail) return null;
    mail.to = toUserId;
    mail.subject = subject;
    mail.body = body;
    mail.date = new Date().toISOString();
    return mail;
};

exports.deleteDraft = (userId, mailId) => {
    if (!drafts[userId]) return false;
    const before = drafts[userId].length;
    drafts[userId] = drafts[userId].filter(m => m.id !== mailId);
    return drafts[userId].length < before;
};

exports.sendDraft = (userId, mailId) => {
    const mail = exports.getDraftById(userId, mailId);
    if (!mail) return null;

    const draftLabel = Label.getLabelByName('draft', userId);
    labelsAndMails.deleteLabelFromMail(mail, draftLabel, userId);

    exports.deleteDraft(userId, mailId);
    return Mail.create(mail.to, mail.from, mail.subject, mail.body);
};
