import mysql from 'mysql2/promise'
import { URL } from 'url'

const dbUrl = new URL(
  'mysql://root:gaNxHtcsXksCxioUYVuqUZimGFeJAzrN@yamanote.proxy.rlwy.net:50027/railway'
)

export const db = mysql.createPool({
  host: dbUrl.hostname, // 'yamanote.proxy.rlwy.net'
  user: dbUrl.username, // 'root'
  password: dbUrl.password, // 'gaNxHtcsXksCxioUYVuqUZimGFeJAzrN'
  database: dbUrl.pathname.slice(1), // 'railway'
  port: dbUrl.port, // '50027'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10
})

// export const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   port: 3306,
//   password: '',
//   database: 'plantsmanagerdb',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 10
// })
