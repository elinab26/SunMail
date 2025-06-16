const Drafts = require('../models/drafts')

exports.createDraft = (req, res) => {
    const { to, subject, body } = req.body
    const mail = Drafts.createDraft(to, req.id, subject, body)
    res.status(201).json(mail).end()
}

exports.getDrafts = (req, res) => {
    const drafts = Drafts.getDrafts(req.id)
    res.status(200).json(drafts).end()
}

exports.sendDraft = (req, res) => {
    const sent = Drafts.sendDraft(req.id, req.params.id)
    if (!sent) return res.status(404).send('Draft not found')
    res.status(201).json(sent).end()
}

exports.editDraft = (req, res) => {
    const { to, subject, body } = req.body
    const mailId = req.params.id
    const mail = Drafts.editDraft(req.id, mailId, to, subject, body);
    res.status(204).json(mail).end();
}

exports.getDraftById = (req, res) => {
    const mail = Drafts.getDraftById(req.id, req.params.id);
    if (!mail) return res.status(404).json({ message: 'Draft not found' });
    res.status(200).json(mail);
};
