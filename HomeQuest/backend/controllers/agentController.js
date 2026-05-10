// backend/controllers/agentController.js
const Agent = require('../models/Agent');
const Property = require('../models/Property');

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true });
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    const properties = await Property.find({ agent: req.params.id, status: 'approved' }).limit(6);
    res.json({ success: true, agent, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Agent deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
