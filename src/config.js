const config = {
    API_URL: '/api', // This will use the proxy in development and the actual path in production

    // For absolute URLs in development when needed
    getFullApiUrl: () => {
        // In development environment
        if (import.meta.env.DEV) {
            return 'http://localhost:3000/api';
        }
        // In production environment
        return '/api';
    },
};

export default config;
