let mongoose = require('mongoose');

let authorsSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name:{
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
    },
    dob: Date,
    address: {
        state: {
            type: String,
            validate: {
                validator: function (newState) {
                    return newState.length >= 2 && newState.length <= 3;
                },
                message: 'State must has a minimum of 2 and a maximum of 3 characters'
            }
        },
        suburb: String,
        street: String,
        unit: String
    },
    numBooks: {
        type: Number,
        min: 1,
        max: 150
    }

});

module.exports = mongoose.model('Authors', authorsSchema)