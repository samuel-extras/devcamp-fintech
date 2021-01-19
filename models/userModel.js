const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide your fullname!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    minlength: 8,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
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
  referrer: {
    type: String,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: Date,
  status: {
    type: String,
    enum: ["active", "suspended", "deactivated"],
    default: "active",
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

/**
 * This hooks run if password was modified
 * Hashes password using the `bcrypt` module with cost of 12
 * Then deletes passwordConfirm feild
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

/**
 * This hooks updates the password changes at
 * Whenever the user updates their password
 * NOTE: this hook strictly only fires when user password changes
 */
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * This hooks check if user was referred
 * TODO: Do something if user was referred
 */ 
userSchema.pre("save", async function (next) {
  if (this.referral) {
    try {
      const user = await this.constructor.find({
        username: this.referral,
      });

      if (!user.length) throw new Error("Invalid referrer ID");

      //HERE: Todo 1
      next();
    } catch (e) {
      throw e;
    }
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  /**
   * Hide all deactivated user when fetching users
   * Grant admin privileges to access deactivated users
   */
  const query = this.getQuery();
  if (query["roleIs"] !== "admin") {
    this.find({
      $and: [{ status: { $ne: "deactivated" } }],
    });
  }

  if (query["roleIs"]) delete query["roleIs"];
  this.setQuery(query);
  next();
});

/**
 * Use this method to activate a user,
 * either the user had been previously suspended or deactivated.
 */
userSchema.methods.activate = async function () {
  this.status = "active";
  return await this.save({ validateBeforeSave: false });
};

/**
 * Use this method to check if user password is correct.
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Use this method to check if a user has changed their password,
 * after a particular time.
 */
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

/**
 * Use this method to create password reset token for a user.
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.creditWallet = async function (amount) {
  this.wallet = Number(this.wallet || 0) + Number(amount);
  return await this.save({ validateBeforeSave: false });
};

userSchema.methods.debitWallet = async function (amount) {
  this.wallet = Number(this.wallet || 0) - amount;
  return await this.save({ validateBeforeSave: false });
};

userSchema.methods.transferFund = async function (amount, to) {
  // transfer the money to receiver
  const receiver = await this.constructor.findByMobile(to);
  await receiver.creditWallet(amount);

  // if successful deduct money from user wallet
  await this.debitWallet(amount);
  return receiver;
};

userSchema.statics.findByMobile = async function (phone) {
  return this.findOne({ phone });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
