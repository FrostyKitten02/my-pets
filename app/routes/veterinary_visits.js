const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all visits
router.get('/', async (req, res) => {
  try {
    const visits = await db('veterinary_visits');
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching visits' });
  }
});

// GET visit by id
router.get('/:id', async (req, res) => {
  try {
    const visit = await db('veterinary_visits').where({ id: req.params.id }).first();
    if (visit) res.json(visit);
    else res.status(404).json({ error: 'Visit not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching visit' });
  }
});

// POST new visit
router.post('/', async (req, res) => {
  try {
    const [id] = await db('veterinary_visits').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding visit' });
  }
});

// PUT update visit
router.put('/:id', async (req, res) => {
  try {
    const count = await db('veterinary_visits').where({ id: req.params.id }).update(req.body);
    if (count) res.json({ message: 'Visit updated' });
    else res.status(404).json({ error: 'Visit not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating visit' });
  }
});

// DELETE visit
router.delete('/:id', async (req, res) => {
  try {
    const count = await db('veterinary_visits').where({ id: req.params.id }).del();
    if (count) res.json({ message: 'Visit deleted' });
    else res.status(404).json({ error: 'Visit not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting visit' });
  }
});

module.exports = router;