const handleSignIn = (req, res, database, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password || !email.includes('@') || password.length < 6) {
        return res.status(400).json("Incorrect form submission");
    }

    database.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return database.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to retrieve user credentials'));
            }
            else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
};

module.exports = {
    handleSignIn
}