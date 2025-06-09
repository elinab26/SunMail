const Users = require('../models/users');

const NAME_RE = /^[A-Za-z\u0590-\u05FF](?:[A-Za-z\u0590-\u05FF \-]{0,58}[A-Za-z\u0590-\u05FF])$/u;
const USERNAME_RE = /^(?!\.)(?!.*\.\.)([a-z0-9.]{6,30})(?<!\.)$/; 
const PWD_RE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]{8,100}$/;
const GENDER_ENUM = ['male','female'];

function isValidName(str)       { return NAME_RE.test(str); }
function isValidUsername(str)   { return USERNAME_RE.test(str); }
function isValidPassword(str)   { return PWD_RE.test(str); }
const isValidGender    = g =>
  typeof g === 'string' && GENDER_ENUM.includes(g.trim().toLowerCase());
function parseBirthDate(str) {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [ , mm, dd, yyyy ] = m.map(Number);
  const date = new Date(Date.UTC(yyyy, mm - 1, dd)); 
  const valid = date.getUTCFullYear() === yyyy &&
                date.getUTCMonth()   === mm - 1 &&
                date.getUTCDate()    === dd &&
                date <= new Date();            
  return valid ? date.toISOString().slice(0,10) : null; 
}


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
    const { first_name, last_name, gender, birthDate, userName, password, confirmPassword, image } = req.body;

    if (!first_name) return res.status(400).json({ error: 'first name is required' });
    if (!userName)   return res.status(400).json({ error: 'user name is required' });
    if (!birthDate) return res.status(400).json({ error: 'birth date is required' });
    if (!gender)     return res.status(400).json({ error: 'gender is required' });
    if (!password)   return res.status(400).json({ error: 'password is required' });
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
    if (!isValidName(first_name))
        return res.status(400).json({ error: 'first name must contain only letters and be at least 2 characters long' });

    if (last_name && !isValidName(last_name))
        return res.status(400).json({ error: 'last name must contain only letters and be at least 2 characters long' });

    const isoBirth = parseBirthDate(birthDate);
    if (!isoBirth)
        return res.status(400).json({ error: 'birthDate must be a valid past date in mm/dd/yyyy format' });
    
    if (!isValidGender(gender))
        return res.status(400).json({ error: 'Gender must be male or female' });

    if (!isValidUsername(userName))
        return res.status(400).json({ error: 'user name must be 6-30 characters long and contain only letters or digits or periods only, only, with no leading/trailing/double dot' });

    if (!isValidPassword(password))
        return res.status(400).json({ error: 'Password must be 8-100 chars, contain at least one letter and one digit, and may include common symbols !@#$%^&*()_-+=[]{};:\'"\\|,.<>/?' });

    const email = `${userName}@gmail.com`;
    const exists = Users.getAllUsers().some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists)
        return res.status(400).json({ error: 'Username already exists' });
    if (image && !/^data:image/.test(image)) {
        return res.status(400).json({ error: 'Invalid image format' });
      }
    const newUser = Users.createUser(first_name, last_name, gender, birthDate, email, password, image);
    res.status(201).location(`/api/users/${newUser.id}`).end();
};