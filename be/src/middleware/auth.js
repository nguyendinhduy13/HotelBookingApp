const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.auth = decoded;
  } catch (err) {
    if (err.message == "jwt expired") {
      return res.status(401).send("Token expired");
    }
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyTokenAdmin = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.auth = decoded;
    if (decoded.role != "admin") {
      return res.status(403).send("You are not admin");
    }
  } catch (err) {
    if (err.message == "jwt expired") {
      return res.status(401).send("Token expired");
    }
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
