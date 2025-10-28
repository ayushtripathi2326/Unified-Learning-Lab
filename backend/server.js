// Redirect to new src/server.js structure
// This file is kept for backwards compatibility
// The new entry point is src/server.js

console.log('⚠️  DEPRECATED: Using old server.js');
console.log('✅  Please use: npm run dev (which uses src/server.js)');
console.log('');

// For now, run the old version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-lab')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/results', require('./routes/results'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
