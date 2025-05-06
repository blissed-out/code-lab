class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = statusCode < 400;
        this.errors = errors;

        // stacks (optional)
        if (stacks) {
            this.stacks = stacks;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
