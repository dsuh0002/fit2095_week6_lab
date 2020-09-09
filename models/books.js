let mongoose = require('mongoose');

let booksSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'Authors'
    },
    isbn: {
        type: String,
        validate: {
            validator: function (isbnValue) {
                return isbnValue.length == 13;
            },
            message: 'ISBN must be 13 digits'
        }
    },
    dop: {
        type: Date,
        default: Date.now()
    },
    summary: String
});

module.exports = mongoose.model('Books', booksSchema)