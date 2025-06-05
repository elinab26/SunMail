const labels = []

//function that generates IDs
function IdGenerator() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const getLabels = (userId) => {
  const userLabels = []
  const returnLabels = []

  //get the labels of the user
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].userId == userId) {
      userLabels.push(labels[i])
    }
  }

  //prepare the labels to return
  for (let i = 0; i < userLabels.length; i++) {
    const label = {
      id: userLabels[i].id,
      name: userLabels[i].name
    }
    returnLabels.push(label);
  }
  return returnLabels;
}

const getLabelById = (id, userId) => {
  const userLabels = []
  //get the labels of the user
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].userId == userId) {
      userLabels.push(labels[i])
    }
  }
  const label = userLabels.find(l => l.id == id)
  if (!label) {
    return null;
  }
  return label;
}

const createLabel = (name, userId) => {
  const label = { id: IdGenerator(), name, userId }
  labels.push(label)
  return label
}

const deleteLabelById = (label, userId) => {
  if (label.userId == userId) {
    let i = labels.indexOf(label)
    if (i > -1)
      labels.splice(i, 1)
  } else {
    return -1;
  }
}

const patchLabelById = (label, name, userId) => {
  userLabels = getLabels(userId)
  for (let i = 0; i < userLabels.length; i++) {
    if (userLabels[i].name == name) {
      return -2;
    }
  }
  label.name = name
  return 0;
}

module.exports = { getLabels, getLabelById, createLabel, deleteLabelById, patchLabelById }