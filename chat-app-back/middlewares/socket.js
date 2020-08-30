module.exports = function(server){
    const io = require('socket.io')(server);
    const jwt = require("jsonwebtoken")
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            const payload = jwt.verify(token, process.env.SECRET);
            socket.userId = payload.id
            next();
        } catch (err) {}
    });
    
    io.on("connection", (socket) => {
        console.log("Connected: " + socket.userId);    
        socket.on("disconnect", () => {
            console.log("Disconnected: " + socket.userId);    
        })
        socket.on("joinRoom", ({ chatroomId }) => {
            socket.join(chatroomId);            
            console.log("A user joined chatroom: " + chatroomId);
        });
        socket.on("leaveRoom", ({ chatroomId }) => {
            socket.leave(chatroomId);            
            console.log("A user left chatroom: " + chatroomId);
        });

        socket.on("chatroomMessage", async ({ chatroomId, message}) => {
            if(message.trim().length > 0){
                io.to(chatroomId).emit("newMessage", {
                    message,
                    userId: socket.userId;
                });
            }            
        });
    });
}
