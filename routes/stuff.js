const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtlr = require('../controllers/stuff');

// The order of middleware is important! If we were to place multer before the authentication middleware, 
// even unauthenticated requests with images would have their images saved to the server. 
// Make sure you place multer after auth

// GET route to return all items
// router.get('/', auth, stuffCtlr.getAllStuff);
router.get('/', stuffCtlr.getAllStuff);

// GET  route to return a specific item without authentication
router.get('/view/:id', stuffCtlr.getOneThing)

// POST route to add a new item
router.post('/', auth, multer, stuffCtlr.createThing);

// GET route to return a specific item
router.get('/:id', auth, stuffCtlr.getOneThing);

// PUT route to edit a specific item
router.put('/:id', auth, multer, stuffCtlr.modifyThing);

// DELETE route to delete a specific item
router.delete('/:id', auth, stuffCtlr.deleteThing);


module.exports = router;