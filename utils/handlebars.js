exports.isActivePage = (currentPage, activePage) =>
  currentPage === activePage ? "active" : "";

exports.returnIfTrue = (condition, returnValue) =>
  condition ? returnValue : "";

exports.returnIfNotTrue = (condition, returnValue) =>
  !condition ? returnValue : "";

exports.getDisplayNameFrom = (user) =>
  user ? user.fullname.split(" ")[0] : "";
exports.getWalletBalanceFrom = (user) => (user ? user.wallet : 0);
exports.getFullNameFrom = (user) => (user ? user.fullname : "");
exports.getMobileFrom = (user) => (user ? user.phone : "");
exports.getEmailFrom = (user) => (user ? user.email : "");

exports.getAmountByRate = (amount, rate) => amount * rate;

exports.getTransactions = (type, transactions) =>
  transactions.filter((trx) => trx.type === type || type === "all");

exports.getMeterType = (type) => (type === "01" ? "PrePaid" : "PostPaid");

// transaction handles
exports.getTransactionValue = (trx, value) => {
  if (value === "date") {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    const d = new Date(trx.date);
    return `${days[d.getDay()]} ${
      months[d.getMonth()]
    } ${d.getDate()} ${d.getFullYear()}`;
  }
  return trx[value];
};

exports.statusIsOk = (status = "NOT_OK") => status === "OK";
