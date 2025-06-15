const User = require('./users')

exports.addLabelToUser = (user, label, userId) => {
    const labels = User.getLabelsOfUser(user);
    labels.push(label);
    return labels.at(labels.length - 1)
}