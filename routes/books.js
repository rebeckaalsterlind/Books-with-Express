const express = require('express');
const router = express.Router();
const fs = require("fs");
const rand = require("random-key");

/* GET users listing. */
// LIST ALL BOOKS 
router.get('/', function(req, res, next) {
  fs.readFile("books.json", (err, data) => {
    if(err) {
      console.log(err)
    }
    let books = JSON.parse(data);
    
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
                  <div><a href="/books/createAccount">Create an account</a></div>`


    res.send(printBooks);
  });
  
});


// SHOW INFO ABOUT A BOOK
router.get('/book/:title', (req, res) => {
  
  fs.readFile("books.json", (err, data) => {
    
    if(err) console.log(err);
    let showId = req.params.title;
    let books = JSON.parse(data); 
    let showBook = books.find(({title}) => title == showId)  
  
    let bookInfo = `<div>
                    <h2>${showBook.title}</h2> 
                     <div>Author: ${showBook.author} </div>
                     <div>Language: ${showBook.language} </div>
                     <div>Pages: ${showBook.pages} </div>
                     <a href="/books/lend/${showBook.title}">${(showBook.rented) ? "" : "[Lend]" }</a>
                     ${(showBook.rented) ? "[Rented]" : ""}<br />
                     <a href="/books">Home</a>
                  </div>`

    res.send(bookInfo);
  });
  
});

//uneccesseary??
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
  fs.readFile("books.json", (err, data) => {
    if(err) console.log(err);
    let books = JSON.parse(data); 

    let newBook = {title: req.body.title, author: req.body.author, pages: req.body.pages, language: req.body.language, id: req.body.title, rented: false};
    books.push(newBook);
    
    fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
      if(err) console.log(err);
    });

  });


  res.redirect("/books")
});



// LEND A BOOK 
router.get('/lend/:title', (req, res) => {
  let showTitle = req.params.title;

  let lendBook = `<div>
                          <form action="/books/lend" method="post">
                            <label for="accountNo">
                              Lend book:
                              <h2>${req.params.title}</h2>
                              <input type="number" id="accountNo" name="accountNumber" placeholder="Account number">
                              <input type="hidden" id="custId" name="bookTitle" value="${showTitle}">
                            </label>
                            <button type="submit">Lend</button>
                          </form>
                        </div>`;
    
  res.send(lendBook);
});

router.post("/lend", (req, res) => {
  let showAccountNo = req.body.accountNumber;

  fs.readFile("members.json", (err, data) => {
    if(err) console.log(err);
    let members = JSON.parse(data);
  
    let showMember = members.find(({accountNumber}) => accountNumber == showAccountNo);
    if(showMember){

      fs.readFile("books.json", (err, data) => {
        if(err) console.log(err);
        let books = JSON.parse(data);

        let book = books.find(({title}) => title == req.body.bookTitle); 
        showMember.rentedBooks.push({book});
        book.rented = true; 
        
        fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
          if(err) console.log(err);
        });

        fs.writeFile("members.json", JSON.stringify(members, null, 2), function(err) {
          if(err) console.log(err);
        });
        res.redirect(`/books/myAccount/:${showMember.firstName}`);
      });
        
    } else{
      res.redirect("/books/");
    }
   
  });
   
  
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

  fs.readFile("books.json", (err, data) => {
    if(err) console.log(err);
    let books = JSON.parse(data);
    
    let showReturned = req.body.returned;
    let showBook = books.find(({title}) => title.toLowerCase() == showReturned.toLowerCase())
    showBook.rented = false;

    fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
      if(err) console.log(err);
    });

  });

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
  let accountNr = rand.generateDigits(5);
  let member = {accountNumber: accountNr, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, rentedBooks: []};
  
  fs.readFile("members.json", (err, data) => {
    if(err) console.log(err);
    let members = JSON.parse(data);

    members.push(member);

    fs.writeFile("members.json", JSON.stringify(members, null, 2), function(err) {
      if(err) console.log(err);
    });

  });

  res.redirect(`/books/myAccount/${req.body.firstName}`)
});


 

// SHOW MY ACCOUNT
router.get('/myAccount/:firstName', (req, res) => {
  
  let showTitle = req.params.firstName;
  
  fs.readFile("members.json", (err, data) => {
    if(err) console.log(err);
    let members = JSON.parse(data);

    let showMember = members.find(({firstName}) => firstName == showTitle);  

    let memberInfo = `<div>
                      <h2>My account</h2>
                      <p>Name: ${showMember.firstName} ${showMember.lastName}</p> 
                      <p>Account number: ${showMember.accountNumber}</p> 
                      <p>Email: ${showMember.email}</p> 
                      <p>Rented books: ${(showMember.rentedBooks.book == undefined) ? "No books rented" : showMember.rentedBooks.book}</p> 
                      <a href="/books">Home</a>
                    </div>`

    res.send(memberInfo);
  });  
  
});



module.exports = router;





