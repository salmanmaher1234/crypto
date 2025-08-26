// C BOE Platform - React.js + PHP + MySQL
// Main development server launcher

import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 C BOE Platform - React.js + PHP + MySQL');
console.log('📊 Starting development servers...\n');

// Start PHP server
console.log('🔧 Starting PHP Backend (Port 8080)...');
const phpServer = spawn('php', ['-S', '0.0.0.0:8080', 'index.php'], {
    cwd: 'php',
    stdio: 'pipe'
});

phpServer.stdout.on('data', (data) => {
    console.log(`[PHP] ${data}`);
});

phpServer.stderr.on('data', (data) => {
    console.log(`[PHP] ${data}`);
});

// Start React dev server after a short delay
setTimeout(() => {
    console.log('⚛️  Starting React Frontend (Port 5000)...');
    const reactServer = spawn('npm', ['run', 'dev'], {
        cwd: 'client',
        stdio: 'inherit'
    });

    reactServer.on('error', (err) => {
        console.error('React server error:', err);
    });
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping servers...');
    phpServer.kill();
    process.exit(0);
});

console.log('✅ PHP Server: http://localhost:8080');
console.log('✅ React App: http://localhost:5000');
console.log('\n🎯 Features: SUP Trading, INR Currency, Indian Banking');
console.log('Press Ctrl+C to stop\n');