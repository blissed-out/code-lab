import ApiResponse from "./api-response.js";

const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    console.error("Error", error)
    res.status(error.code).json(
      new ApiResponse(error.code, null, error.message)
    );
  }
};

export default asyncHandler;
