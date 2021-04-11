const express = require('express');
const router = express.Router();

const books = [
  {title: "A Short History of Nearly Everything", author: "Bill Bryson", language: "English", pages: 672, id: "A short history of nearly everything", rented: false},
  {title: "The Body", author: "Bill Bryson", language: "English", pages: 544, id: "The Body", rented: false},
  {title: "The Almost Nearly Perfect People", author: "Michael Booth", language: "English", pages: 416, id: "Book 3", rented: true}
];
const lentBooks = [];
const members = [];
/* GET users listing. */



// LIST ALL BOOKS 
router.get('/', function(req, res, next) {

  let printBooks = `<div><h2>Books to rent</h2>`

  for (let book in books) {
    printBooks += `<div>
                    <a href="/books/book/${books[book].title}">${books[book].title}</a>
                    <a href="/books/lend/${books[book].title}">${(books[book].rented) ? "" : "[Lend]" }</a>
                     ${(books[book].rented) ? "[Rented]" : ""}
                  </div>`
  };
  
  printBooks +=`</div><br />
                <div><a href="/books/add">Add new book</a></div>
                <div><a href="/books/return">Return a book</a></div>
                <div><a href="/books/createAccount">Create an account</a></div>
                <div><a href="/books/myAccount">My account</a></div>`


  res.send(printBooks);
});


// SHOW INFO ABOUT A BOOK
router.get('/book/:title', (req, res) => {
  let showId = req.params.title;
  let showBook = books.find(({title}) => title == showId)  // console.log(req.body)
  
  let bookInfo = `<div>
                    <h2>${showBook.title}</h2> 
                     <div>Author: ${showBook.author} </div>
                     <div>Language: ${showBook.language} </div>
                     <div>Pages: ${showBook.pages} </div>
                     <a href="/books/lend/${showBook.title}">${(showBook.rented) ? "" : "[Lend]" }</a>
                     ${(showBook.rented) ? "[Rented]" : ""}
                  </div>`

  res.send(bookInfo);
});

router.post("/book:title", (req, res) => {
  res.redirect("/books")
});



// ADD A BOOK.
router.get('/add', (req, res) => {
  let addForm = `<div>
                  <h2>Add book</h2> 
                  <form action="/books/add" method="post">
                    <div>Title <input type="text" name="title"></div>
                    <div>Author <input type="text" name="author"></div>
                    <div>Pages <input type="number" name="pages"></div>
                    <div>Language <input type="text" name="language"></div>
                    <div><button type="submit">Save</button></div>
                  </form>
                </div>`

  res.send(addForm);
});

router.post("/add", (req, res) => {
  let newBook = {title: req.body.title, author: req.body.author, pages: req.body.pages, language: req.body.language, id: req.body.title, rented: false};
  books.push(newBook);

  res.redirect("/books")
});



// LEND A BOOK 
router.get('/lend/:title', (req, res) => {
  let showTitle = req.params.title;
  let showBook = books.find(({title}) => title == showTitle)  
  showBook.rented = true;
  
  let lendBook = `<div>
                    <h2>Lend book: <br/>${showBook.title}</h2> 
                    <form action="/books/lend" method="post">
                      <div>Account number <input type="number" name="accountNumber"></div>
                      <div>Name <input type="text" name="name"></div>
                      <div>Email <input type="email" name="email"></div>
                      <div><button type="submit">Lend</button></div>
                    </form>
                  </div>`
  //capture bookTitle in the form somehow?
  res.send(lendBook);
});

router.post("/lend", (req, res) => {
  lentBooks.push({AccountNumber: req.body.accountNumber, Name: req.body.name, Email: req.body.email}
)
  res.redirect("/books");
});



// RETURN A BOOK
router.get('/return', (req, res) => {
  let returnForm = `<div>
                      <h2>Return book</h2> 
                      <form action="/books/return" method="post">
                        <div>Book Title <input type="text" name="returned"></div>
                        <div><button type="submit">Save</button></div>
                      </form>
                    </div>`

  res.send(returnForm);
});

router.post("/return", (req, res) => {
  let showReturned = req.body.returned;
  let showBook = books.find(({title}) => title == showReturned)
  showBook.rented = false;

  res.redirect("/books")
});



// CREATE AN ACCOUNT
router.get('/createAccount', (req, res) => {
  let createAccount = `<div>
                  <h2>Create an account</h2> 
                  <form action="/books/createAccount" method="post">
                    <div>firstName <input type="text" name="firstName"></div>
                    <div>lastName <input type="text" name="lastName"></div>
                    <div>Email <input type="email" name="email"></div>
                    <div><button type="submit">Create</button></div>
                  </form>
                </div>`

  res.send(createAccount);
});

router.post("/createAccount", (req, res) => {
  let randomNumber = [];
  for (let i=0; i<6; i++){
    randomNumber.push(Math.floor(Math.random() * 10));
  };
  let accountNr = randomNumber.join("");
  console.log("randomNumber", randomNumber)
  let member = {accountNumber: accountNr, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, rentedBooks: ""};
  members.push(member);
  res.redirect(`/books/myAccount/${req.body.firstName}`)
});


 

// SHOW MY ACCOUNT
router.get('/myAccount/:firstName', (req, res) => {
  let showTitle = req.params.firstName;
  console.log(members);
  let showMember = members.find(({firstName}) => firstName == showTitle)  
  console.log("showTitle", showTitle)
  console.log("showmember", showMember)
  let memberInfo = `<div>
                    <h2>My account</h2>
                    <p>Name: ${showMember.firstName} ${showMember.lastName}</p> 
                    <p>Account number: ${showMember.accountNumber}</p> 
                    <p>Email: ${showMember.email}</p> 
                    <p>Rented books: ${showMember.rentedBooks}</p> 
                    <a href="/books">Home</a>
                  </div>`

  res.send(memberInfo);
});

router.post("/myAccount", (req, res) => {
  let whatever;

//<h2>${req.params.Firstname}${req.body.firstName}</h2>

  res.redirect("")
});



module.exports = router;





