import {
  OK,
  BadRequest,
  Created,
  ServerError,
  NotFound,
  NotAuthorized,
  CastError,
} from "../statusCodes.js";

// 200 - OK
export const sendSuccess = (res, message, data) => {
  return res.status(OK).json({
    success: true,
    message: message,
    data,
  });
};

// 201 - Created
export const sendCreated = (res, message, data) => {
  return res.status(Created).json({
    success: true,
    message: message,
    data: data,
  });
};

// 400 - Bad Request
export const badRequest = (res, message, data) => {
  return res.status(BadRequest).json({
    success: false,
    message: message,
    data: data,
  });
};

// 401 - Not Authorized
export const notAuthorized = (res, message, data) => {
  return res.status(NotAuthorized).json({
    success: false,
    message: message,
    data: data,
  });
};

// 404 - Not Found
export const notFound = (res, message, data) => {
  return res.status(NotFound).json({
    success: false,
    message: message,
    data: data,
  });
};

// 500 Internal Server Error
export const internalServerError = (res, message, data) => {
  return res.status(ServerError).json({
    success: false,
    message: message,
    data: data,
  });
};

// MongoDB Cast Error
export const castError = (res, message, data) => {
  return res.status(CastError).json({
    success: false,
    message: message,
    data: data,
  });
};
