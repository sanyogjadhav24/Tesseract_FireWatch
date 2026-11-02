// Stub implementation for build compatibility
export const schedulerService = {
  triggerManualFetch: async () => {
    return {
      success: true,
      message: 'Fetch triggered'
    };
  },
  getStatus: () => {
    return {
      running: false,
      lastFetch: null
    };
  }
};
