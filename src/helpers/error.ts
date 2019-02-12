import httpStatus from 'http-status';

interface IApiError extends Error {
  statusCode: number;
  message: string;
}
export class ApiError extends Error implements IApiError {
  public statusCode: number;
  public message: string;
  constructor(errorResponse: ErrorResponse) {
    super();
    this.statusCode = errorResponse.statusCode;
    this.message = errorResponse.message;
  }
}

export class ErrorResponse {
  public static readonly InternalError = new ErrorResponse('Internal Server Error', httpStatus.INTERNAL_SERVER_ERROR);
  public static readonly WrongEndpoint = new ErrorResponse('Enpoint does not exist', httpStatus.NOT_FOUND);
  public constructor(public readonly message: string, public readonly statusCode: number) {}
}
