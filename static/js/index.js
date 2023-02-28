var socket = io()

//접속시 ev : connect
socket.on('connect', function() { //on : 수신
    var name = prompt('Welcome!', '')
    if(!name) {
        name = 'anonymous'
    }
    
    socket.emit('newUse', name)
})

socket.on('update', function(data) {
    console.log(`${data.name}: ${data.message}`)
})

//전송시
function send() {
    var message = document.getElementById('test').value // 입력된 value 가져옴
    document.getElementById('test').value = '' //가져온것을 데이터 빈칸으로 변경
    socket.emit('message', {type: 'message', message: message}) //emit : 전송, 서버로 send 이벤트 및 데이터 전달
}