const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const userExists = await User.findOne({ refreshToken }).exec();
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