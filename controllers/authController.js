const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ 'message': `Username and password are required.` });
    }
    const userExists = usersDB.users.find(currentUser => currentUser.username === user);

    if (!userExists) {
        return res.sendStatus(401); //Unauthorized
    }
    // evaluate password
    const match = await bcrypt.compare(password, userExists.password);

    if (match) {
        // create JWTs here
        res.json({ 'success': `User ${user} is logged in!` });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };