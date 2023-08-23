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
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTVmNGQwZjEwYzBmNzRhZjIzNDBmMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkyNzk1NzQ5fQ.zxbIn8m1SzpAI7ceO2w0M-eYf-Jd2DWsnlhsXk6kUfA"
  return token;
};
