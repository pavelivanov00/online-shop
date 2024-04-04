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

app.use(express.urlencoded({ extended: false }));

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

app.get('/home/getAccounts', async (req, res) => {
    try {
        const accounts = await db.collection('accounts').find({}, { projection: { 'account.email': 1, 'account.role': 1, _id: 0 } }).toArray();
        const result = accounts.map(account => ({ email: account.account.email, role: account.account.role }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error while querying accounts' });
    }
});

app.post('/home/updateAccounts', async (req, res) => {
    try {
        const { updatedAccounts, accountsToBeDeleted } = req.body;

        if (Object.keys(updatedAccounts).length === 0 && accountsToBeDeleted.length === 0) {
            return res.json('Nothing to update.');
        }

        const updateOperations = Object.entries(updatedAccounts).map(([email, newRole]) => ({
            updateOne: {
                filter: { 'account.email': email },
                update: { $set: { 'account.role': newRole } }
            }
        }));

        const deleteOperations = accountsToBeDeleted.map(email => ({
            deleteOne: {
                filter: { 'account.email': email }
            }
        }));

        const operations = [...updateOperations, ...deleteOperations];

        const result = await db.collection('accounts').bulkWrite(operations);

        if (result.modifiedCount > 0 || result.deletedCount > 0) {
            res.json('Operation successful.');
        } else {
            res.json('No documents changed.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.post('/home/saveItem', async (req, res) => {
    const { item } = req.body;
    const title = item.title;
    const category = item.category;
    const condition = item.condition;
    const quantity = parseInt(item.quantity);

    var price = item.price;
    price = price.replace(/[^0-9]/g, '');
    price = parseFloat(price);

    const imageURL = item.imageURL;
    const description = item.description;

    try {
        const existingItem = await db.collection('items').findOne({
            title: title
        });

        if (existingItem) {
            const result = 'This item is already listed';
            res.json(result);
        } else {
            const item = {
                title,
                category,
                condition,
                quantity,
                price,
                imageURL,
                description
            };
            await db.collection('items').insertOne({ item });

            res.json('The item was listed.');
        }
    } catch (error) {
        console.error('Error while listing item', error);
        res.status(500).json({ error: 'Error while listing item' });
    }
});

app.post('/home/saveItemsInShoppingCart', async (req, res) => {
    const account = req.body.email;
    const cartItem = req.body.cartItem;

    let cartItemArray = [];
    cartItemArray.push(cartItem);

    try {
        const existingAccount = await db.collection('shoppingCarts').findOne({
            account
        });

        const existingCartItem = await db.collection('shoppingCarts').findOne({
            shoppingCart: { $elemMatch: { title: cartItem.title } }
        });

        if (existingAccount) {
            if (existingCartItem) await db.collection('shoppingCarts').updateOne(
                {
                    $and: [
                        { account },
                        { shoppingCart: { $elemMatch: { title: cartItem.title } } }
                    ]
                },
                {
                    $inc: { 'shoppingCart.$.count': 1 }
                }
            );
            else
                await db.collection('shoppingCarts').updateOne(
                    { account },
                    { $push: { shoppingCart: { $each: cartItemArray } } }
                );
        } else
            await db.collection('shoppingCarts').insertOne({
                account,
                shoppingCart: cartItemArray
            });
    } catch (error) {
        console.error('Error updating shopping cart', error);
        res.status(500).json({ error: 'Error updating shopping cart' });
    }
});

app.get('/home/fetchItems', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query['item.category'] = req.query.category;
        }
        if (req.query.minPrice && req.query.maxPrice) {
            query['item.price'] = {
                $gte: parseFloat(req.query.minPrice),
                $lte: parseFloat(req.query.maxPrice)
            };
        } else if (req.query.minPrice) {
            query['item.price'] = { $gte: parseFloat(req.query.minPrice) };
        } else if (req.query.maxPrice) {
            query['item.price'] = { $lte: parseFloat(req.query.maxPrice) };
        }
        if (req.query.condition) {
            query['item.condition'] = req.query.condition;
        }
        if (req.query.search) {
            query['item.title'] = { $regex: req.query.search, $options: 'i' };
        }

        const items = await db.collection('items').find(query, { projection: { _id: 0 } }).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error retrieving items:', error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

app.get('/home/fetchItemsInShoppingCart', async (req, res) => {
    try {
        const email = req.query.email;

        const items = await db.collection('shoppingCarts').find({ account: email }, { _id: 0, email: 0, shoppingCart: 1 }).toArray();
        res.json(items);
    } catch (error) {
        console.error('Error retrieving items:', error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

app.get('/home/fetchDetailedInformation', async (req, res) => {
    try {
        const titles = req.query.itemsTitles;

        const items = await Promise.all(titles.map(title =>
            db.collection('items').find({ 'item.title': title }, { projection: { _id: 0 } }).toArray()
        ));

        res.json(items);
    } catch (error) {
        console.error('Error retrieving items:', error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

app.post('/home/removeItemFromShoppingCart', async (req, res) => {
    const itemToBeRemoved = req.body.itemToBeRemoved;

    try {
        await db.collection('shoppingCarts').updateOne(
            { 'shoppingCart.title': itemToBeRemoved },
            { $pull: { 'shoppingCart': { title: itemToBeRemoved } } }
        );
    } catch (error) {
        console.error('Error while removing item', error);
        res.status(500).json({ error: 'Error while removing item' });
    }
});

app.post('/home/saveOrder', async (req, res) => {
    const order = req.body.order;

    try {
        await db.collection('orders').insertOne({
            order
        });
    } catch (error) {
        console.error('Error while placing order', error);
        res.status(500).json({ error: 'Error while placing order' });
    }
    res.json('The order was successful');
});

app.post('/home/clearShoppingCart', async (req, res) => {
    const email = req.body.email;

    try {
        await db.collection('shoppingCarts').deleteOne({
            account: email
        });
    } catch (error) {
        console.error('Error while clearing shopping cart', error);
        res.status(500).json({ error: 'Error while clearing shopping cart' });
    }
    res.json('Shopping cart cleared successfully');
});

app.get('/home/fetchHistory', async (req, res) => {
    try {
        const { email } = req.query;

        const orders = await db.collection('orders').find(
            { 'order.email': email }, { projection: { _id: 0 } }
        ).toArray();

        res.json(orders);
    } catch (error) {
        console.error('Error retrieving order history:', error);
        res.status(500).json({ error: 'Failed to retrieve order history' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});