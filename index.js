const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Beispiel-Datenbank als JavaScript-Array
let books = [
  { id: 1, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

app.use(bodyParser.json());

// API-Endpunkt zum Abrufen aller Bücher
app.get('/books', (req, res) => {
  res.json(books);
});

// API-Endpunkt zum Abrufen eines einzelnen Buches anhand der ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(book => book.id === bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// API-Endpunkt zum Hinzufügen eines neuen Buches
app.post('/books', (req, res) => {
  const { id, title, author } = req.body;
  const newBook = { id, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// API-Endpunkt zum Aktualisieren eines Buches anhand der ID
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  books = books.map(book => (book.id === bookId ? updatedBook : book));
  res.json(updatedBook);
});

// API-Endpunkt zum Löschen eines Buches anhand der ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter(book => book.id !== bookId);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
