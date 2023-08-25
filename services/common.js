const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTVmNGQwZjEwYzBmNzRhZjIzNDBmMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5Mjk0MzcwNX0.5FFs0Zyi1SWVpIFf5DP1do3cSryfJuA5G1BcIgsrh7s"
  return token;
};
