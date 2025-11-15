import './types/index';
import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
})