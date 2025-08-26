#!/bin/bash

# Start PHP built-in server in background
echo "Starting PHP server on port 8080..."
cd php && php -S 0.0.0.0:8080 index.php &
PHP_PID=$!

# Start React dev server 
echo "Starting React development server on port 5000..."
cd ../client && npm run dev &
REACT_PID=$!

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $PHP_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $PHP_PID
wait $REACT_PID