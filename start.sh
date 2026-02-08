#!/bin/bash
# Quick start script for Multi-User Todo Application

echo "🚀 Multi-User Todo App - Quick Start"
echo "===================================="
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found!"
    echo "   Run: cp backend/.env.example backend/.env"
    echo "   Then edit backend/.env with your DATABASE_URL and BETTER_AUTH_SECRET"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found!"
    echo "   Run: cp frontend/.env.local.example frontend/.env.local"
    echo "   Then edit frontend/.env.local with your BETTER_AUTH_SECRET"
    exit 1
fi

echo "✅ Environment files found"
echo ""

# Start backend
echo "🔧 Starting backend server..."
cd backend
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
uvicorn src.main:app --reload &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started!"
echo ""
echo "📍 Backend:  http://localhost:8000"
echo "📍 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
