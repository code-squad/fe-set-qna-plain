const jwt = require("jsonwebtoken");

module.exports = { 
    generateJwt (id, secretKey) {
    const now = new Date();
    now.setDate(now.getDate() + 7);
  
    return jwt.sign(
      {
        _id: id,
        exp: parseInt(now.getTime() / 1000)
      },
      secretKey
    );
  }
}