import createApp from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[server] API available at http://localhost:${env.PORT}/api/v1`);
  });
};

startServer().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});