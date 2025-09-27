const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
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
  return res.status(200).send(JSON.stringify(books , null ,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const allBooks = Object.values(books);
  const result = allBooks.filter(book => book.author.toLowerCase() === authorName.toLowerCase());

  if (result.length > 0) {
      return res.status(200).json(result);
  } else {
      return res.status(404).json({ message: `No books found by author ${authorName}.` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  const allBooks = Object.values(books);
  const result = allBooks.filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());

  if (result.length > 0) {
      return res.status(200).json(result);
  } else {
      return res.status(404).json({ message: `No books found with title "${bookTitle}".` });
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn.trim(); 
  let book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book with ISBN " + isbn + " not found." });
  }
});

// -------------------
// 🔥 Task 10: Using Axios (Promises & Async/Await)
// -------------------

// Using Promises
function getBooksPromise() {
  axios.get("https://suvan2231163-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/")
    .then(response => {
      console.log("Books retrieved using Promises:");
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching books with Promises:", error.message);
    });
}

// Using Async/Await
async function getBooksAsync() {
  try {
    const response = await axios.get("https://suvan2231163-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    console.log("Books retrieved using Async/Await:");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching books with Async/Await:", error.message);
  }
}

// Call both functions for testing
getBooksPromise();
getBooksAsync();

module.exports.general = public_users;
