class ApiError extends Error {
  success: boolean;
  data: any;
  statusCode: number;
  optMessage: string;
  errors: any;
  constructor(
    statusCode: number = 500,
    message: string = "something went wrong!!",
    errors: any = [],
    stack: string = "",
    optMessage: string = "",
    data: any = null
  ) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.optMessage = optMessage;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };
