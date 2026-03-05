const socket = io();

let room = localStorage.getItem("room");

socket.emit("join-room",room);

let input = document.getElementById("msg");

/* ENTER KEY EVENT */

input.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        event.preventDefault();
        send();
    }

});


function send(){

let msg = document.getElementById("msg").value;

socket.emit("send-message",{
room:room,
message:msg
});

document.getElementById("msg").value="";

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

document.getElementById("chat").appendChild(div);

});
