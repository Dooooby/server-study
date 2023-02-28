const express = require('express') 
const socket = require('socket.io')
const http = require('http')
const fs = require('fs') //Node.js 기본내장모듈 불러오기

// const { response } = require('express')
const app = express()
const server = http.createServer(app)
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if(err) {
            response.send('에러')
        } else {
            response.writeHead(200, {'Content-Type' : 'text/html'}) //클라이언트에게 HTML파일이라는 것 알림
            response.write(data) //HTML 데이터 send
            response.end() //모두 완료됨을 알림
        }
    })
    // console.log('유저가 /으로 접속하였습니다!')
    // response.send('This is Express SERVER!!')
})

io.sockets.on('connection', function(socket) { //on은 이벤트시 콜백 => connection시 콜백함수실행
    // console.log('유저 clear')

    socket.on('newUser', function(name) { //소켓이름저장
        console.log(name + 'is Here NOW !!')
        socket.name = name
        io.sockets.emit('update', {type:'connect', name:'SERVER', message: name + 'is Here NOW!!'})
    })

    socket.on('message', function(data) { //전송한 메세지
        data.name = socket.name
        console.log(data)
        socket.broadcast.emit('update', data);
    })

    // socket.on('send', function(data) {
    //     console.log('전달된 메세지 : ', data.msg)
    // })
    
    socket.on('disconnect', function() {
        console.log(socket.name + 'is Not here Now :( ')
        socket.broadcast.emit('update', {type:'disconnect', name : 'SERVER', message:socket.name + 'is Not here Now :( '})
    })
})


server.listen(8000, function() {
    console.log('서버 실행 중...')
})
