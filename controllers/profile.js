const handleProfile = (req, res, database) => {
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
};

module.exports = {
    handleProfile
}

