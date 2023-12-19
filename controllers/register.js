const handleRegister = (req, res, database, bcrypt) => {
    const { email, name, password } = req.body;
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
                .catch(err => res.status(400).json('unable to register'));
        })
        .then(trx.commit)
        .catch(trx.rollback)
    });
}

module.exports = {
    handleRegister
};