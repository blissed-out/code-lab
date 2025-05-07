import { body } from "express-validator";

const registrationValidation = async (req, res) => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email field is required")
      .isEmail()
      .withMessage("invalid email"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username field is required")
      .isLength({ min: 3 })
      .withMessage("username must be atleast 3 characters")
      .isLength({ max: 12 })
      .withMessage("username must not exceed 12 characters"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password field is required")
      .isLength({ min: 6 })
      .withMessage("password must be atleast 6 characters long"),
    // no max requirement for now
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email field is required")
      .isEmail()
      .withMessage("invalid email"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password field is required")
      .isLength({ min: 6 })
      .withMessage("password must be atleast 6 characters long"),
    // no max requirement for now
  ];
};

export { registrationValidation, loginValidation };
