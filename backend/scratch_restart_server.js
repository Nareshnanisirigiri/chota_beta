const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function restart() {
  console.log("Checking for process on port 5000...");
  exec('netstat -ano | findstr :5000', (err, stdout, stderr) => {
    if (err || !stdout) {
      console.log("No process found on port 5000. Starting server...");
      startServer();
      return;
    }
    
    console.log("Netstat output:\n", stdout);
    const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
    if (lines.length === 0) {
      console.log("No LISTENING process on port 5000. Starting server...");
      startServer();
      return;
    }
    
    // Extract PID from the last column
    const tokens = lines[0].trim().split(/\s+/);
    const pid = tokens[tokens.length - 1];
    console.log(`Found PID ${pid} listening on port 5000. Terminating...`);
    
    exec(`taskkill /F /PID ${pid}`, (killErr, killStdout, killStderr) => {
      if (killErr) {
        console.error(`Failed to kill process ${pid}:`, killErr.message);
      } else {
        console.log(`Successfully killed process ${pid}:\n`, killStdout);
      }
      // Wait 2 seconds before starting the server
      setTimeout(startServer, 2000);
    });
  });
}

function startServer() {
  console.log("Starting server.js in background...");
  
  // Create a log file to monitor the output
  const logStream = fs.createWriteStream(path.join(__dirname, 'server_output.log'), { flags: 'a' });
  
  const child = spawn('node', ['server.js'], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);
  
  child.unref();
  console.log(`Server started with PID: ${child.pid}. Output is logged to server_output.log.`);
  process.exit(0);
}

restart();
