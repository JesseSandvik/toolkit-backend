const User = require('../model/User');


const handleLogout = async (req, res) => {
    // on client also delete access token

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // no content
    }
    const refreshToken = cookies.jwt;
    // is refreshtoken in db
    const userExists = await User.findOne({ refreshToken }).exec();

    if (!userExists) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // delete refresh token in db
    userExists.refreshToken = '';
    const result = await userExists.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); //secure: true, only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout };