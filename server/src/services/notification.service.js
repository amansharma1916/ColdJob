// Stubbed for future use (e.g., in-app notifications, email notifications)
export const sendNotification = async (userId, { title, message, type }) => {
  console.log(`[notification] User ${userId}: [${type}] ${title} - ${message}`);
  // Future: save to a Notification model, push via WebSocket, etc.
  return { userId, title, message, type };
};