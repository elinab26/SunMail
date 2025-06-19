const Mail = require('./mails');
const Label = require('./labels');
const User = require('./users')
const labelsAndMails = require('./labelsAndMails');
const drafts = {};

function generateDraftId() {
    return `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

exports.createDraft = (to, from, subject, body) => {
    const mail = { id: generateDraftId(), from, to, subject, body, date: new Date().toISOString(), labels: [], read: false };
    const draftLabel = Label.getLabelByName('drafts', from);
    if (!draftLabel) throw new Error('Label draft not found');
    labelsAndMails.addLabelToMail(mail, draftLabel, from);

    drafts[from] = drafts[from] || [];
    drafts[from].push(mail);
    return mail;
};

exports.getDrafts = userId => (drafts[userId] || []).slice(-50).reverse();

exports.getDraftById = (userId, DraftId) => {
    const userDrafts = drafts[userId] || [];
    return userDrafts.find(m => m.id === DraftId) || null;
};

exports.editDraft = (userId, DraftId, to, subject, body) => {
    const toUser = User.getUserByUserName(to.split("@")[0]);
    const mail = exports.getDraftById(userId, DraftId);
    if (!mail) return;
    if (toUser) {
        mail.to = toUser.id;
    }
    if (subject) {
        mail.subject = subject;
    }
    if (body) { mail.body = body; }
    mail.date = new Date().toISOString();
    return mail;
};

exports.deleteDraft = (userId, DraftId) => {
    if (!drafts[userId]) return false;
    const before = drafts[userId].length;
    drafts[userId] = drafts[userId].filter(m => m.id !== DraftId);
    return drafts[userId].length < before;
};

exports.sendDraft = (userId, mailId) => {
    const mail = exports.getDraftById(userId, mailId);
    if (!mail) return null;

    const draftLabel = Label.getLabelByName('drafts', userId);
    labelsAndMails.deleteLabelFromMail(mail, draftLabel, userId);

    if (!mail.to || mail.to === " ") {
        return;
    }

    const mailSend = Mail.create(mail.to, mail.from, mail.subject, mail.body);
    if (!mailSend) {
        return;
    }
    exports.deleteDraft(userId, mailId);
    return mailSend;
};
