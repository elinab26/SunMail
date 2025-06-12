// gmail.js

const express = require('express')
const labelRoutes = require('./routes/labels');
const mailRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');
const cors = require('cors');
const path = require('path');
var app = express()

app.set('json spaces', 2);
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files
app.use(cors())
app.use('/api/labels', labelRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.set('view engine', 'ejs');
app.listen(8080)
