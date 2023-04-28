const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  let options = {
    root: path.join(__dirname),
  };
  let fileName = "index.html";
  res.sendFile(fileName, options);
});

var users = 0;
var roomno = 1;
// custom namespacing
// var cnsp = io.of("/custom-namespace");

io.on("connection", (socket) => {
  console.log(`Client Connected.`);

  // Creating custom event.
  //   setTimeout(() => {
  //     socket.emit("myCustomEvent", { description: `This is my custom event.` });
  //   }, 3000);

  // Broadcasting.
  users++;
  // <======================== First scenario ============================>
  //   io.sockets.emit("broadcast", { message: `${users} users are connected...` }); // "io.sockets" has global scope which means that message will send to all users including sender.

  // <======================== Second scenario ============================>
  socket.emit("newUserConnect", {
    message: `Hii, Welcome to the Live Stream...`,
  });

  socket.broadcast.emit("newUserConnect", {
    message: `${users} users are connected...`,
  }); // "socket.broadcast" used to send message that are already connected except the new one.

  // <======================== ROOMS/CHANNELS IN SOCKET.IO ============================>
  socket.join(`room-${roomno}`); // creating room.
  io.sockets
    .in(`room-${roomno}`)
    .emit("connectedRoom", `you are know connected to room no. ${roomno}`);

  // Disconnecting the socket
  socket.on("disconnect", () => {
    console.log(`Client Disconnected.`);
    users--;
    socket.broadcast.emit("newUserConnect", {
      message: `${users} users are connected...`,
    });
  });
});

http.listen(3000, () => {
  console.log(`server running on 3000`);
});
