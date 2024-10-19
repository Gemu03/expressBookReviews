const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario o contraseña faltantes" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Usuario ya existe" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Obtener la lista de libros (Tarea 1 con async/await)
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener libros" });
  }
});

// Obtener detalles de libro por ISBN (Tarea 2 con async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener detalles del libro" });
  }
});

// Obtener detalles por autor (Tarea 3 con async/await)
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No se encontraron libros del autor" });
  }
});

// Obtener detalles por título (Tarea 4 con async/await)
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No se encontraron libros con ese título" });
  }
});

// Obtener reseñas de libro por ISBN (Tarea 5 con async/await)
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

module.exports.general = public_users;
