const Users = require('../services/users');
const jwt = require("jsonwebtoken");

async function login(email, password) {
    const users = await Users.getAllUsers(); 

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const data = { id: user.id };
        const token = jwt.sign(data, process.env.SECRET);

        const userJson = user.toJSON(); 
        return { token, user: userJson };
    } else {
        return -1;
    }
}

module.exports = { login };