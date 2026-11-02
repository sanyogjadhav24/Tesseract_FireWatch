// Stub implementation for build compatibility
export const batchProcessingService = {
  getFireDataBatches: async (options: any = {}) => {
    return {
      data: [],
      pagination: {
        page: options.page || 1,
        limit: options.limit || 100,
        total: 0
      }
    };
  },

  getBatchStats: async () => {
    return {
      totalBatches: 0,
      totalFires: 0,
      totalAlerts: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};
