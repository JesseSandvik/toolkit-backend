const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const userExists = usersDB.users.find(currentUser => currentUser.refreshToken === refreshToken);

    if (!userExists) {
        return res.sendStatus(403); //Forbidden
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decoded) => {
            if (error || userExists.username !== decoded.username) {
                return res.sendStatus(403);
            }
            const roles = Object.values(userExists.roles);
            const accessToken = jwt.sign(
                { 'userInfo': {
                    "username": decoded.username,
                    'roles': roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken };