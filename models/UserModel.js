const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password should be atleast 6 characters long"]
  }
});

UserSchema.pre("save", async function(next) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.staticLogin = async function(email, password) {
  const user = await this.findOne({ email });

  if (user) {
    // console.log("USER", user,"password: ", password, "user.password:", user.password)
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("incorrect password");
  }
  throw new Error("incorrect email");
};

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
