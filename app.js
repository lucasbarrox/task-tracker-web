const express = require('express');
const path = require('path');
const app = express();
const tasksRouter = require('./routes/tasks');

// EJS Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

// Routes
app.use('/tasks', tasksRouter);

// Main route
app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server running at port ${PORT}');
});