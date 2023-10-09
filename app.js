const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
  host: '34.173.192.47',
  user: 'root',
  password: 'asdf',
  database: 'login'
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images)
app.use(express.static(__dirname + '/public'));

// Use EJS for rendering views
app.set('view engine', 'ejs');

// Define routes

// Home page (Login)
app.get('/', (req, res) => {
  res.render('login');
});

// Login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM user WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (results.length === 1) {
        res.render('welcome', { username });
      } else {
        res.render('login', { error: 'Invalid username or password' });
      }
    }
  );
});

// Function to generate a random user ID (e.g., using a simple random number)
function generateUserId() {
  return Math.floor(Math.random() * 1000000); // Adjust the range as needed
}


// Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Registration POST request
app.post('/register', (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  // Validate fields (add more validation as needed)
  if (!username || !email || !password || !first_name || !last_name) {
    return res.render('register', { error: 'All fields are required' });
  }

  db.query(
    'INSERT INTO user (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, first_name, last_name],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('login', { message: 'Registration successful. Please login.' });
    }
  );
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
