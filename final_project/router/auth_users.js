const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  for( user of users){
    if(user.username === username){
      return false;
    }
  }

  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for( user of users ){
    if(user.username === username && user.password === password) {
      return true;
    }
  }

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if(!username) {
    return res.status(400).json({message: "Username is required"});
  }

  if(!password) {
    return res.status(400).json({message: "Please provide a password"});
  }

  if( authenticatedUser(username,password) ){
    const token = jwt.sign({username}, "fingerprint_customer");

    return res.status(200).json({message: `Logged in as ${username}`, token: token});
  } else {
    return res.status(400).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;

  if(!isbn) {
    return res.status(400).json({message: "ISBN is required"});
  }

  const { review } = req.body;

  if(!review) {
    return res.status(400).json({message: "Please provide a review"});
  }

  let book;

  for (let key in books) {
    if( key == isbn ) {
      book = books[key];
      break;
    }
  }

  for (let username in book.reviews) {
    if( username === req.user.username ) {
      book.reviews[username] = review;
      return res.status(200).json({message: "Review updated", review: review});
    }
  }

  book.reviews[req.user.username] = review;
  return res.status(200).json({message: "Review added", review: review});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;

  if(!isbn) {
    return res.status(400).json({message: "ISBN is required"});
  }

  let book;

  for (let key in books) {
    if( key == isbn ) {
      book = books[key];
      break;
    }
  }

  for (let username in book.reviews) {
    if( username === req.user.username ) {
      delete book.reviews[username];
      return res.status(200).json({message: "Review deleted"});
    }
  }

  return res.status(400).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
