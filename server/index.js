const express = require('express')
const http = require('http');
const fs = require('fs/promises');
const { Server : socketServer } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const cors = require('cors');

const app = express() 
const server = http.createServer(app);

//middleware
app.use(cors());

app.get('/files', async(req,res) => {
    const fileTree = await generateFileTree('./user')
    return res.json({tree: fileTree})
})

const ptyProcess = pty.spawn('powershell.exe', ['-NoLogo', '-NoProfile'], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD || path.join(process.cwd(), 'user'),
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

async function generateFileTree(directory) {
    const tree = {}

    async function buildTree(currentDir, currentTree){
        const files = await fs.readdir(currentDir);
        for(const file of files){
            const filePath = path.join(currentDir, file);
            const stat = await fs.stat(filePath); // Await the fs.stat call
            if(stat.isDirectory()){
                currentTree[file] = {};
                await buildTree(filePath, currentTree[file]);
            } else {
                currentTree[file] = null;
            }
        }
    }
    await buildTree(directory, tree);
    return tree;
}