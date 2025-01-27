const express = require('express')
const http = require('http');
const { Server : socketServer } = require('socket.io');
var pty = require('node-pty');

const app = express() 
const server = http.createServer(app);

const ptyProcess = pty.spawn('powershell.exe', ['-NoLogo', '-NoProfile'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD || process.cwd() + './user',
    env: process.env
});

function stripAnsiCodes(data) {
    return data.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '').trim();
}

const io = new socketServer({
  cors: '*',
})

io.attach(server)

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
    console.log(data);
});

io.on('connection', (socket) => {
    console.log('New connection', socket.id)
    
    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    });
});

server.listen(9000, () => {
  console.log('Server is up and running on port 9000')
});