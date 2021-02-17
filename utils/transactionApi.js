const axios = require("axios");
const FormData = require("form-data");
const crypto = require("./../utils/crypto");

const axiosForm = async (url, params) => {
  const form = new FormData();
  for (key in params) form.append(key, params[key]);

  const getHeaders = (form) =>
    new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) return reject(err);

        resolve(Object.assign({ "Content-Length": length }, form.getHeaders()));
      });
    });

  try {
    const headers = await getHeaders(form);
    return await axios.post(url, form, { headers: headers });
  } catch (e) {
    throw e;
  }
};

exports.getAirtimeProductList = async (phone) => {
  const hash = crypto.generateHash();
  const res = await axios.post(
    "https://estoresms.com/network_list/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      hash,
      phone,
    })
  );

  if (res.data.response !== "OK")
    throw new Error("Unable to get Airtime Product List");

  return res.data;
};

exports.makeAirtimePurchase = async (productId, phone, amount, ref, hash) => {
  const res = await axios.post(
    "https://estoresms.com/network_processing/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      ref,
      callback: "https://samplewebsite.com/callback", // FIXME: change call back to changePurchaseStatus,
      hash,
      request: [
        {
          product: productId,
          phone,
          amount,
        },
      ],
    })
  );
  if (res.data.failed !== 0) throw new Error(res.data.message);

  return res.data.result[0];
};

exports.getDataProductList = async (phone) => {
  const hash = crypto.generateHash();
  const res = await axios.post(
    "https://estoresms.com/data_list/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      hash,
      phone,
    })
  );

  if (res.data.response !== "OK")
    throw new Error(`Error getting Data Product List: ${res.data.message}`);

  return res.data;
};

exports.makeDataPurchase = async (productId, phone, ref, hash) => {
  const res = await axios.post(
    "https://estoresms.com/data_processing/v/2",
    JSON.stringify({
      username: process.env.ESTORE_USERNAME,
      ref,
      callback: "https://samplewebsite.com/callback", // FIXME: change call back to changePurchaseStatus,
      hash,
      request: [
        {
          product: productId,
          phone,
        },
      ],
    })
  );

  if (res.data.failed !== 0) throw new Error(res.data.message);

  return res.data.result[0];
};

exports.getCablePlansFor = async (product, number) => {
  const hash = crypto.generateHash();
  const data = {
    username: process.env.ESTORE_USERNAME,
    hash,
    category: "tv",
    product,
    number,
  };
console.log(data);
  try {
    const res = await axiosForm(
      "https://estoresms.com/bill_payment_processing/v/2/",
      data
    );
    console.log(res.data);


    if (res.data.response !== "OK")
      throw new Error(`Error getting Data Product List: ${res.data.message}`);

    return res.data;
  } catch (e) {
    console.log(e);
    throw e;

  }
};

exports.makeCablePurchase = async (product, plan, number) => {
  const ref = crypto.genRandomId();
  const hash = crypto.generateHash(ref);

  const data = {
    username: process.env.ESTORE_USERNAME,
    hash,
    ref,
    category: "tv",
    product,
    plan,
    number,
  };

  try {
    const res = await axiosForm(
      "https://estoresms.com/bill_payment_processing/v/2/",
      data
    );

    if (res.data.response !== "OK")
      throw new Error(`Error Making Purchase: ${res.data.message}`);

    return res.data;
  } catch (e) {
    throw e;
  }
};

exports.getElectricCompany = async () => {
  const hash = crypto.generateHash();

  const data = {
    username: process.env.ESTORE_USERNAME,
    hash,
    category: "electricity",
  };

  try {
    const res = await axiosForm(
      "https://estoresms.com/bill_payment_processing/v/2/",
      data
    );

    if (res.data.response !== "OK")
      throw new Error(`Error Making Purchase: ${res.data.message}`);

    return res.data;
  } catch (e) {
    throw e;
  }
};

exports.makeElectricPayment = async (product, amount, number, prepaid) => {
  const ref = crypto.genRandomId();
  const hash = crypto.generateHash(ref);

  console.log(product, amount, number, prepaid);
  const data = {
    username: process.env.ESTORE_USERNAME,
    hash,
    ref,
    category: "electricity",
    product,
    amount,
    number,
    prepaid,
  };

  try {
    const res = await axiosForm(
      "https://estoresms.com/bill_payment_processing/v/2/",
      data
    );

    if (res.data.response !== "OK")
      throw new Error(`Error Making Payment: ${res.data.message}`);

    return res.data;
  } catch (e) {
    throw e;
  }
};

exports.convertToGigaRate = (megaRate) => {
  return `${megaRate / 1000}GB`;
};

exports.getDataValue = (amount) => {
  if (amount < 1000) return `${amount}MB`;
  return this.convertToGigaRate(amount);
};
