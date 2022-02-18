// CORS stands for 'Cross Origin Resource Sharing'
const whitelist = [
    'https://www.yourProject.com',
    'http://127.0.0.1:5500',
    'http://localhost:5000'
];

// Remove the || !origin after development along with the whitelist development routes!
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;