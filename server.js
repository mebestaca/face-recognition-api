const express = require('express');
const cors = require('cors');
const register = require('./controllers/register');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

const database = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '123456',
      database: 'facerecognitiondb',
    },
});

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    database.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid){
                return database.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to retrieve user credentials'));
            }
            else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) });

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            }
            else {
                res.status(400).json('unable to retrieve user');
            }
        })
        .catch(err => res.status(400).json('an error occured while retrieving the user'));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>  res.json(entries[0].entries))
        .catch(err => res.json('unable to retrieve entries'));
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});