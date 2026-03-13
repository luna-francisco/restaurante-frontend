const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()

const parseCorsOrigins = (value) => {
  if (!value) return null
  const list = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return list.length ? list : null
}

const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGIN)
app.use(
  cors({
    origin: corsOrigins || '*',
  })
)

const port = process.env.PORT || 3000
let db

// Function to establish a connection with retries
function connectWithRetry() {
  db = mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  })

  // Attempt to connect
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err)
      // Retry after 5 seconds
      console.log('Retrying in 5 seconds...')
      setTimeout(connectWithRetry, 5000)
    } else {
      console.log('Connected to MySQL database')
    }
  })
}

// Start the connection with retries
connectWithRetry()

// Define your endpoints

// Get all categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Get all restaurants
app.get('/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurantes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get a single restaurant by ID
app.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id
  db.query(
    'SELECT * FROM restaurantes WHERE restauranteID = ? LIMIT 1',
    [restaurantId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else if (!results.length) {
        res.status(404).json({ error: 'Restaurant not found' })
      } else {
        res.json(results[0])
      }
    }
  )
})

// Get all dishes
app.get('/dishes', (req, res) => {
  db.query('SELECT * FROM platos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all orders
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all dishes for a specific order
app.get('/order/:orderId/dishes', (req, res) => {
  const orderId = req.params.orderId
  db.query(
    'SELECT pl.platoID, pl.plato, pl.descripcion, pl.precio, pp.cantidad FROM platospedidos pp JOIN platos pl ON pp.platoID = pl.platoID WHERE pp.pedidoID = ?',
    [orderId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.json(results)
      }
    }
  )
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
