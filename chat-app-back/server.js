require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on('errorr', (err) => {
    console.log("Mongosose Connection Error: " + err.message);    
});

mongoose.connection.once('open', function(){
    console.log("MongoDB database connection established successfully");    
});

require('./models/userModel');
require('./models/chatRoomModel');
require('./models/messageModel');

const app = require('./app');

const server = app.listen(8080, () => {
    console.log("server listening on port 8080"); 
});

const io = require('socket.io')(server);
const jwt = require("jsonwebtoken")

const Message = mongoose.model("Message");
const User = mongoose.model("User");
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
        console.log("there is message on:" + chatroomId);
        console.log("message: " + message);
        if(message.trim().length > 0){ 
            const user = await User.findOne({_id: socket.userId});             
            
            const newmessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message,
            })
            //console.log(newmessage);
            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId
            });
            await newmessage.save();
        }
           
    });
});
