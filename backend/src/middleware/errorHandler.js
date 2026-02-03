// src/middleware/errorHandler.js
export default (err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:');
  console.error('Path:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};