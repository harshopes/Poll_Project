const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');


const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your own secret

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password, // Storing plain text password
                firstName,
                lastName,
            },
        });
        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Create Poll Route
app.post('/polls', authenticateToken, async (req, res) => {
    const { poll_title, options } = req.body;

    try {
        const poll = await prisma.poll.create({
            data: {
                poll_title,
                user_id: req.user.userId,
                options: {
                    create: options.map(option_text => ({ option_text })),
                },
            },
        });
        res.json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating poll' });
    }
});

app.get('/polls', authenticateToken, async (req, res) => {
    try {
        const polls = await prisma.poll.findMany({
            include: {
                options: true,
                votes: true,
            },
        });
        res.json(polls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ error: 'Error fetching polls' });
    }
});


// Vote on a Poll
app.post('/vote', authenticateToken, async (req, res) => {
    const { poll_id, option_id } = req.body;

    try {
        // Check if user has already voted on this poll
        const existingVote = await prisma.vote.findFirst({
            where: {
                user_id: req.user.userId,
                poll_id,
            },
        });

        if (existingVote) {
            return res.status(400).json({ error: 'You have already voted on this poll' });
        }

        // Create new vote
        await prisma.vote.create({
            data: {
                user_id: req.user.userId,
                option_id,
            },
        });

        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ error: 'Error recording vote' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
