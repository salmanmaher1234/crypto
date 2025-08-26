#!/bin/bash

# C BOE Platform - React.js + PHP + MySQL
# Start PHP backend server on port 8080 and React frontend on port 5000

echo "🚀 Starting C BOE Platform..."
echo "📊 Architecture: React.js + PHP + MySQL"
echo ""

# Start PHP server in background
echo "🔧 Starting PHP Backend Server (Port 8080)..."
cd php && php -S 0.0.0.0:8080 index.php &
PHP_PID=$!
echo "✅ PHP Server: http://localhost:8080"

# Start React development server
echo "⚛️  Starting React Frontend (Port 5000)..."
cd ../client && npm run dev &
REACT_PID=$!
echo "✅ React App: http://localhost:5000"

echo ""
echo "🎯 Platform Features:"
echo "  • SUP Cryptocurrency Trading"
echo "  • INR Currency Support"
echo "  • Indian Banking System"
echo "  • Admin & Customer Dashboards"
echo ""
echo "Press Ctrl+C to stop all servers"

# Handle termination
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $PHP_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait $PHP_PID
wait $REACT_PID