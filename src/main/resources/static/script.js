let stompClient = null;

function connect() {
    const serverIp = document.getElementById('serverIp').value;
<<<<<<< HEAD
    const socket = new SockJS(`http://${serverIp}:8080/ws`);
    stompClient = Stomp.over(socket);
    
    stompClient.connect(function (frame) {
        console.log('Connected: ' + frame);
        setConnected(true);
        stompClient.subscribe('/topic/public', function (message) {
            showMessage(JSON.parse(message.body));
        });  
    }, function (error) {
        console.error('Connection error: ' + error);
        setConnected(false);
=======
    const port = 8080;
    const socket = new SockJS(`http://${serverIp}:${port}/ws`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/public', function (message) {
            showMessage(JSON.parse(message.body));
        });
>>>>>>> Abiel/main
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function setConnected(connected) {
    const status = document.getElementById('status');
    if (connected) {
        status.className = 'connected';
        status.textContent = 'Conectado';
    } else {
        status.className = 'disconnected';
        status.textContent = 'Desconectado';
    }
    document.getElementById('message').disabled = !connected;
}

function sendMessage() {
    const username = document.getElementById('username').value;
    const content = document.getElementById('message').value;
<<<<<<< HEAD
    
    if (content.trim() === '') return;
    
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({'tipo': 'MENSAJE', 'usuario': username, 'contenido': content}));
    
=======

    if (content.trim() === '' || stompClient === null) return;

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({ tipo: 'CHAT', usuario: username, contenido: content }));

>>>>>>> Abiel/main
    document.getElementById('message').value = '';
}

function showMessage(message) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = '<strong>' + message.usuario + ':</strong> ' + message.contenido;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
