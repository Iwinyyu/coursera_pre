const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return username ? true : false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  if (isValid(username)) {
    const match = users.filter((user) => {
      return username === user.username && password === user.password;
    });
    console.log(match);
    return match.length > 0;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  if (authenticatedUser(req.body.username, req.body.password)) {
    let accessToken = jwt.sign({ data: req.body.password }, "access", {
      expiresIn: 60 * 60,
    });
    let userName = req.body.username;
    req.session.authorization = {
      accessToken,
      userName,
    };
  }

  return res.status(201).send("you have logged in");
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  books[req.params.isbn].reviews = req.query.review
  return res.status(200).send(`the review for the ISBN ${req.params.isbn} has been added/uodated.`);
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  books[req.params.isbn].reviews = ""
  return res.status(200).send(`the review for the ISBN ${req.params.isbn} has been deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
