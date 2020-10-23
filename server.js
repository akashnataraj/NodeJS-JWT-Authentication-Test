const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const path = require("path");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");

const Port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:" + Port);
  res.setHeader("Access-Control-Allow-Origin", "Content-type,Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "My super secret key";
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "akash",
    password: "akash123",
  },
  {
    id: 2,
    username: "roger",
    password: "roger123",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    }
  }

  res.status(401).json({
    success: false,
    token: null,
    err: "Username or password incorrect",
  });
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see!!!!!.",
  });
});

app.get("/api/prices", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "This is prices page - $100.",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "This is app settings.",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password incorrect 2",
    });
  } else {
    next(err);
  }
});

app.listen(Port, () => {
  console.log(`Serving on port ${Port}`);
});
