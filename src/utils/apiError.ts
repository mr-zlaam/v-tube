class ApiError extends Error {
  success: boolean;
  data: any;
  statusCode: number;
  optMessage: string;
  constructor(
    statusCode: number = 500,
    message: string = "something went wrong!!",
    stack: any = null,
    optMessage: string = "",
    data: any = null
  ) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.optMessage = optMessage;
    this.data = data;
    this.stack = stack;
  }
}
export { ApiError };
