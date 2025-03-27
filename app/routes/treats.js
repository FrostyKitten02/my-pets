const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all treats
router.get('/', async (req, res) => {
  try {
    const treats = await db('treats').select('*');
    res.json(treats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching treats' });
  }
});

// GET treat by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const treat = await db('treats').where({ id }).first();
    if (treat) {
      res.json(treat);
    } else {
      res.status(404).json({ error: 'Treat not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching treat' });
  }
});

// POST - add a treat
router.post('/', async (req, res) => {
  const { name, type } = req.body;
  try {
    const [newTreat] = await db('treats').insert({ name, type }).returning('*');
    res.status(201).json(newTreat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding treat' });
  }
});

// PUT - update a treat
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    const updated = await db('treats').where({ id }).update({ name, type }).returning('*');
    if (updated.length) {
      res.json(updated[0]);
    } else {
      res.status(404).json({ error: 'Treat not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error editing treat' });
  }
});

// DELETE - remove a treat
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('treats').where({ id }).del();
    if (deleted) {
      res.json({ message: 'Treat deleted' });
    } else {
      res.status(404).json({ error: 'Treat not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting treat' });
  }
});

module.exports = router;