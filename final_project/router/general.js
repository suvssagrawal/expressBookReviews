const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).send(JSON.stringify(books , null ,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    // Check if the book exists in the books database
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author; // Get author from URL
    const allBooks = Object.values(books); // Get all book objects
    const result = allBooks.filter(book => book.author.toLowerCase() === authorName.toLowerCase());

    if (result.length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: `No books found by author ${authorName}.` });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookTitle = req.params.title; // Get title from URL
    const allBooks = Object.values(books); // Get all book objects
    const result = allBooks.filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());

    if (result.length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: `No books found with title "${bookTitle}".` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn.trim();   // 🔥 removes any extra \n or spaces
  let book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book with ISBN " + isbn + " not found." });
  }
});

module.exports.general = public_users;
