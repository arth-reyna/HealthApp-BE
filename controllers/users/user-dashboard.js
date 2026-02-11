import express from "express";
import { dashboardBL } from "../../services/users/dashboard-bl.js";
import { sendSuccess } from "../../utils/responseHandler.js";

export const dashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardBL();

    return sendSuccess(res, "Dashboard Page", dashboard);
  } catch (error) {
    console.error("User Dashboard Error: ", error.message);
    next(error);
  }
};
