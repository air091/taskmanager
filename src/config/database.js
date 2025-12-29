import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: 10,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 30000,
});

pool
  .query("SELECT 1")
  .then(() => console.log("Database connected!"))
  .catch((err) => {
    console.error(`Database connection failed ${err}`);
    process.exit(1);
  });

export default pool;
