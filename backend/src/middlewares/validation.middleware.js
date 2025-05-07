import { validationResult } from "express-validator";
import ApiResponse from "../utils/api-response.js";

const validate = (req, res, next) => {
  console.log("validator to catch error running");
  const result = validationResult("body");
  if (result.isEmpty()) {
    next();
  } else {
    console.log("Errors: ", result.array());
    res.status(401).json(new ApiResponse(401, null, result.array));
  };
}

export default validate;
