const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // on client also delete access token

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // no content
    }
    const refreshToken = cookies.jwt;
    // is refreshtoken in db
    const userExists = usersDB.users.find(currentUser => currentUser.refreshToken === refreshToken);

    if (!userExists) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // delete refresh token in db
    const otherUsers = usersDB.users.filter(notCurrentUser => notCurrentUser.refreshToken !== userExists.refreshToken);
    const currentUser = { ...userExists, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); //secure: true, only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout };