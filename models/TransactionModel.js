const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  ref: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "airtime",
      "data_bundle",
      "transfer_fund",
      "fund_wallet",
      "cable",
      "electricity",
      "recharge_card",
    ],
  },
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: [
      "SUCCESS",
      "OK",
      "ORDER_RECEIVED",
      "ORDER_PROCESSED",
      "ORDER_COMPLETED",
      "ORDER_ERROR",
      "ORDER_ONHOLD",
      "ORDER_CANCELLED",
    ],
  },
  trx_detail: Object,
  orderType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountCharged: {
    type: Number,
    required: true,
  },
  walletBalance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

transactionSchema.pre("save", async function (next) {
  try {
    const user = await mongoose.model("User").findById(this.userId);

    await user.debitWallet(this.amount);

    return next();
  } catch (e) {
    throw e;
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
