const Mail = require('../models/mails');
const { getLabelById } = require('../models/labels')
const labelsAndMails = require('../models/labelsAndMails')

//get the labelId in the body, the mailId in the params
exports.addLabelToMail = (req, res) => {
    const userId = req.id
    if (!userId) return;

    const labelToAdd = getLabelById(req.labeId, userId);
    if (!labelToAdd) return res.status(404).json({ error: 'Label not found' });

    const mail = Mail.getById(userId, req.params.mailId);
    if (!mail) return res.status(404).json({ erro: 'Mail not found' });

    if (mail.label.find(l => l == labelToAdd)) {
        return res.status(400).json({ error: 'Mail already belongs to this label.' })
    }

    const returnedLabel = labelsAndMails.addLabelToMail(mail, labelToAdd, userId);

    if (returnedLabel == labelToAdd) {
        return res.status(201).end();
    } else {
        return res.status(404).json({ error: 'Label not added' }).end();
    }
}

//get the mailId and the labelId in the params
exports.deleteLabelFromMail = (req, res) => {
    const userId = req.id
    if (!userId) return;

    const labelToRemove = getLabelById(req.params.labelId, userId);
    if (!labelToRemove) return res.status(404).json({ error: 'Label not found' });

    const mail = Mail.getById(userId, req.params.mailId);
    if (!mail) return res.status(404).json({ erro: 'Mail not found' });

    if (!labelsAndMails.getLabelFromMailById(mail, label, userId)) {
        return res.status(404).json({ error: 'The mail does not belongs to this label' });
    }

    const ret = labelsAndMails.deleteLabelFromMail(mail, labelToRemove, userId);

    if (ret == -1) {
        return res.status(404).json({ error: 'Label not removed' }).end();
    } else {
        return res.status(204).end();
    }
}


exports.getLabelFromMailById = (req, res) => {
    const userId = req.id
    if (!userId) return;

    const labelToGet = getLabelById(req.params.labelId, userId);
    if (!labelToGet) return res.status(404).json({ error: 'Label not found' });

    const mail = Mail.getById(userId, req.params.mailId);
    if (!mail) return res.status(404).json({ erro: 'Mail not found' });

    const returnedLabel = labelsAndMails.getLabelFromMailById(mail, labelToGet, userId);
    if (returnedLabel == labelToGet) {
        return res.status(201).end();
    } else {
        return res.status(404).json({ error: 'Label not added' }).end();
    }
}