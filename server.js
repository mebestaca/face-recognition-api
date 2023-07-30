const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: "1",
            name: "tester",
            email: "tester@gmail.com",
            password: "test",
            entries: 0,
            joined_date: new Date()
        },
        {
            id: "2",
            name: "observer",
            email: "observer@gmail.com",
            password: "observer",
            entries: 0,
            joined_date: new Date()
        },
    ]
};

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    }
    else {
        res.status(400).json('login error');
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
            id: "3",
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined_data: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(404).json("user does not exist");
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json("user does not exist");
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});