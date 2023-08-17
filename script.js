const socket = io();

const userList = document.getElementById('userList');
const usernameInput = document.getElementById('usernameInput');
const addUserButton = document.getElementById('addUserButton');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');

addUserButton.addEventListener('click', () => {
  const userName = usernameInput.value;
  if (userName) {
    socket.emit('set username', userName);
    addUserButton.disabled = true;
    usernameInput.disabled = true;
  }
});

sendMessageButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('chat message', { message });
    messageInput.value = '';
  }
});

socket.on('chat message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = `${data.user}: ${data.message}`;
  chatBox.appendChild(messageElement);
});

socket.on('user joined', (userName) => {
  const userElement = document.createElement('li');
  userElement.textContent = userName;
  userList.appendChild(userElement);
});

socket.on('user left', (userName) => {
  const userElements = userList.getElementsByTagName('li');
  for (let i = 0; i < userElements.length; i++) {
    if (userElements[i].textContent === userName) {
      userElements[i].remove();
      break;
    }
  }
});
