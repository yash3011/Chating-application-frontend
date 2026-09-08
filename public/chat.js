const socket = io();

let room = localStorage.getItem("room");
const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const sendButton = document.getElementById("send-button");
const errorBanner = document.getElementById("chat-error");
const connectionDot = document.getElementById("connection-dot");

function showError(message){
    errorBanner.textContent = message;
    errorBanner.hidden = false;
}

function clearError(){
    errorBanner.textContent = "";
    errorBanner.hidden = true;
}

if(!room){
    showError("No private room was selected. Returning you to the join page...");
    sendButton.disabled = true;
    setTimeout(() => window.location = "/login.html", 1400);
}else{
    document.getElementById("room-label").textContent = `Room ${room}`;
    socket.emit("join-room",room);
}

input.addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        event.preventDefault();
        send();
    }

});


function send(){
let msg = input.value.trim();

if(!msg || !room){
    return;
}

if(!socket.connected){
    showError("You are offline. Your message was not sent.");
    return;
}

socket.emit("send-message",{
room:room,
message:msg
});

input.value="";
clearError();

}

socket.on("receive-message",(data)=>{

let div = document.createElement("div");

div.classList.add("message");

if(data.sender === socket.id){

div.classList.add("sent");

}else{

div.classList.add("received");

}

div.innerText = data.message;

chat.appendChild(div);
chat.scrollTop = chat.scrollHeight;

});

socket.on("connect",()=>{
    connectionDot.classList.add("online");
    connectionDot.setAttribute("aria-label", "Connected");
    sendButton.disabled = false;
    clearError();
});

socket.on("disconnect",()=>{
    connectionDot.classList.remove("online");
    connectionDot.setAttribute("aria-label", "Disconnected");
    sendButton.disabled = true;
    showError("Connection lost. Trying to reconnect...");
});

socket.on("connect_error",()=>{
    showError("Could not connect to the private room. Please refresh and try again.");
});

socket.on("chat-error",(message)=>{
    showError(message);
});
