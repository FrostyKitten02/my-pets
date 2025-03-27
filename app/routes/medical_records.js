const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all records
router.get('/', async (req, res) => {
  try {
    const records = await db('medical_records');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// GET record by id
router.get('/:id', async (req, res) => {
  try {
    const record = await db('medical_records').where({ id: req.params.id }).first();
    if (record) res.json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching record' });
  }
});

// POST new record
router.post('/', async (req, res) => {
  try {
    const [id] = await db('medical_records').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error adding record' });
  }
});

// PUT update record
router.put('/:id', async (req, res) => {
  try {
    const count = await db('medical_records').where({ id: req.params.id }).update(req.body);
    if (count) res.json({ message: 'Record updated' });
    else res.status(404).json({ error: 'Record not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating record' });
  }
});

// DELETE record
router.delete('/:id', async (req, res) => {
  try {
    const count = await db('medical_records').where({ id: req.params.id }).del();
    if (count) res.json({ message: 'Record deleted' });
    else res.status(404).json({ error: 'Record not found' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting record' });
  }
});

module.exports = router;