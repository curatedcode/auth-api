const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
};

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Auth-API" });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
    if(err){
      return res.status(403).json({ message: err.message });
    }
    res.json({
      message: "Post created",
      authData
    });
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    name: "Tester",
    email: "tester@example.com",
  };

  jwt.sign({ user: user }, process.env.JWT_SECRET_KEY, { expiresIn: '30s'}, (err, token) => {
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ message: "No access token provided" });
  }
}

app.listen(3000, () => console.log("Server started on port 3000"));
