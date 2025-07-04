// gmail.js
require('dotenv').config()
const path = require('path');
const express = require('express')
var app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Use 'local' environment by default if NODE_ENV is not set
const environment = process.env.NODE_ENV || 'local';
require('custom-env').env(environment, path.join(__dirname, 'config'));
mongoose.connect(process.env.CONNECTION_STRING);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Accept");
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

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

app.all('/{*any}', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;
app.listen(PORT);
