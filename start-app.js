import { exec } from 'child_process';
import path from 'path';

// Start PHP server
console.log('Starting PHP server on port 8080...');
const phpServer = exec('cd php && php -S 0.0.0.0:8080 index.php', (error, stdout, stderr) => {
  if (error) {
    console.error('PHP server error:', error);
    return;
  }
  console.log('PHP server output:', stdout);
  if (stderr) console.error('PHP server stderr:', stderr);
});

// Start React dev server
console.log('Starting React development server on port 5000...');
const reactServer = exec('cd client && npx vite', (error, stdout, stderr) => {
  if (error) {
    console.error('React server error:', error);
    return;
  }
  console.log('React server output:', stdout);
  if (stderr) console.error('React server stderr:', stderr);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  phpServer.kill();
  reactServer.kill();
  process.exit(0);
});

// Keep the process alive
phpServer.stdout.on('data', (data) => {
  console.log('PHP:', data.toString());
});

reactServer.stdout.on('data', (data) => {
  console.log('React:', data.toString());
});

console.log('Servers started. Use Ctrl+C to stop.');