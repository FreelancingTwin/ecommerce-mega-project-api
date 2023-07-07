const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const JWT_SECRET = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ redirectTo: "http://localhost:5173/login" });
      } else {
        console.log(decodedToken);
        const user = await UserModel.find({ email: user.email });
        res.status(200).json({ user });
        next();
      }
    });
  } else {
    res.status(401).json({ redirectTo: "http://localhost:5173/login" });
    // next(); 
  }
};

module.exports = requireAuth;
