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
