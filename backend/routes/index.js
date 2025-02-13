var express = require("express");
var router = express.Router();

/* GET home page. */
// Redirect to "/users", when url is "/"
router.get("/", function (req, res, next) {
  res.redirect("/users");
});

module.exports = router;
