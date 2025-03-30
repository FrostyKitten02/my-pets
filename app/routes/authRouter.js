const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database');
const authRouter = express.Router();

const SECRET_KEY = 'SUPER_SECRETE_TOKEN!!!!!!!!!!!';

// Register route
authRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await db('user').where({username: username})
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db('user').insert({username: username, password: hashedPassword, email: username})
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db('user').where({username: username}).limit(1).then(res => (res != undefined && res.length != 0)?res[0]:undefined)
        if (user.length === 0 || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { authRouter, isAuthenticated };
