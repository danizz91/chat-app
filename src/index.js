const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require("./utils/users")
const {createMessage,getAllMessage,writeLog} = require('./utils/room');

const app = express();
app.use(express.json());
const server = http.createServer(app)
const io = socketio(server);




const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));


io.on('connection',(socket)=>{
    console.log('New WebSocket connection');

    socket.on('join',async ({username,room},callback)=>{
        try{
            const {error,user} = await addUser({id:socket.id,username,room})
            if(error){
                return callback(error)
            }
            socket.join(user.room)
            const previousMessages = await getAllMessage(user.room)
            previousMessages.forEach((message)=>{
                socket.emit('message',generateMessage(message.username,message.text))
            })
            socket.emit('message',generateMessage("Admin",'Welcome!'))
            const message = generateMessage(user.username,`has joined!`)
            socket.broadcast.to(user.room).emit('message',message)
            await createMessage(user.id,message,user.room)
            await writeLog()
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: await getUsersInRoom(user.room)
            })
        }catch (e){
            return e
        }
        callback()
    })

    socket.on('sendMessage',async (data,callback)=>{
        const filter = new Filter()
        try{
            const user = await getUser(socket.id)
            const usersInRoom = await getUsersInRoom(user.room)
            data.updateStatus = 2;
            if(usersInRoom.length > 1){
                data.updateStatus = 3
            }
            const message = generateMessage(user.username,data.message,data.updateStatus)
            io.to(user.room).emit('message',message)
            await createMessage(user.id,message,user.room)
        }catch (e){
            return e
        }
        if(filter.isProfane(data.message)){
            return callback('Profainty is not allowed!')
        }
        callback()

    })


    socket.on('sendLocation',async (data)=>{
        try{
            const user = await getUser(socket.id)
            io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${data.latitude},${data.longitude}`))
        }catch (e){
            return e
        }
    })



    socket.on('disconnect',async ()=>{
        try{
            const user = await getUser(socket.id)
            await removeUser(socket.id)
            if(user){
                const message = generateMessage("Admin",`${user.username} has left!`)
                io.to(user.room).emit('message',message)
                await createMessage(user.id,message,user.room)
                io.to(user.room).emit('roomData',{
                    room: user.room,
                    users: await getUsersInRoom(user.room)
                })
            }
        }catch (e)
        {
            return e
        }
    })
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`);
})
