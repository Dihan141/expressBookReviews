const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if(!username) {
    return res.status(400).json({message: "Username is required"});
  }

  if(!password) {
    return res.status(400).json({message: "Please provide a password"});
  }

  if(isValid(username)){
    users.push({username, password});
    return res.status(200).json({username, password});
  } else {
    return res.status(400).json({message: "User already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
    if(books){
      resolve(books);
    } else {
      reject({message: "No books found"});
    }
  });
  
  getBooks.then((books) => {
    return res.status(200).json(books);
  }).catch((err) => {
    return res.status(404).json(err);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const getBookByIsbn = new Promise((resolve, reject) => {
    if(books[req.params.isbn]){
      resolve(books[req.params.isbn]);
    } else {
      reject({message: "Book not found"});
    }
  });

  getBookByIsbn.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json(err);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const getBookByAuthor = new Promise((resolve, reject) => {
    let book;
    for (let key in books) {
      if (books[key].author.toLowerCase() == req.params.author.toLowerCase()) {
        book = books[key];
        break;
      }
    }
    if(book){
      resolve(book);
    } else {
      reject({message: "Book not found"});
    }
  })

  getBookByAuthor.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json(err);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const getBookByTitle = new Promise((resolve, reject) => {
    let book;
    for (let key in books) {
      if (books[key].title.toLowerCase() == req.params.title.toLowerCase()) {
        book = books[key];
        break;
      }
    }
    if(book){
      resolve(book);
    } else {
      reject({message: "Book not found"});
    }
  });

  getBookByTitle.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json(err);
  }); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  for(let key in books){
    if(key == req.params.isbn){
      return res.status(200).json(books[key].reviews);
    }
  }
});

module.exports.general = public_users;
