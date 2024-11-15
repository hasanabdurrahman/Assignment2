// Hasan Abdurrahman
// INJS-KS06-015

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Sumber data
const teachersData = require('./teachers.json');
const usersData = require('./users.json');
const secretKey = 'ass2'; // Ganti dengan secret key yang aman

// Middleware untuk autentikasi token
function authenticateToken(req, res, next) {
  let token = req.header('Authorization');
  token = token.replace('Bearer ','');
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
 

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
        console.log("Invalid token");
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

// API untuk login dan mendapatkan token JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = usersData.find((u) => u.username === username && u.password === password);
  

  if (!user) {
    console.log("Error 401 Invalid credentials Username/Password Salah");
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, secretKey);
  res.status(201).json({ token: token });
  console.log('Success Creating Token');
});

// API untuk mendapatkan semua data guru (memerlukan autentikasi)
app.get('/teachers', authenticateToken, (req, res) => {
  res.json(teachersData);
  console.log("Successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
