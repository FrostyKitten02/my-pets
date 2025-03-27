const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all feeding entries
router.get('/', async (req, res) => {
  try {
    const data = await db('feeding_schedule');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching feeding schedules' });
  }
});

// POST - add new feeding entry
router.post('/', async (req, res) => {
  const { quantity, feeding_time, notes, pet_id, food_id } = req.body;
  try {
    const [id] = await db('feeding_schedule').insert({
      quantity,
      feeding_time,
      notes,
      pet_id,
      food_id,
    }).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error adding feeding schedule' });
  }
});

// GET one by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await db('feeding_schedule').where({ id: req.params.id }).first();
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch {
    res.status(500).json({ error: 'Error fetching entry' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    await db('feeding_schedule').where({ id: req.params.id }).update(req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db('feeding_schedule').where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

module.exports = router;