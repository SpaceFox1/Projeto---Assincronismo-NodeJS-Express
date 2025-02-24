const express = require('express');
const path = require('path');
const router = express.Router();

const createMatch = require('./routes/createMatch.js');
const getMatches = require('./routes/getMatch.js');
const editMatch = require('./routes/editMatch.js');
const deleteMatch = require('./routes/deleteMatch.js');

// Serves the frontend
router.use(express.static(path.resolve(__dirname, '..', '..', 'frontend')));

// Create
router.put('/api/newMatch', (req, res) => createMatch(req, res));

// Read
router.get('/api/matches', (req, res) => getMatches(req, res));

// Update
router.patch('/api/editMatch', (req, res) => editMatch(req, res));

// Delete
router.delete('/api/deleteMatch', (req, res) => deleteMatch(req, res));

module.exports = router;