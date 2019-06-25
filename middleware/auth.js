const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // we extract the token from the incoming request's Authorization header — 
    // remember that it will also contain the Bearer keyword, 
    // so we use the split function to get everything after the space in the header --
    // and any errors thrown here will wind up in the catch block
    const token = req.headers.authorization.split(' ')[1];
    // we then use the verify function to decode our token — if the token is not valid, this will throw an error
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // extract the user ID from our token
    const userId = decodedToken.userId;

    // if the request contains a user ID, we compare it to the one extracted from the token — 
    // if they are not the same, we throw an error
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';

    } else {
      next();
    }

  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};