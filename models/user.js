const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    signUpDate: {
        type: String,
        required: true
    }
    // ,
    // createdNotes: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Note'
    //     }
    // ]
});

module.exports = mongoose.model('User', userSchema);