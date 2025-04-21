#!/bin/bash
# Get the Replit domain from the environment
REPLIT_DOMAIN=$(echo "$REPL_ID" | tr -d ' \n')".repl.co"
echo "Starting Vite server with host: $REPLIT_DOMAIN"

# Run vite with the Replit domain as an allowed host
npx vite --port 5000 --host=0.0.0.0 --strictPort --force