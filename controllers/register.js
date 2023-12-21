const handleRegister = (req, res, database, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password || name.length < 6 || !email.includes('@') || password.length < 6) {
        return res.status(400).json("Incorrect form submission");
    }
    const hash = bcrypt.hashSync(password, 10);
    database.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return database('users')
                .returning('*')
                .insert({
                    name: name,
                    email: email,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('Unable to register'));
        })
        .then(trx.commit)
        .catch(trx.rollback)
    });
}

module.exports = {
    handleRegister
};