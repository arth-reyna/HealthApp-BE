import express from 'express';
import { dashboardBL } from '../../services/users/dashboard-bl.js';

export const dashboard = async (req, res) => {
    try {
        const dashboard = await dashboardBL();

    } catch (error) {
        console.error("User Dashboard Error: ", error.message);
    }
}