const User = require("./../models/userModel");
const Transaction = require("../models/TransactionModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./../factory/DBFactory");
const payStack = require("../paystack");

// TODO: normalize the response format -> turn it all to { data :data}
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "fullname", "email", "phone");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { status: "deactivated" });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// NOTE: Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.activateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).where({ roleIs: "admin" });

  if (!user) return next(new AppError("No User Found With This ID", 400));
  await user.activate();

  res.status(201).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.updateStatus = (status) => (req, res, next) => {
  req.body.status = status;
  next();
};

exports.fundWallet = catchAsync(async (req, res, next) => {
  const ref = req.body.ref;
  const trxVerified = await Transaction.findOne({ ref });

  if (trxVerified) return next(new AppError("Payment Already Verified.", 400));

  payStack(process.env.PAYSTACK_SEC_KEY).transaction.verify(
    ref,
    async (error, body) => {
      if (error) return next(new AppError(error.message, 500));

      const { id, amount, status } = body.data;

      if (!body.data || status !== "success")
        return next(
          new AppError(
            "Payment Failed! Kindly contact our customer care if you have any complain.",
            500
          )
        );

      const transaction = await Transaction.create({
        ref,
        userId: req.user.id,
        transactionId: id,
        status: status,
        type: "fund_wallet",
        orderType: `${amount} Fund Deposit`,
        amount: amount,
        amountCharged: amount + (body.fees || 0),
        walletBalance: (req.user.wallet || 0) - amount,
      });

      req.user.creditWallet(amount);

      res.status(201).json({
        status: "success",
        data: {
          transaction,
        },
      });
    }
  );
});

exports.stats = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(201).json({
    status: "success",
    data: {
      count: users.length,
    },
  });
});
