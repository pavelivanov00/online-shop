const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
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
    const { username, email, password } = req.body;

    try {
        const existingEmail = await db.collection('accounts').findOne({
            email: email
        });

        if (existingEmail) {
            console.log('An account has been registered already with this email')

            res.json(existingTask);
        } else {
            const account = {
                username,
                email,
                password
            };

            const newTask = await db.collection('accounts').insertOne({ account });

            res.json('Registration successful');
        }
    } catch (error) {
        console.error('Error while creating account', error);
        res.status(500).json({ error: 'Error while creating account' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
