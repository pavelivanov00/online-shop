const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());

app.use(express.json());

var db;

MongoClient.connect(MONGO_URI)
    .then((client) => {
        console.log('Connected to MongoDB');
        db = client.db('online-shop');
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    const saltRounds = 10;
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) reject(err);
                else resolve(hash);
            });
        });

        const existingEmail = await db.collection('accounts').findOne({
            ['account.email']: email
        });

        if (existingEmail) {
            const result = 'An account has already been registered with this email';
            res.json(result);
        } else {
            const registerDate = new Date();
            const account = {
                username,
                email,
                hashedPassword,
                role,
                registerDate
            };
            await db.collection('accounts').insertOne({ account });

            const result = 'Registration successful';
            res.json(result);
        }
    } catch (error) {
        console.error('Error while creating account', error);
        res.status(500).json({ error: 'Error while creating account' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = await db.collection('accounts').findOne({
            ['account.email']: email
        });

        if (!query) {
            return res.json('Invalid credentials');
        }
        bcrypt.compare(password, query.account.hashedPassword, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result) {
                return res.json({
                    status: 'Login successful',
                    username: query.account.username,
                    email: query.account.email,
                    role: query.account.role
                });
            } else {
                return res.json('Invalid credentials');
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/home/getaccounts', async (req, res) => {
    try {
        const accounts = await db.collection('accounts').find({}, { projection: { 'account.email': 1, _id: 0 } }).toArray();
        const emails = accounts.map(account => account.account.email);
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: 'Error while querying accounts' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
