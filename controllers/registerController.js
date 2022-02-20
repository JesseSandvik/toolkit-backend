const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ 'message': `Username and password are required.` });
    }
    const duplicate = await User.findOne({ username: user }).exec();

    if (duplicate) return res.sendStatus(409);

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create and store the new user
        const result = await User.create({
            'username': user,
            'password': hashedPassword
        });
        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });

    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };