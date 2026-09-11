#!/bin/bash
# SamriddhiSetu — Start All Servers
echo "🚀 Starting SamriddhiSetu..."

# Kill any existing processes on ports 3000 and 5001
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null
sleep 1

# Start backend
echo "⚙️  Starting Backend API (port 5001)..."
cd "$(dirname "$0")/server"
node src/index.js &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "🌐 Starting Frontend (port 3000)..."
cd "$(dirname "$0")/client"
npx vite --host &
FRONTEND_PID=$!

echo ""
echo "✅ SamriddhiSetu is running!"
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:5001"
echo "   Network  : http://$(ipconfig getifaddr en0 2>/dev/null || echo 'your-ip'):3000"
echo ""
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'; exit" INT
wait
