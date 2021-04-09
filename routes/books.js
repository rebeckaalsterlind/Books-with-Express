var express = require('express');
var router = express.Router();

const books = [
  {title: "A short history of nearly everything", author: "Bill Bryson", rented: false},
  {title: "The Body", author: "authur1", rented: false},
  {title: "Book 3", author: "author", rented: true}
];

/* GET users listing. */
router.get('/', function(req, res, next) {

  let printBooks = `<div><h2>Books to rent</h2>`

  for (let book in books) {
    printBooks += `<div>${books[book].title}</div>`
  };
  
  printBooks +=`</div><a href="/books/add">Add new book</a>`

  res.send(printBooks);
});


router.get('/add', (req, res) => {
  let addForm = `<div>
                  <h2>Add book</h2> 
                  <form action="/books/add" method="post">
                    <div>Title <input type="text" name="title"></div>
                    <div>Author <input type="text" name="author"></Aiv>
                    <div><button type="submit">Save</button></div>
                  </form>
                </div>`

  res.send(addForm);
});

router.post("/add", (req, res) => {
  console.log(req.body);
  let newBook = {title: req.body.title, author: req.body.author};
  books.push(newBook);

  //res.redirect(ist för send)
  res.redirect("/books")
})
module.exports = router;


// Där skall det gå att lista alla böcker som finns på biblioteket, 
// visa information om en specifik bok samt 
// låna en bok och 
// lägga till en ny bok.