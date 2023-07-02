const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 9002;

//connect to mysql database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'book'
})

//check if the connection is established
db.connect((err)=>{
    if(err){
        console.log(err)
    }
    console.log("connected to mysql database");
})

app.get('/', (req, res) =>{res.json("welcome to nak backend on the mix")})

//creating middleware for sending requests to the server

app.use(express.json());
app.use(cors());

//create a book endpoint

app.get('/books', (req, res) =>{
    const q = "SELECT * FROM books";
    db.query(q, (err,data) => {
        if(err){
            return res.status(err);
        }
        return res.json(data);
    })
})

// get a single book
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;

    const q = `SELECT *FROM books WHERE id = ${bookId}`;
    db.query(q, (err,data) => {
        if(err){
            return res.status(err);
        }
        return res.json(data);
    })
    
    // Query the database to retrieve the book detail using the bookId
    // ...
    // Send the book detail as a response
  });


//create a new book
app.post('/books', (req, res) => {
    const q = "INSERT INTO books(`booktitle`,`quantity`,`category`)VALUES(?)";
    const value =[
        req.body.title,
        req.body.description,
        req.body.category,
    ]
    db.query(q,[value],(err, data) => {
        if (err) return res.status(err);
        return res.json("Book has been created sucessfully");
    })
})

app.delete("/books/:id", (req, res) =>{
    const bookId = req.params.id;
    const q = "DELETE FROM books where id = ?";
    db.query(q,[bookId],(err, data) => {
        if (err) return res.json(err);
        return res.json("Book has been deleted sucessfully");
    })
})

app.put("/books/:id", (req, res) =>{
    const bookId = req.params.id;
    const q = "UPDATE books SET `booktitle` = ?, `quantity` = ?, `category` = ?  WHERE id = ?"
    const values = [
        req.body.title,
        req.body.description,
        req.body.category,
    ]
    db.query(q,[...values,bookId],(err,data) => {
        if (err) return res.json(err);
        return res.json("Book has been updated");
    })
})

app.listen(port,()=>{
    console.log("listening on port " + port);
});