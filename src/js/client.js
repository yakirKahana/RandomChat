let socket = io.connect();
let messageForm = document.getElementById('msgForm');
let msg = document.getElementById('msg');
let chat = document.getElementById('chat');
let reqChat = document.getElementById('reqMessage');
let userID = Math.floor(Math.random() * 900000000);
let partnerID;
let inChat = false;

let end2end = new e2ee();



socket.emit('new-user', userID);



reqChat.addEventListener('click', () => {
    socket.emit('chat-request', userID);
});
// on form sumbit, send msg 
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    end2end.encrypt(msg.value).then(e => {
        socket.emit("send-msg", { msg: e, to: partnerID });
        msg.value = "";
    });

});

socket.on('new-msg', (data) => {
    end2end.decrypt(data.msg).then(d => {
        console.log(data.msg);
        let name = (data.uid === userID) ? "Me" : "Stranger";
        chat.innerHTML += `<div><b>${name}</b>: ${d}</div>`;
    });

});

socket.on('new-partner', data => {
    partnerID = data;
    inChat = true;
    socket.emit('got-partner', userID);
    socket.emit('dh-send', { key: end2end.dh.PublicExported, to: partnerID });
});

socket.on("dh-get", data => {

    end2end.dh.generateSharedKey(data)
});