import asyncHandler from "../middlewares/async.middleware.js";
import { getDashboardDataDao } from "../dao/overAllData.dao.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Optional filters
  const filters = {
    search: req.query.search || "",
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder === "asc" ? 1 : -1,
  };

  try {
    const result = await getDashboardDataDao({ page, limit, skip, filters });

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
});
