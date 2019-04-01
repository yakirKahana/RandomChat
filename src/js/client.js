let socket = io.connect();
let messageForm = document.getElementById('msgForm');
let msg = document.getElementById('msg');
let chat = document.getElementById('chat');
let reqChat = document.getElementById('reqMessage');
let userID = Math.floor(Math.random() * 900000000);
let partnerID;
let inChat = false;
let sharedKey;

const dh = new DiffieHellman(3, 190000);
let pubKey = dh.GenerateKey();

socket.emit('new-user', userID);



reqChat.addEventListener('click', () => {
    socket.emit('chat-request', userID);
});
// on form sumbit, send msg 
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit("send-msg", { msg: msg.value, to: partnerID });
    msg.value = "";
});

socket.on('new-msg', (data) => {
    let name = (data.uid === userID) ? "Me" : "Stranger";
    chat.innerHTML += `<div><b>${name}</b>: ${data.msg}</div>`;
});

socket.on('new-partner', data => {
    partnerID = data;
    inChat = true;
    socket.emit('got-partner', userID);
    socket.emit('dh-send', { key: pubKey, to: partnerID });
});

socket.on("dh-get", data => {
    sharedKey = dh.CalculateSharedSecret(data);
    console.log(sharedKey);
});