const jwt = require("jsonwebtoken");

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
}
function verifyToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET); 
  return payload;
}

module.exports = {
  generateToken,
  verifyToken,
};