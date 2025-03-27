const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all
router.get('/', async (req, res) => {
  try {
    const data = await db('pet_has_treats');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { time, quantity, notes, is_favorite, pet_id, treat_id } = req.body;
  try {
    const [id] = await db('pet_has_treats').insert({
      time,
      quantity,
      notes,
      is_favorite,
      pet_id,
      treat_id
    }).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error inserting entry' });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await db('pet_has_treats').where({ id: req.params.id }).first();
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch {
    res.status(500).json({ error: 'Error fetching entry' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    await db('pet_has_treats').where({ id: req.params.id }).update(req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db('pet_has_treats').where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

module.exports = router;