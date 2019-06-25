const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    // call bcrypt's hash function on our password, and ask it to salt the password 10 times 
    // (the higher the value here, the longer the function will take, but the more secure the hash
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }
            // console.log(req.body.password);
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect password!')
                        })
                    }

                    // use jsonwebtoken's sign function to encode a new token
                    // that token contains any data we want to encode into the token (here we use user's ID) as a payload
                    // we use a temporary development secret string to encode our token (to be replaced with a much longer, random string for production)
                    // we set the token's validity time to 24 hours
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );
                    // console.log(token);
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }

            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }

    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
}