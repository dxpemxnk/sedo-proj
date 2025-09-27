const jwt = require("jsonwebtoken");

function varifyAccessToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send("Invalid access token");
    }
    const accessToken = authHeader.split(" ")[1];

    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    res.locals.user = user;

    next();
  } catch (error) {
    console.log(error);

    console.log("Invalid access token");
    res.status(403).send("Invalid access token");
  }
}

module.exports = varifyAccessToken;
