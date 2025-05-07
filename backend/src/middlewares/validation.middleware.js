import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

const validate = (next) => {
    const result = validationResult("body");
    if (result.isEmpty()) {
        next();
    } else {
        console.log("Errors: ", result.array());
        res.status(401).json(
            new ApiError(401, "Validation Error", result.array())
        );
    }
};

export default validate;
