const crypto = require("crypto");

exports.generateHash = (ref = "") => {
  //creating hash object
  const hash = crypto.createHash("sha512");
  //passing the data to be hashed
  const { ESTORE_TOKEN, ESTORE_EMAIL, ESTORE_USERNAME } = process.env;
  let data = hash.update(
    `${ESTORE_TOKEN}${ESTORE_EMAIL}${ESTORE_USERNAME}${ref}`,
    "utf-8"
  );
  //Creating the hash in the required format
  return data.digest("hex");
};

exports.genRandomId = () => crypto.randomBytes(12).toString("hex");
