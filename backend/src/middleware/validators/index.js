const { check } = require("express-validator");

exports.LoginValidator = [
  check("email", "E-mail is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];

exports.RegisterValidator = [
  check("email", "E-mail is required").isEmail(),
  check("password", "Password is required").isLength({ min: 5 }),
  check("name", "Name is required").not().isEmpty(),
  check("phone", "phone is required").not().isEmpty(),
];

exports.RegisterManagerValidator = [
  check("email", "E-mail is required").isEmail(),
  check("password", "Password is required").isLength({ min: 5 }),
  check("name", "Name is required").not().isEmpty(),
  check("phone", "phone is required").not().isEmpty()
];
