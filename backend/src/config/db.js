import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  dateStrings: false,
});

pool.on('connection', (connection) => {});

pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
  }
});

process.on('SIGTERM', () => {
  pool.end((err) => {
    process.exit(0);
  });
});

export default pool.promise();