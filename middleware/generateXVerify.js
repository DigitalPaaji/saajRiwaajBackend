const  crypto = require( "crypto");

 const generateXVerify = (base64Payload) => {
  return crypto
    .createHash("sha256")
    .update(base64Payload + "/v3/pay" + process.env.PHONEPE_CLIENT_SECRET)
    .digest("hex");
};

module.exports= generateXVerify;
