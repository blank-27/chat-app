const path = require("path")
const http = require("http")
const express = require("express")
const Filter = require("bad-words")
const socketio = require("socket.io")
const {genrateMessage,genrateLocationMessage} = require("./utils/messages")
const messages = require("./utils/messages")
const admin = "Kami"

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')
const { error } = require("console")

const app = express()

//for sever creation (chat app specfic)
const server = http.createServer(app)
const io = socketio(server)

const  port  = process.env.PORT || 4000;
const publicDirectoryPath = path.join(__dirname,"../public")

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket) => {


    socket.on('join',({username,room},callback) => {

        const {error,user} = addUser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }


        socket.join(room)

        io
        
        socket.emit('message',genrateMessage(admin,"Welcome!!")  )
        socket.broadcast.to(room).emit('message',genrateMessage(admin,`"${username}" swagat hai aapka yanha`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage',(message,callback) => {

        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            message ="{__glt kaam nhi__}" 
            callback("glt kaam nhi")
        }

        io.to(user.room).emit('message',genrateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation',({latitude,longitude},callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage',genrateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))

        callback()
    })

    socket.on('disconnect',() => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',genrateMessage(admin,`${user.username} left the chat`))

            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

})


server.listen(port,() => {
    console.log(`server running on ${port}`)
})