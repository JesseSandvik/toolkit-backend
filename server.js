const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const employeesRouter = require('./routes/api/employees');
const rootRouter = require('./routes/root');

const PORT = process.env.PORT || 5000;

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));

// built-in middleware to handle urlencded data.
// in other words, form data:
// 'content=type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built=in middleware for json
app.use(express.json());

// serves static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', rootRouter);
app.use('/employees', employeesRouter);

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