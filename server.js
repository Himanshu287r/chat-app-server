const WebSocket = require('ws');
     const port = process.env.PORT || 8080;
     const wss = new WebSocket.Server({ port });

     wss.on('connection', (ws) => {
         ws.on('message', (data) => {
             const msg = JSON.parse(data);
             if (msg.type === 'join') {
                 ws.username = msg.username;
                 wss.clients.forEach((client) => {
                     if (client.readyState === WebSocket.OPEN) {
                         client.send(JSON.stringify({ username: 'Server', message: `${msg.username} joined the chat` }));
                     }
                 });
             } else if (msg.type === 'message') {
                 wss.clients.forEach((client) => {
                     if (client.readyState === WebSocket.OPEN) {
                         client.send(JSON.stringify({ username: msg.username, message: msg.message }));
                     }
                 });
             }
         });

         ws.on('close', () => {
             if (ws.username) {
                 wss.clients.forEach((client) => {
                     if (client.readyState === WebSocket.OPEN) {
                         client.send(JSON.stringify({ username: 'Server', message: `${ws.username} left the chat` }));
                     }
                 });
             }
         });
     });

     console.log(`WebSocket server running on port ${port}`);