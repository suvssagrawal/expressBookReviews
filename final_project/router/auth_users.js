const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // User is valid → generate JWT
  const token = jwt.sign({ username: username }, "access", { expiresIn: "1h" });

  // Save token in session
  req.session.authorization = {
    accessToken: token
  }

  return res.status(200).json({ message: "User logged in successfully", token: token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn.trim();  // Get ISBN from URL
    const review = req.query.review;      // Get review from query parameters
  
    // Validate
    if (!review) {
      return res.status(400).json({ message: "Review is required as a query parameter" });
    }
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    // Get logged-in username from session
    const username = req.user.username;
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: `Review added/updated for ISBN ${isbn} by user ${username}`,
      reviews: books[isbn].reviews
    });
  });
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn.trim();   // Get ISBN
    const username = req.user.username;    // Logged-in user from JWT session
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    // Check if the user has a review for this book
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username]; // Delete only this user's review
      return res.status(200).json({
        message: `Review deleted for ISBN ${isbn} by user ${username}`,
        reviews: books[isbn].reviews
      });
    } else {
      return res.status(404).json({ message: `No review found for user ${username} on ISBN ${isbn}` });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
