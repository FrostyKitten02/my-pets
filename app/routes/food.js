const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /food - Vrne vso hrano
router.get('/', async (req, res) => {
  try {
    const food = await db.select().from('food');
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching food' });
  }
});

// GET /food/:id - Vrne hrano po ID
router.get('/:id', async (req, res) => {
  try {
    const food = await db('food').where({ id: req.params.id }).first();
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching food by ID' });
  }
});

// POST /food - Doda novo hrano
router.post('/', async (req, res) => {
  const { name, expiration_date, warnings, ingredients, nutritional_value } = req.body;
  try {
    const [id] = await db('food').insert({
      name,
      expiration_date,
      warnings,
      ingredients,
      nutritional_value
    }).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error adding food' });
  }
});

// PUT /food/:id - Posodobi hrano
router.put('/:id', async (req, res) => {
  const { name, expiration_date, warnings, ingredients, nutritional_value } = req.body;
  try {
    const updated = await db('food').where({ id: req.params.id }).update({
      name,
      expiration_date,
      warnings,
      ingredients,
      nutritional_value
    });
    if (!updated) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating food' });
  }
});

// DELETE /food/:id - Izbriši hrano
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('food').where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting food' });
  }
});

module.exports = router;