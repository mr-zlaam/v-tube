class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: any;
  constructor(statusCode: number, message: string = "OK", data: any = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
export { ApiResponse };
