const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Verificar si el nombre de usuario es válido
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Verificar si el nombre de usuario y la contraseña coinciden
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

// Solo los usuarios registrados pueden iniciar sesión
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario o contraseña faltantes" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  let token = jwt.sign({ username }, 'access_token_secret', { expiresIn: '1h' });
  return res.status(200).json({ message: "Inicio de sesión exitoso", token });
});

// Agregar o modificar una reseña de un libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const username = req.session.username;

  if (!review) {
    return res.status(400).json({ message: "Reseña faltante" });
  }

  if (!books[req.params.isbn]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  if (!books[req.params.isbn].reviews[username]) {
    books[req.params.isbn].reviews[username] = review;
  } else {
    books[req.params.isbn].reviews[username] = review; // Modifica la reseña
  }

  return res.status(200).json({ message: "Reseña agregada/modificada exitosamente" });
});

// Eliminar reseña de un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;

  if (!books[req.params.isbn]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  if (books[req.params.isbn].reviews[username]) {
    delete books[req.params.isbn].reviews[username];
    return res.status(200).json({ message: "Reseña eliminada" });
  } else {
    return res.status(404).json({ message: "Reseña no encontrada" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
