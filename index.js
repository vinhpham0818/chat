const express = require('express')
const app = express()

const port = 5000
const http = require('http')
const  socketIO = require('socket.io')
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', (socket) => {
    console.log('Connectd')
    socket.on('send-message',(value) => {
        console.log(value)
        io.sockets.emit('receive-message', value)
    })
    socket.on('disconnect', () => {
        console.log('Client disconnected.')
    })
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

server.listen(port, () => {
    console.log(`Server started with port. ${port}`)
})