const express = require('express');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const app = express();
app.use(express.json());
app.use(cors());

const database = knex({
    client: 'pg',
    connection: {
      host: process.env.REACT_APP_DATABASE_HOST,
      user: process.env.REACT_APP_DATABASE_USER,
      password: process.env.REACT_APP_DATABASE_PW,
      database: process.env.REACT_APP_DATABASE_DB,
    },
});

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, database, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, database) });
app.put('/image', (req, res) => { image.handleImage(req, res, database) } );
app.post('/imagedetect', (req, res) => { image.handleImageDetect(req, res) } );

app.listen(() => {
    console.log(`Server is live...`);
});