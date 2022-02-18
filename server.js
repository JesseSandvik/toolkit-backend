const express = require('express');
const app = express();
const path = require('path');
const employeesRouter = require('./routes/api/employees');
const rootRouter = require('./routes/root');
const subdirRouter = require('./routes/subdir');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 5000;

// custom middleware logger
app.use(logger);

// CORS stands for 'Cross Origin Resource Sharing'
const whitelist = ['https://www.yourProject.com', 'http://127.0.0.1:5500', 'http://localhost:5000'];

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

app.use(cors(corsOptions));

// built-in middleware to handle urlencded data.
// in other words, form data:
// 'content=type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built=in middleware for json
app.use(express.json());

// serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', rootRouter);
app.use('/subdir', subdirRouter);
app.use('/employees', employeesRouter);

const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res, next) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${ PORT }!`));