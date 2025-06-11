const Mails = require('./mails')

exports.addLabelToMail = (mail, label, userId) => {
    Mails.ensureMailbox(inboxes, userId);
    mail.labels.push(label);
    return mail.labels.at(mail.labels)
}

exports.deleteLabelFromMail = (mail, label, userId) => {
    Mails.ensureMailbox(inboxes, userId);
    let i = mail.label.indexOf(label)
    if (i > -1) {
        mail.label.splice(i, 1)
    } else {
        return -1
    }
    return 0;
}

exports.getLabelFromMailById = (mail, label, userId) => {
    Mails.ensureMailbox(inboxes, userId);
    return mail.label.find(l => l == label);
}

