import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use process.cwd() to get the current working directory, casting to any to bypass missing Node.js type definitions in the config context.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    server: {
      port: 3000,
    }
  };
});
