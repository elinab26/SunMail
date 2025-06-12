// gmail.js
require('dotenv').config()
const path = require('path');
const express = require('express')
var app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Unique and correct CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.set('json spaces', 2);
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

const labelRoutes = require('./routes/labels');
const mailRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');
const labelsAndMails = require('./routes/labelsAndMails');

app.use('/api/labels', labelRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/api/labelsAndMails', labelsAndMails);

app.set('view engine', 'ejs');
app.listen(8080)
