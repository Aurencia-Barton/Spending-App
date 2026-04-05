// Load the libraries we need.
// - express: makes it easy to handle web requests.
// - cors: lets the frontend (running on a different address) talk to this server.
const express = require('express');
const cors = require('cors');

// Make the app and pick a port number to listen on
const app = express();
const PORT = 3000;

// Setup helpers:
// - Allow other sites/apps to make requests to this server (CORS).
// - Automatically turn JSON request bodies into JavaScript objects (req.body).
app.use(cors());
app.use(express.json());

// A simple, in-memory list of expenses for development/testing.
// This is not a database — it will reset whenever the server restarts.
let expenses = [
  { amount: 75, category: 'Celina Water' },
  { amount: 100, category: 'GCEC' }
];

// Simple root route: lets us check the server is running by opening /
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Return the list of expenses as JSON when someone requests /expenses
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

// Add a new expense sent by the client to /expenses (expects JSON body)
app.post('/expenses', (req, res) => {
  // Get the amount and category fields out of the request body
  const { amount, category } = req.body;

  // Simple check: both fields must be present
  if (amount === undefined || !category) {
    // Tell the caller they sent bad data
    return res.status(400).json({ error: 'Amount and category are required' });
  }

  // Create a new expense object and make sure amount is stored as a number
  const newExpense = {
    amount: Number(amount),
    category
  };

  // Save it in the in-memory list and return the saved item
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Start the server and print where to reach it
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
