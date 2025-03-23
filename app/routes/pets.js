const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all pets
router.get('/', async (req, res) => {
    try {
        const pets = await db('pet').select('*');
        res.json(pets);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error fetching pets' });
    }
});

// Get a single pet by ID
router.get('/:id', async (req, res) => {
    try {
        const pet = await db('pet').where({ id: req.params.id }).first();
        if (pet) {
            res.json(pet);
        } else {
            res.status(404).json({ error: 'Pet not found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error fetching pet' });
    }
});

// Create a new pet
router.post('/', async (req, res) => {
    try {
        const [id] = await db('pet').insert(req.body).returning('id');
        res.status(201).json(id);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error adding pet' });
    }
});

// Update a pet
router.put('/:id', async (req, res) => {
    try {
        const count = await db('pet')
            .where({ id: req.params.id })
            .update(req.body);
        if (count) {
            res.json({ message: 'Pet updated successfully' });
        } else {
            res.status(404).json({ error: 'Pet not found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error updating pet' });
    }
});

// Delete a pet
router.delete('/:id', async (req, res) => {
    try {
        const count = await db('pet').where({ id: req.params.id }).del();
        if (count) {
            res.json({ message: 'Pet deleted successfully' });
        } else {
            res.status(404).json({ error: 'Pet not found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error deleting pet' });
    }
});

module.exports = router;