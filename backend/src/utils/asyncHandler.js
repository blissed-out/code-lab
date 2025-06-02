import ApiResponse from "./api-response.js";
import ApiError from "./api-error.js";

const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    console.error("Error", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export default asyncHandler;
