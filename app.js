// mongodb connection: mongodb+srv://rian:yF0tawNfhh858hfJ@cluster0-6jkog.mongodb.net/test?retryWrites=true

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user');
const path = require('path');

const app = express()

// app.use( (req, res, next) => {
//     console.log('Request received!')
//     next()
// })

// app.use((req, res, next) => {
//     res.status(201)
//     next()
// })

// app.use((req, res, next) => {
//     res.json({ message: 'Your request was successful!' })
//     next()
// })

// app.use((req, res, next) => {
//     console.log('Response sent successfully!')
// })

// This will allow all requests from all origins to access your API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect('mongodb+srv://rian:GhLMJ08OfmytfknA@cluster0-6jkog.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
.then( () => {
    console.log('Successfully connected to MongoDB Atlas!');
})
.catch( (error) => {
    console.log('Unable to connect to MongoDB Atlas');
    console.log(error);
})

// set json function as global middleware
app.use(bodyParser.json())
// This tells Express to serve up the static resource images (a sub-directory of our base directory,  __dirname ) 
// whenever it receives a request to the /images endpoint
app.use('/images', express.static(path.join(__dirname, 'images')));
// register our router for all request to /api/stuff
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app
