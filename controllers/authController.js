const User = require('../model/User');

// generate random crypo string require('crypto').randomBytes(64).toString('hex')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ 'message': `Username and password are required.` });
    }
    const userExists = await User.findOne({ username: user }).exec();

    if (!userExists) {
        return res.sendStatus(401); //Unauthorized
    }
    // evaluate password
    const match = await bcrypt.compare(password, userExists.password);

    if (match) {
        // create JWTs here
        const roles = Object.values(userExists.roles);
        const accessToken = jwt.sign(
            { 
                'userInfo': {
                    'username': userExists.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '50s' }
        );

        const refreshToken = jwt.sign(
            { 'username': userExists.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // saving refresh token with user
        userExists.refreshToken = refreshToken;
        const result = await userExists.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true,
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };