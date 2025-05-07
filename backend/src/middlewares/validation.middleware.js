import { validationResult } from "express-validator";
import ApiResponse from "../utils/api-response.js";

const validate = (next) => {
  const result = validationResult("body");
  if (result.isEmpty()) {
    next();
  } else {
    console.log("Errors: ", result.array());
  };
}

export default validate;
