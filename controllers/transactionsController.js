const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const crypto = require("./../utils/crypto");
const {
  getElectricCompany,
  getAirtimeProductList,
  makeAirtimePurchase,
  makeDataPurchase,
  getDataProductList,
  getDataValue,
  getCablePlansFor,
  makeCablePurchase,
  makeElectricPayment,
} = require("./../utils/transactionApi");
const factory = require("./../factory/DBFactory");

const Transactions = require("./../models/TransactionModel");
const cables = require("../constants/cables");

exports.get = factory.getAll(Transactions);

exports.getMobileNetwork = catchAsync(async (req, res, next) => {
  if (!req.query.mobile)
    return next(new AppError("Mobile Number Not Provided."));
  const { info, products } = await getAirtimeProductList(req.query.mobile);

  res.status(201).json({
    status: "success",
    data: {
      operator: info.operator,
      min: products[0].min,
      max: products[0].max,
      rate: products[0].rate,
    },
  });
});

exports.getAvailablePlans = catchAsync(async (req, res, next) => {
  if (!req.query.mobile)
    return next(new AppError("Mobile Number Not Provided."));

  const { info, products } = await getDataProductList(req.query.mobile);
  res.status(201).json({
    status: "success",
    data: {
      operator: info.operator,
      plans: products,
    },
  });
});

exports.getAvailableCables = (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: cables,
  });
};

exports.getCablePlans = catchAsync(async (req, res, next) => {
  const { cable, number } = req.query;
  if (!cable || !number) return next(new AppError("Invalid Inputs"));

  const data = await getCablePlansFor(cable, number);
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.getAvailableElectricity = catchAsync(async (req, res, next) => {
  const data = await getElectricCompany();
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.buyAirtime = catchAsync(async (req, res, next) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) return next(new AppError("Invalid Inputs"));

  const ref = crypto.genRandomId();
  let hash = crypto.generateHash();

  const { info, products } = await getAirtimeProductList(phone, hash);

  hash = crypto.generateHash(ref);
  const {
    response,
    transaction_id,
    amount: airtime_amount,
    amount_charged,
  } = await makeAirtimePurchase(products[0].id, phone, amount, ref, hash);

  const transaction = await Transactions.create({
    userId: req.user.id,
    transactionId: transaction_id,
    status: response,
    type: "airtime",
    trx_detail: {
      mobileNetwork: info,
      mobileNumber: phone,
    },
    orderType: `${amount} Airtime Purchase`,
    amount: airtime_amount,
    amountCharged: amount_charged,
    walletBalance: (req.user.wallet || 0) - airtime_amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.buyData = catchAsync(async (req, res, next) => {
  const { phone, plan } = req.body;

  if (!phone || !plan) {
    return next(new AppError("Invalid Inputs"));
  }

  const ref = crypto.genRandomId();
  let hash = crypto.generateHash();

  const { products, info } = await getDataProductList(phone, hash);

  const planData = products.find((product) => product.id === plan);
  if (req.user.wallet < planData.price)
    return next(
      new AppError("Insufficient fund. Please fund account and try again.")
    );

  hash = crypto.generateHash(ref);
  const {
    response,
    transaction_id,
    data_amount,
    amount,
    amount_charged,
  } = await makeDataPurchase(plan, phone, ref, hash);

  const transaction = await Transactions.create({
    userId: req.user.id,
    transactionId: transaction_id,
    status: response,
    type: "data_bundle",
    trx_detail: {
      mobileNetwork: info,
      mobileNumber: phone,
      plan: planData,
    },
    orderType: `${getDataValue(data_amount)} Data Purchase`,
    amount: amount,
    amountCharged: amount_charged,
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.transferFund = catchAsync(async (req, res, next) => {
  const { amount, to } = req.body;
  if (!to) return next(new AppError("Please specify a receiver", 400));
  if (!amount) return next(new AppError("Please specify an amount", 400));

  const { _id: id, fullname, phone } = await req.user.transferFund(amount, to);

  const transaction = await Transactions.create({
    userId: req.user.id,
    transactionId: crypto.genRandomId(),
    status: "ORDER_COMPLETED",
    type: "transfer_fund",
    trx_detail: {
      user: { id, fullname, phone },
    },
    orderType: `${amount} Fund Transfer`,
    amount: amount,
    amountCharged: amount,
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.cableTV = catchAsync(async (req, res, next) => {
  const { cable, plan, number } = req.body;

  if (!cable || !plan || !number) {
    return next(new AppError("Invalid Inputs!"));
  }

  const {
    response,
    transaction_id,
    discounted_amount,
  } = await makeCablePurchase(cable, plan, number);

  const transaction = await Transactions.create({
    userId: req.user.id,
    transactionId: transaction_id,
    status: response,
    type: "cable",
    trx_detail: {
      cable,
      plan,
      number,
    },
    orderType: `${getDataValue(data_amount)} Data Purchase`,
    amount: discounted_amount,
    amountCharged: discounted_amount,
    walletBalance: (req.user.wallet || 0) - discounted_amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.electricBill = catchAsync(async (req, res, next) => {
  const { product, amount, number, prepaid } = req.body;

  if (!product || !amount || !number || !prepaid) {
    return next(new AppError("Invalid Inputs!"));
  }

  const {
    response,
    transaction_id,
    discounted_amount,
    pins,
  } = await makeElectricPayment(product, amount, number, prepaid);

  const transaction = await Transactions.create({
    userId: req.user.id,
    transactionId: transaction_id,
    status: response,
    type: "electricity",
    trx_detail: {
      ...req.body,
      pins,
    },
    orderType: `${amount} Data Purchase`,
    amount: amount,
    amountCharged: discounted_amount,
    walletBalance: (req.user.wallet || 0) - amount,
  });

  res.status(201).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.hasSufficientFund = (req, res, next) => {
  if (req.body.amount && !(req.user.wallet >= req.body.amount))
    return next(
      new AppError("Insufficient fund. Please fund account and try again.")
    );
  next();
};

exports.aliasUserHistory = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};

exports.aliasUserHistoryById = (req, res, next) => {
  console.log(req.params.id);
  req.query.user = req.params.id;
  next();
};
