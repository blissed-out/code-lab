import ApiResponse from "./api-response.js";

const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res);
        console.log("this is working well for now");
        console.log("this is working well for now, isn't is so sir?");
    } catch (error) {
        res.status(error.code).json(
            new ApiResponse(error.code, null, error.message)
        );
    }
};

export default asyncHandler;

console.log("this is working well for now");
