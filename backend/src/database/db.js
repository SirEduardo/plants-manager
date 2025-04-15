import pkg from 'pg'
const { Pool } = pkg

const isLocal = process.env.NODE_ENV !== 'production'

const localConnection = 'postgres://postgres@localhost:5432/PlantsManagerDB'
const prodConnection = process.env.DATABASE_URL

export const db = new Pool({
  connectionString: isLocal ? localConnection : prodConnection,
  ssl: isLocal
    ? false
    : {
        rejectUnauthorized: false
      }
})

//import mysql from 'mysql2/promise'
// import { URL } from 'url'
// const dbUrl = new URL(
//   'mysql://root:gaNxHtcsXksCxioUYVuqUZimGFeJAzrN@yamanote.proxy.rlwy.net:50027/railway'
// )

// export const db = mysql.createPool({
//   host: dbUrl.hostname, // 'yamanote.proxy.rlwy.net'
//   user: dbUrl.username, // 'root'
//   password: dbUrl.password, // 'gaNxHtcsXksCxioUYVuqUZimGFeJAzrN'
//   database: dbUrl.pathname.slice(1), // 'railway'
//   port: dbUrl.port, // '50027'
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 10
// })

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
