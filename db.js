const { Pool, Client } = require('pg')

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432
})
db.connect()

db.query('SELECT NOW()')
.then(() => {
  console.log('db.js -> Connected to db');
})
.catch(()=> {
  console.error('db.js -> Cant connect to db');
})

module.exports = db;