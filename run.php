<?php
// Simple PHP server launcher
echo "Starting SuperCoin PHP Application...\n";
echo "Server running on http://localhost:5000\n";
echo "Use Ctrl+C to stop the server\n\n";

// Start the built-in PHP server
exec('php -S 0.0.0.0:5000 -t .');
?>