const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const a = users.filter((user) => {
    return user.username === req.body.username;
  });
  if (a.length === 0) {
    if (req.body.username && req.body.password) {
      users.push({
        username: req.body.username,
        password: req.body.password,
      });
      return res.status(201).json({ message: "registered successfully" });
    }
    return res.status(400).json({ message: "ERROR" });
  }
  return res.status(400).json({ message: "ERROR: already exist" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  //Write your code here
  const getAllBook = new Promise((resolve, rej) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  return getAllBook.then(() => {
    res.status(201).send(JSON.stringify(books, null, 4));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const getBookIsbn = new Promise((resolve, rej) => {
    if (books[req.params.isbn]) {
      resolve(
        res.status(300).send(JSON.stringify(books[req.params.isbn], null, 4))
      );
    }
    res.status(400).send("No matching found");
  });
  // return res.status(300).send(JSON.stringify(books[req.params.isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  new Promise((resolve, rej) => {
    let x = { booksbyauthor: [] };
    for (let a in books) {
      if (books[a].author === req.params.author) {
        x.booksbyauthor.push({
          isbn: a,
          title: books[a].title,
          review: books[a].review ? books[a].review : {},
        });
      }
    }
    if (x.booksbyauthor.length > 0) {
      resolve(res.status(200).send(JSON.stringify(x, null, 4)));
    }
    res.status(400).send("No matching found");
  });

  // return res.status(200).send(JSON.stringify(x, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  new Promise((resolve, rej) => {
    let x = { booksbytitle: [] };
    for (let a in books) {
      if (books[a].title === req.params.title) {
        x.booksbytitle.push({
          isbn: a,
          author: books[a].author,
          review: books[a].review ? books[a].review : {},
        });
      }
    }
    if (x.booksbytitle.length > 0) {
      resolve(res.status(200).send(JSON.stringify(x, null, 4)));
    }
    res.status(400).send("No matching found");
  });

  // return res.status(200).send(JSON.stringify(x, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res
    .status(300)
    .send(
      JSON.stringify(
        books[req.params.isbn].review ? books[req.params.isbn].review : {},
        null,
        4
      )
    );
});

module.exports.general = public_users;
