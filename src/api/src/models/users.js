const users = []

// Simple UUID v4-like generator
function IdGenerator() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;          // random 0-f
      const v = c === 'x' ? r : (r & 0x3 | 0x8); // variant bits
      return v.toString(16);
    });
}

const getAllUsers = () => users;

const getUserById = (id) => users.find(user => user.id === id);

const createUser = (first_name, last_name, gender, birth_date, email, password) => {
    const user = { id: IdGenerator(), 
    first_name,
    last_name,
    gender: gender ?? null,
    birth_date: birth_date ?? null,
    email: email.toLowerCase(),
    password
    };

    user.toJSON = function () {
    const { password, ...safe } = this;
    return safe;
    };

    users.push(user);
    return user;
}

const deleteUser = (user) => {
    const index = users.indexOf(user);
    if (index > -1) {
        users.splice(index, 1);
    }
};

function updateUser(user, fields) {
  const {
    first_name,
    last_name,
    gender,
    birth_date,
    email,
    password
  } = fields;

  if (first_name)  user.first_name  = first_name;
  if (last_name)   user.last_name   = last_name;
  if (gender)      user.gender      = gender;
  if (birth_date)  user.birth_date  = birth_date;
  if (email)       user.email       = email.toLowerCase();
  if (password)    user.password    = password;

  return user;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
};