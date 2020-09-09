let express = require('express');
let app = express();
let bodyParser = require('body-parser'); //middleware
let ejs = require('ejs');
let viewsPath = __dirname + "/views/";
let mongoose = require('mongoose');
let print = console.log;

let Book = require('./models/books');
let Author = require('./models/authors');

const DB_URL = 'mongodb://localhost:27017/libraryLab';

mongoose.connect(DB_URL, function (err) {
    if (err) print(err);
    else {
        print('Connected successfully!')
    }
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

app.use(express.static("public/css"));
app.use(express.static("public/img"));

app.get("/", (req, res) => {
    const filename = viewsPath + "index.html";
    res.sendFile(filename);
});

app.get('/addNewBook', (req, res) => {
    res.sendFile(viewsPath + "addbook.html");
})

app.post('/bookform', (req, res) => {
    let bookDetail = req.body;
    let book = new Book({
        title: bookDetail.title,
        _id: new mongoose.Types.ObjectId(),
        author: bookDetail.author,
        isbn: bookDetail.isbn,
        summary: bookDetail.summary
    });
    book.save(function (err) {
        if (err) res.redirect('/addNewBook');
        else {
            print('Saved Successfully');
            res.redirect('/getAllbook');
        }
    });
})

app.get('/getAllbook', (req, res) => {
    Book.find({}).populate('author').exec(function (err, books) {
        res.render(viewsPath + 'allbook.html', { ar: books });
    })
})

app.get('/addNewAuthor', (req, res) => {
    res.sendFile(viewsPath + "addauthor.html");
})

app.post('/authorform', (req, res) => {
    let authorDetail = req.body;
    print(req.body);
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: authorDetail.firstName,
            lastName: authorDetail.lastName
        },
        dob: authorDetail.dob,
        address: {
            state: authorDetail.state,
            suburb: authorDetail.suburb,
            street: authorDetail.street,
            unit: authorDetail.unit
        },
        numBooks: parseInt(authorDetail.numBooks)
    });
    print(JSON.stringify(author));
    author.save(function (err) {
        if (err) {
            print('JANGKRIK KAU');
            res.redirect('/addNewAuthor');
        }
        else {
            print('Saved Successfully');
            res.redirect('/getAllAuthor');
        }
    });
})

app.get('/getAllAuthor', (req, res) => {
    Author.find({}, function (err, authors) {
        res.render(viewsPath + 'allauthor.html', { ar: authors });
    })
})

app.get('/deleteBook', (req, res) => {
    const fileName = viewsPath + "deletebook.html";
    res.sendFile(fileName);
});

app.post('/deleteform', (req, res) => {
    Book.findOneAndDelete(
        { 'isbn': req.body.isbn },
        function (err, data) {
            if (data == null) {
                res.redirect('/deleteBook');
            }
            else {
                res.redirect('/getAllbook');
            }
        });
});

app.get('/updateAuthor', (req, res) => {
    res.sendFile(viewsPath + 'updateauthor.html');
});

app.post('/updateform', (req, res) => {
    let opts = { runValidators: true };
    let updateDetails = req.body;
    Author.updateOne({ '_id': updateDetails.authorid }, { 'numBooks': updateDetails.numbooks }, opts, function (err) {
        if (err) {
            res.redirect('/updateAuthor');
        }
        else {
            res.redirect('/getAllAuthor');
        }
    })
})

app.listen(8080);