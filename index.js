import http from 'node:http';
import path from 'node:path';

import express from 'express';
import { Server, Socket} from 'socket.io';

async function main() {

    const PORT = process.env.PORT ?? 8000
    const app = express()
    const server = http.createServer(app);
    const io = new Server()
    io.attach(server)

    io.on('connection', (socket) => {
        console.log(`[socket: ${socket.id}]: connected success...`);

        socket.on('client:location:update', (locationData) => {
            const {latitude,longitude} = locationData
            console.log(`[socket: ${socket.id}]:client:location:update`,locationData);
        })
        
    })

    app.get('/health', (req,res) => {
        return res.json({healthy: true})
    })
    
    app.use(express.static(path.resolve('./public')))
    
    server.listen(PORT, () => {
        console.log(`server is running on port: http://localhost:${PORT}`);
})
}

main()