const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3: by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = Object.keys(books)
    .filter(key => books[key].author.toLowerCase() === author)
    .map(key => ({ isbn: key, ...books[key] }));
  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = Object.keys(books)
    .filter(key => books[key].title.toLowerCase() === title)
    .map(key => ({ isbn: key, ...books[key] }));
  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

const BASE_URL = "http://localhost:5000";

// Task 10: all books (async-await + Axios)
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12: by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(req.params.author)}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching books by author" });
  }
});

// Task 13: by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;