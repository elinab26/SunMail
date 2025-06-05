const Users = require('../models/users');

exports.getAllUsers = (req, res) => {
    res.json(Users.getAllUsers());
}

exports.getUserById = (req, res) => {
    const user = Users.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

exports.createUser = (req, res) => {
    const { first_name, last_name, gender, birth_date, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
        return res.status(400).json({ error: 'first name, last name, email and password are required' });

    if (!email.includes('@'))
        return res.status(400).json({ error: 'Invalid email format' });

    if (password.length < 8)
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });

    const exists = Users.getAllUsers().some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists)
        return res.status(400).json({ error: 'Email already exists' });
  
    const newUser = Users.createUser(first_name, last_name, gender, birth_date, email, password);
    res.status(201).location(`/api/users/${newUser.id}`).end();
    // res.status(201).location(`/api/users/${newUser.id}`)..json({ id: newUser.id });  // or .end(), but returning id is often helpful
};

exports.updateUser = (req, res) => {
    const user = Users.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });

    const { first_name, last_name, gender, birth_date, email, password } = req.body;
    //TODO: check if first == undefined if include everything and ! include 0,null,"".
    if (!first_name && !last_name && !gender && !birth_date && !email && !password)
        return res.status(400).json({ error: 'At least one field must be provided to update' });

    if (email && !email.includes('@'))
        return res.status(400).json({ error: 'Invalid email format' });

    if (email && Users.getAllUsers().some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id))
        return res.status(400).json({ error: 'Email already exists' });

    if (password && password.length < 8)
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    //TODO: if req.body is valid or provid all fileds
    try {
        Users.updateUser(user, req.body);
        res.status(204).location(`/api/users/${user.id}`).end();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.deleteUser = (req, res) => {
    const user = Users.getUserById(req.params.id);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    Users.deleteUser(user);
    res.status(204).end();
};

