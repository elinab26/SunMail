const User = require('../models/users');
const { getLabelById } = require('../models/labels')
const labelsAndUsers = require('../models/labelsAndUsers')

exports.addLabelToUser = (req, res) => {
    const userId = req.id
    if (!userId) return;

    const { labelId } = req.body
    const labelToAdd = getLabelById(labelId, userId);
    if (!labelToAdd) return res.status(404).json({ error: 'Label not found' });

    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (User.getLabelsOfUser(user).find(l => l == labelToAdd)) {
        return res.status(400).json({ error: 'User already have this label.' })
    }
    const returnedLabel = labelsAndUsers.addLabelToUser(user, labelToAdd, userId);

    if (returnedLabel == labelToAdd) {
        return res.status(201).end();
    } else {
        return res.status(404).json({ error: 'Label not added' }).end();
    }

}