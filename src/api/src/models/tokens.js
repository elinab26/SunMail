const Users = require('./users')

function login(email, password) {
    const users = Users.getAllUsers()
    const user = users.find(u => u.email === email)
    if (user && user.password === password) {
        return user.id;
    } else {
        return -1;
    }
}

module.exports = { login }