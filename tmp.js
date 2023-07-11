const { spawn } = require('child_process');

const phpProcess = spawn('php', ['-r', 'echo "Hello, PHP!"']);

let phpOutput = '';
let phpError = '';

phpProcess.stdout.on('data', (data) => {
  phpOutput += data;
});

phpProcess.stderr.on('data', (data) => {
  phpError += data;
});

phpProcess.on('close', (code) => {
  console.log(`PHP output: ${phpOutput}`);
  console.error(`PHP error: ${phpError}`);
  console.log(`PHP process exited with code ${code}`);
});
