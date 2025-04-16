import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    hmr: {
      clientPort: 443
    },
    fs: {
      strict: false
    },
    cors: true,
    // Explicitly allowing the Replit domain
    allowedHosts: [
      '241da12e-4d7a-4547-a7a3-91484fa5e3ff-00-3bp3i4bs64oqr.spock.replit.dev',
      '.replit.dev',
      '.repl.co',
      'replit.dev',
      'repl.co',
      'replit.com',
      'repl.it',
      '*'
    ]
  }
});