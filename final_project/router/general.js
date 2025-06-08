const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if user already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }
  // Add new user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (Promise)
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ message: "No books found" });
    }
  })
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on ISBN (Promise)
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json(err));
});
  
// Get book details based on author (Promise)
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  new Promise((resolve, reject) => {
    let result = [];
    for (let key in books) {
      if (books[key].author === author) {
        result.push(books[key]);
      }
    }
    if (result.length > 0) {
      resolve(result);
    } else {
      reject({ message: "No books found for this author" });
    }
  })
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on title (Promise)
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  new Promise((resolve, reject) => {
    let result = [];
    for (let key in books) {
      if (books[key].title === title) {
        result.push(books[key]);
      }
    }
    if (result.length > 0) {
      resolve(result);
    } else {
      reject({ message: "No books found with this title" });
    }
  })
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
