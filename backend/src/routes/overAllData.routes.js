import express from "express";
const overAllDataRouter = express.Router();

import { getDashboardData } from "../controllers/overAllData.controller.js";

overAllDataRouter.get("/get-dashboard-data", getDashboardData);

export default overAllDataRouter;
