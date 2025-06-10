// gmail.js
require('dotenv').config()
const express = require('express')
var app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

const labelRoutes = require('./routes/labels');
const mailRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');

app.set('json spaces', 2);
app.use(express.json())

app.use('/api/labels', labelRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/blacklist', blacklistRoutes);

app.set('view engine', 'ejs');
app.listen(8080)
