const initDB = require("./models/MongoConnection");
const authController = require("./controllers/authController");
const requireAuth = require('./middleware/authMiddleware')

const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

initDB();

app.route("/signup-post").post(authController.signup_post);
app.route("/login-post").post(authController.login_post);
app.route("logout-get").get(authController.logout_get);

app.route("/authenticate").get( requireAuth, (_, res)=>{
  res.json({ message: 'User authentication Successful'})
})

app.listen(PORT, err => {
  if (err) {
    console.log(err.message);
  }
  console.log("Server live at", PORT);
});
