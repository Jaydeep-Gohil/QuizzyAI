// Send error response
export const errorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// Send success response
export const successResponse = (res, status, data = {}, message = "") => {
  return res.status(status).json({ success: true, message, ...data });
};
