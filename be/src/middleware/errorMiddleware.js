const errorMiddleware = (err, req, res, next) => {
    // Log the error or perform any other error-related tasks
    console.error(err);
  
    // Format the error response
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: errorMessage });
  };
  
  module.exports = errorMiddleware;
  