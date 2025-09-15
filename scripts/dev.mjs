import { spawn } from 'child_process';

const command0 = ['next', ['dev']];
const command1 = ['node', ['scripts/watcher.mjs']];

const proc0 = spawn(command0[0], command0[1], { stdio: 'inherit' });
const proc1 = spawn(command1[0], command1[1], { stdio: 'inherit' });

console.log(`Started Development Server (PID: ${proc0.pid})`);
console.log(`Started File Watcher (PID: ${proc1.pid})`);

function killProcess(proc, name) {
    if (proc && !proc.killed) {
        console.log(`Killing ${name} (PID: ${proc.pid})`);
        proc.kill('SIGINT');
    }
}

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Killing child processes...');
    killProcess(proc0, 'Development Server');
    killProcess(proc1, 'File Watcher');
    setTimeout(() => process.exit(0), 500); // Give time for children to exit
});

proc0.on('exit', (code, signal) => {
    console.log(`${proc0.pid} exited with code ${code}, signal ${signal}`);
});
proc1.on('exit', (code, signal) => {
    console.log(`${proc1.pid} exited with code ${code}, signal ${signal}`);
});
