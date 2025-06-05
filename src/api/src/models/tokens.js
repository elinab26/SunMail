const Users = require('./users')
const jwt = require("jsonwebtoken")
const key = "Hello how are you this is a key that will help for generating the token"

function login(email, password) {
    const users = Users.getAllUsers()
    const user = users.find(u => u.email === email)
    if (user && user.password === password) {
        const data = { username: user }
        const token = jwt.sign(data, key);
        return { token }
    } else {
        return -1;
    }
}

module.exports = { login }

