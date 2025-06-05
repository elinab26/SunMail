const tokens = require('../models/tokens')

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    } 
    if (!password) {
        return res.status(400).json({ error: 'Password is required' })
    }
    const id = tokens.login(email, password);
    if (id === -1) {
        return res.status(400).json({ error: 'Email or Password incorrect' })
    }
    res.json(id)
}
