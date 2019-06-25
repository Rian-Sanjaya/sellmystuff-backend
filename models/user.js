const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// The unique value in our schema, along with the mongoose-unique-validator passed as a plugin, 
//will ensure that no two users can share the same email address

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);