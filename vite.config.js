import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5000,
        // HMR 웹소켓 비활성화
        hmr: false,
        fs: {
            strict: false,
        },
        cors: true,
        // Proxy API requests to backend server
        proxy: {
            '/users': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/patients': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/rooms': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/fall-incidents': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/environmental': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/weather': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/alerts': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/notifications': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/firebase': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/floors': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
        // Explicitly allowing the Replit domain
        allowedHosts: [
            '241da12e-4d7a-4547-a7a3-91484fa5e3ff-00-3bp3i4bs64oqr.spock.replit.dev',
            '.replit.dev',
            '.repl.co',
            'replit.dev',
            'repl.co',
            'replit.com',
            'repl.it',
            '*',
        ],
    },
});
