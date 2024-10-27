const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // hide password
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/*//////////////////// */
/*Password Hashing */
/*//////////////////// */

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

/*//////////////////// */
/*Password Changed Timestamp*/
/*//////////////////// */
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/*//////////////////// */
//Query Middleware
/*It ensures that only active users are retrieved by default. */
/*//////////////////// */
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/*//////////////////// */
/*Correct Password */
/*
This method compares a candidate password (user input) 
with the stored hashed password (userPassword) using bcrypt.compare. 
If they match, it returns true.
*/
/*//////////////////// */

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/*//////////////////// */
/*Password Changed After*/
/*
This method checks if the user changed their password 
after the token (JWT) was issued. It compares the password's 
last change timestamp with the JWT's timestamp.
*/
/*/ /////////////////// */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

/*//////////////////// */
/*Create Password Reset Token */

/*
= This method creates a reset token for password recovery.
= A random token is generated using crypto.randomBytes(32) and converted to a hexadecimal string.
= This token is then hashed using SHA-256 and stored as passwordResetToken in the database.
= The token expiration time (passwordResetExpires) is set to 10 minutes from the current time.
= The plain reset token (not the hashed one) is returned, so it can be sent to the user via email or other means.
NOTE: NEVER STORE IN THE DATABASE
*/
/*//////////////////// */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

/*//////////////////// */
/*Create Password Reset Token*/
/*//////////////////// */
const User = mongoose.model("User", userSchema);
module.exports = User;
