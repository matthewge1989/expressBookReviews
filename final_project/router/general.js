const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    };}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});}
        }
        
    return res.status(404).json({message: "Unable to register user."});
});

let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const successMessage = "Book(s) successfully fetched!";
        const errorMessage = "Could not fetch book(s)";
        const isSuccess = true;
        if (isSuccess) {
            resolve(successMessage);
        } else {
            reject(errorMessage);
        }
    },3000)})


// Get the book list available in the shop
public_users.get('/',function (req, res) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            res.send(JSON.stringify({books}, null, 4));
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            res.status(500).send('Unable to fetch books at this time');
        })
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  if (filtered_book) {
    myPromise.then((successMessage) => {
        console.log('From Callback: ' + successMessage);
        return res.status(200).json(filtered_book);
    })
    .catch((errorMessage) => {
        console.error('Error: '+ errorMessage);
        return res.status(500).json({message: "Error finding book"});
    });}
    else{
        return res.status(404).json({ message: "No books found with this ISBN" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_book = Object.values(books).filter((book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase());
    if (filtered_book.length > 0) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            return res.status(200).json(filtered_book);
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            return res.status(500).json({message: "Error finding book"});
        });}
    else{
        return res.status(404).json({message: "No book found"})};
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_book = Object.values(books).filter((book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase());
    if (filtered_book.length > 0) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            return res.status(200).json(filtered_book);
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            return res.status(500).json({message: "Error finding book"});
        });}
    else{
        return res.status(404).json({message: "No book found"})};
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_book = books[isbn];
    if (filtered_book) {
        let reviews = filtered_book.reviews;
        if (Object.keys(reviews).length > 0){
            return res.status(200).json(reviews);
        }else{
            return res.status(404).json({ message: "No Reviews found with this ISBN" })};
    }else{
        return res.status(404).json({ message: "Input correct ISBN" });
  };
});

module.exports.general = public_users;
