import { getDashboardSummaryData } from '../services/dashboard.service.js';

export const getDashboardSummary = (req, res) => {
  try {
    const summary = getDashboardSummaryData();
    res.json(summary);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to get dashboard summary',
      error: error.message,
    });
  }
};
