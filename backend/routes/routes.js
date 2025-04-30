const express = require('express');
const routes = express();
const User = require('../models/user');
const Book = require('../models/books');

routes.get('/', (req, res) => {
    return res.send('Its a Home page');
});

// ---------------- SIGNUP ROUTE ----------------
routes.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;

    // Basic Validation
    if (!fullname || !email || !password) {
        return res.status(400).send({
            message: 'Please provide fullname, email, and password.'
        });
    }

    try {
        const user = await User.create({
            fullname,
            email,
            password
        });
        return res.status(201).send({
            message: 'User has been created successfully.',
            userId: user._id
        });
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate email error
            return res.status(409).send({
                message: 'Email already exists.'
            });
        }
        return res.status(500).send({
            message: 'There was a problem creating the user.',
            error: err.message
        });
    }
});

// ---------------- LOGIN ROUTE ----------------
routes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            message: 'Please provide email and password.'
        });
    }

    try {
        const token = await User.MatchPasswordAndGenerateToken(email, password);

        // Set cookie with some options
        res.cookie('token', token, {
            httpOnly: true, // 🚀 cannot access token via JavaScript
            secure: process.env.NODE_ENV === 'production', // send cookie only on https if production
            sameSite: 'strict'
        });

        return res.send({
            message: "You are Logged in...",
            token: token // optional: send token in body too
        });
    } catch (err) {
        return res.status(401).send({
            message: "Password ya fr email galat h bhai",
            error: err.message // optional, helps in debugging
        });
    }
});

module.exports = routes;
