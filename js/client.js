const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('tingting.mp3');

let userHasInteracted = false;

document.addEventListener('click', () => userHasInteracted = true);
document.addEventListener('keydown', () => userHasInteracted = true);

const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left' && userHasInteracted) {
        audio.play().catch(error => {
            console.warn('Audio playback blocked:', error);
        });
    }
}

form.addEventListener('submit' , (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`<strong>You</strong>: ${message}` , 'right');
    socket.emit('send' , message);
    messageInput.value = '';
})

const userName = prompt("Enter your name to join");
socket.emit('new-user-joined' , userName);

socket.on('user-joined' , userName=>{
    append(`${userName} joined the chat` , 'right');
})

socket.on('receive', data=>{
    append(`<strong>${data.name}</strong> : ${data.message}` , 'left');
})

socket.on('left' , name=>{
    append(`${name} left the chat` , 'right');
})