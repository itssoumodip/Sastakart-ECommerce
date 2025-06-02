// Toast configuration for consistent notification styling
export const toastConfig = {
  duration: 3000, // 3 seconds
  style: {
    background: '#333',
    color: '#fff',
  },
  success: {
    duration: 2000,
    style: {
      background: '#22c55e',
      color: '#fff',
    },
  },
  error: {
    duration: 3000,
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  },
  loading: {
    duration: 30000, // 30 seconds for loading states
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  }
};

// Toast message formatter to ensure consistency
export const formatToastMessage = (message) => {
  // Remove emojis and clean up the message
  return message.replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
};
