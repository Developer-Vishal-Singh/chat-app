// const express = require('express');
// const app = express();
// const http = require('http');
// const path = require('path');
// const socketio = require('socket.io');
// const server = http.createServer(app);
// const io = socketio(server);


// app.use('/', express.static(path.join(__dirname, '/public')));


// const users={}


// io.on('connection', (socket) => {
    
//     socket.on('login', (data) => {
//         users[socket.id]=data.name
//     })

//     socket.on('send_msg', (data) => {
    
//         io.emit('recieved_msg', {
//             msg: data.msg,
//             name: users[socket.id]
//         })

//     })

// })

// server.listen(process.env.PORT || 3001, () => {
//     console.log('server running at http://localhost:3001');
// })


const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname+'/public'));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

//Socket IO

const io = require('socket.io')(server);
var users = {}

io.on('connection' ,(socket)=>{
    socket.on("new-user-joined",(username)=>{
        users[socket.id] = username;
        socket.broadcast.emit("user-connected",username);
        io.emit("user-list",users);
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user = users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit("message",{user:data.user,msg:data.msg});
    })
})


//socketio setup end



server.listen(process.env.PORT || 3001, () => {
    console.log('server running at http://localhost:3001');
})




