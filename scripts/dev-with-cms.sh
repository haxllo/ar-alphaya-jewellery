#!/bin/bash

# Start Decap CMS proxy server in the background
echo "🎭 Starting Decap CMS proxy server..."
npx decap-server &
DECAP_PID=$!

# Wait a moment for Decap server to start
sleep 2

# Start Next.js development server
echo "⚡ Starting Next.js development server..."
npm run dev &
NEXT_PID=$!

echo ""
echo "🚀 Development servers started:"
echo "   - Next.js app: http://localhost:3000"
echo "   - CMS Admin: http://localhost:3000/admin"
echo "   - Decap Proxy: http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'echo ""; echo "🛑 Stopping servers..."; kill $DECAP_PID $NEXT_PID; exit 0' INT
wait
