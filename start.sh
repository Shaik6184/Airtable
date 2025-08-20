#!/bin/bash

echo "🚀 Starting Airtable Form Builder..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend
echo "📡 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
