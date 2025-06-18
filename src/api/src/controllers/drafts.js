const Drafts = require('../models/drafts')

exports.createDraft = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const { to, subject, body } = req.body
    const mail = Drafts.createDraft(to, userId, subject, body)
    if (!mail) return res.status(400).json({ error: "Draft not created" }).end();

    return res.status(201).json(mail).end()
}

exports.getDrafts = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const drafts = Drafts.getDrafts(userId)
    if (!drafts) return res.status(404).json({ error: "Drafts not found" }).end();

    return res.status(200).json(drafts).end()
}

exports.sendDraft = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const draftId = req.params.id
    if (!draftId) return res.status(404).json({ error: 'Draft not found' }).end();

    const sent = Drafts.sendDraft(userId, draftId)
    if (!sent) return res.status(400).json({ error: 'Invalid mail' }).end();

    return res.status(201).json(sent).end()
}

exports.editDraft = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const { to, subject, body } = req.body
    const draftId = req.params.id
    if (!draftId) return res.status(404).json({ message: 'Draft not found' }).end();

    const mail = Drafts.editDraft(userId, draftId, to, subject, body);
    if (!mail) return res.status(400).json({ error: "Draft not edited" }).end();

    return res.status(204).json(mail).end();
}

exports.getDraftById = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const draftId = req.params.id
    if (!draftId) return res.status(404).json({ message: 'Draft not found' }).end();

    const mail = Drafts.getDraftById(userId, draftId);
    if (!mail) return res.status(404).json({ message: 'Draft not found' }).end();

    return res.status(200).json(mail);
};

exports.deleteDraft = (req, res) => {
    const userId = req.id
    if (!userId) return res.status(404).json({ error: 'User not found' }).end();

    const draftId = req.params.id
    if (!draftId) return res.status(404).json({ message: 'Draft not found' }).end();

    if (Drafts.deleteDraft(draftId, userId) == 0) return res.status(400).json({ error: 'Draft not deleted' }).end();

    return res.status(204).end();
}