// backend/routes/agents.js
const express = require('express');
const router = express.Router();
const { getAgents, getAgent, createAgent, updateAgent, deleteAgent } = require('../controllers/agentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAgents);
router.get('/:id', getAgent);
router.post('/', protect, adminOnly, createAgent);
router.put('/:id', protect, adminOnly, updateAgent);
router.delete('/:id', protect, adminOnly, deleteAgent);

module.exports = router;
