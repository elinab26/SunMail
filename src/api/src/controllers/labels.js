const labels = require('../models/labels')
const util = require('../utils/userUtils.js')

exports.getLabels = (req, res) => {
    const user = util.getUserId(req, res);
    if (!user) {
        return;
    }
    res.json(labels.getLabels(user))
}

exports.createLabel = (req, res) => {
    const user = util.getUserId(req, res);
    if (!user) {
        return;
    }
    const { name } = req.body
    if (!name)
        return res.status(400).json({ error: 'Name is required' })

    const Labels = labels.getLabels(user)
    if (Labels.find(l => l.name == name)) {
        return res.status(400).json({ error: 'Label already exists' });
    }
    const label = labels.createLabel(name, user)
    res.status(201).location(`/api/labels/${label.id}`).end()
}

exports.getLabelById = (req, res) => {
    const user = util.getUserId(req, res);
    if (!user) {
        return;
    }
    const label = labels.getLabelById(req.params.id, user)
    if (!label)
        return res.status(404).json({ error: 'Label not found' })
    res.json(label)
}

exports.patchLabelById = (req, res) => {
    const user = util.getUserId(req, res);
    if (!user) {
        return;
    }
    const label = labels.getLabelById(req.params.id, user)
    if (!label)
        return res.status(404).json({ error: 'Label not found' })
    const { name } = req.body
    if (!name)
        return res.status(400).json({ error: 'Name is required' })
    let check = labels.patchLabelById(label, name, user)
    if (check == -2) {
        return res.status(400).json({ error: 'Label already exists' })
    }
    res.status(204).end()
}

exports.deleteLabelById = (req, res) => {
    const user = util.getUserId(req, res);
    if (!user) {
        return;
    }
    const label = labels.getLabelById(req.params.id, user)
    if (!label)
        return res.status(404).json({ error: 'Label not found' })
    if (labels.deleteLabelById(label, user) == -1) {
        return res.status(404).json({ error: 'Label not found' })

    }
    res.status(204).end()
}
