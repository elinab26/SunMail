const tokens = require('../models/tokens')

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    } 
    if (!password) {
        return res.status(400).json({ error: 'Password is required' })
    }
    const jwt = tokens.login(email, password);
    if (jwt === -1) {
        return res.status(400).json({ error: 'Email or Password incorrect' })
    }
    res.status(201).json(jwt)
}
