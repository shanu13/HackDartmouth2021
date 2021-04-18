console.log(roomId)
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messagecontainer = document.querySelector('.container');
const socket = io('/');

const append = (message,position)=> {
    const messageElement = document.createElement('div');
     messageElement.innerHTML = message;
     messageElement.classList.add('message');
     messageElement.classList.add(position);
     messagecontainer.append(messageElement)
    
    }

socket.emit('join-room',roomId);

socket.on('user-connected',(roomId)=> {
    console.log('user connected')
    console.log(roomId)
})

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = messageInput.value;
    append(`${message}`, 'right');
    socket.emit('send',message);
    messageInput.value = ''
})

socket.on('recieve', message => {
    append(`${message}`,'left')
    
})