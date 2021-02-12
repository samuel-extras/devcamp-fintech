const crypto = require("./../utils/crypto");
const tabIntros = require("./../constants/tabIntro");
const cables = require("../constants/cables");
const catchAsync = require("../utils/catchAsync");
const Transaction = require("../models/TransactionModel");
const { getElectricCompany } = require("../utils/transactionApi");

exports.home = (req, res, next) => {
  res.render("pages");
};

exports.airtime = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/home", {
    page,
    title: "Buy Airtime",
    tabContent: tabIntros[page],
  });
};

exports.dataBundle = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/data-bundle", {
    page,
    title: "Buy Data Bundle",
    tabContent: tabIntros[page],
  });
};

exports.fundWallet = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/fund-wallet", {
    page,
    title: "Fund Wallet",
    tabContent: tabIntros[page],
    key: "pk_test_e8eae984c164ece18df37a86319a29918b5e7dec",
    ref: crypto.genRandomId(),
  });
};

exports.transferFund = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/transferFund", {
    page,
    title: "Transfer Fund",
    tabContent: tabIntros[page],
  });
};

exports.cableTv = (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  res.render("pages/cableTv", {
    page,
    title: "Cable Tv",
    tabContent: tabIntros[page],
    cables: cables,
  });
};

exports.electricBill = catchAsync(async (req, res, next) => {
  const page = req.url.slice(1, req.url.length);
  // const providers = await getElectricCompany();
  res.render("pages/electricBill", {
    page,
    title: "Electricity Bill",
    tabContent: tabIntros[page],
    providers: [
      {
        product_id: "BPE-NGEK-OR",
        name: "Eko PHCN",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "1000",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGIE-OR",
        name: "Ikeja Electric",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "500",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGIB-OR",
        name: "Ibadan Distribution",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "1000",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGEN-OR",
        name: "Enugu Distribution",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "1000",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCABIA-OR",
        name: "Port Harcourt Prepaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "1000",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCABIB-OR",
        name: "Port Harcourt Postpaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "1000",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCAAVB-OR",
        name: "Kano Prepaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCAAVC-OR",
        name: "Kano Postpaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCABABA-OR",
        name: "Abuja Prepaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGCABABB-OR",
        name: "Abuja Postpaid",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGKD-OR",
        name: "Kaduna",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
      {
        product_id: "BPE-NGJO-OR",
        name: "JOS",
        hasProductList: false,
        hasValidation: true,
        openRange: true,
        min_denomination: "100",
        max_denomination: "1000000",
        step: 100,
      },
    ],
  });
});

exports.auth = (req, res, next) => {
  res.render("pages/loginAndSignUp", {
    title: "Login / Sign Up",
  });
};

exports.profile = (req, res, next) => {
  res.render("pages/profile", {
    title: "My Profile",
  });
};

exports.changePassword = (req, res, next) => {
  res.render("pages/changePassword", {
    title: "Change Password",
  });
};

exports.history = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find();
  res.render("pages/history", {
    title: "Transaction History",
    noSideDetail: true,
    transactions,
  });
});

exports.about = (req, res, next) => {
  res.render("pages/about", {
    title: "About wootlab Devcamp",
  });
};

exports.contact = (req, res, next) => {
  res.render("pages/contact", {
    title: "Contact Us",
  });
};

exports.faq = (req, res, next) => {
  res.render("pages/faq", {
    title: "FAQ",
  });
};

exports.support = (req, res, next) => {
  res.render("pages/support", {
    title: "Support",
  });
};

exports.airtimeSummary = (req, res, next) => {
  res.render("pages/summary/airtime", {
    title: "Airtime",
  });
};

exports.dataSummary = (req, res, next) => {
  res.render("pages/summary/data", {
    title: "Data Bundle",
  });
};

exports.transferSummary = (req, res, next) => {
  res.render("pages/summary/transfer", {
    title: "Fund Transfer",
  });
};

exports.cableSummary = (req, res, next) => {
  res.render("pages/summary/cable", {
    title: "Cable Subscription",
  });
};

exports.electricSummary = (req, res, next) => {
  res.render("pages/summary/electric", {
    title: "Electricity Bill Payment",
  });
};

exports.useNoLayout = (req, res, next) => {
  res.locals.layout = undefined;
  next();
};

exports.usePagesLayout = (req, res, next) => {
  res.locals.layout = "pages";
  res.locals.page = req.url.slice(1, req.url.length);
  next();
};

exports.useProfileLayout = (req, res, next) => {
  res.locals.layout = "profile";
  res.locals.page = req.url.slice(1, req.url.length);
  next();
};

exports.useSummaryLayout = (req, res, next) => {
  res.locals.layout = "summary";
  res.locals.page = req.url.slice(1, req.url.length);
  res.locals = { ...res.locals, ...req.query };
  next();
};
