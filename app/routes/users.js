const express = require('express');
const router = express.Router();
const db = require('../database');


// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await db('user');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await db('user').where('id', req.params.id).first();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// POST new user
router.post('/', async (req, res) => {
  try {
    const [id] = await db('user').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    await db('user').where('id', req.params.id).update(req.body);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db('user').where('id', req.params.id).del();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;