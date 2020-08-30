import React from 'react'
import { withRouter } from 'react-router-dom';

const ChatroomPage = ({ match, socket}) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);  
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const loadedMessageRef = React.useRef(messages);

  const sendMessage = () => {
    loadedMessageRef.current = messages;
    if(socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      })
      messageRef.current.value = '';
    }
  }
  
  /*React.useEffect(()=>{
    const token = localStorage.getItem("CA_Token");
    
    if(socket){
      console.log("Setting Up");
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message]
        setMessages(newMessages);
        //setMessages(messages => ([...messages, message]));
        //setLoadMessage(true);
      });     
    }
    
  }, [messages]);*/

  React.useEffect(() => {    
    const token = localStorage.getItem("CA_Token");
    if(token){
      const payload = JSON.parse(atob(token.split(".")[1]));      
      setUserId(payload.id);
      
    }
    if(socket){
      socket.emit("joinRoom", {
        chatroomId,
      });   
      socket.on("newMessage", (message) => {
        console.log(loadedMessageRef.current);
        console.log(message);
        
        
        const newMessages = [...loadedMessageRef.current, message];
        loadedMessageRef.current = newMessages;
        console.log(loadedMessageRef.current);
        
        setMessages(loadedMessageRef.current);
      });  
    }   

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  },[]);
  
  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span className={userId === message.userId ? "ownMessage" : "otherMessage" }>{message.name}:</span>{" "}
              {message.message}
            </div>

          ))}     
        </div>
        <div className="chatroomActions">
          <div>
            <input type="text" name="message" placeholder="say something!" ref={messageRef} />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>send</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default withRouter(ChatroomPage);
