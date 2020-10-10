const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const port = 3000;
const secret = "mySecretKey";

// api to simply check whether the api service is working
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome! API service running on http://localhost:3000",
  });
});

// to mock the user login and generate a token using jwt
app.post("/api/login", (req, res) => {
  const user = {
    id: 1000,
    username: "hariprasadsh",
    mailid: "hari.prasad.sh@gmail.com",
  };

  jwt.sign(user, secret, (err, token) => {
    if (err) {
      res.sendStatus(403);
    }
    res.json({
      token,
    });
  });
});

// a protected post api
app.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

// Format of the token
// Bearer <access_token>

// a middleware function to verify if the token is present with the request header
function verifyToken(req, res, next) {
  // get the auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // split the token
    const bearer = bearerHeader.split(" ");

    // get the token part
    const bearerToken = bearer[1];

    // set the req
    req.token = bearerToken;

    // middleware next
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(port, () => console.log("Server listening to port: ", port));
