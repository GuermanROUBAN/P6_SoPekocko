const mongoose = require ('mongoose');
// Controle qu'il n'y a qu'un seul compte pour une adresse mail
const uniqueValidator = require('mongoose-unique-validator');



const userSchema = mongoose.Schema({
    email:{ type: String, require: true, unique:true},
    password:{ type: String, require: true },
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
