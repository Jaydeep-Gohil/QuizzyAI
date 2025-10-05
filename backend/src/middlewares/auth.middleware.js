import jwt from "jsonwebtoken";
import asyncHandler from "./async.middleware.js";
import { errorResponse } from "../utils/responses.js";
import { findUserByIdAndGetDetails } from "../dao/user.dao.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await findUserByIdAndGetDetails(decoded.id);
      if (!user)
        return errorResponse(res, 401, "Not authorized, user not found");

      req.user = user;
      next();
    } catch (error) {
      return errorResponse(res, 401, "Not authorized");
    }
  } else {
    return errorResponse(res, 401, "Not authorized");
  }
});
