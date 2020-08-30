import React from 'react'
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
    const [chatrooms, setChatrooms] = React.useState([]);

    const getChatrooms = () => {
        axios.get("http://localhost:8080/chatroom/", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("CA_Token"),
            },
        }).then(response => {
            //console.log(response.data);
            
            setChatrooms(response.data);
        }).catch(err => {
            setTimeout(getChatrooms, 3000);
        });        
    }
    React.useEffect(() => {
        getChatrooms();
    }, []);

  return (
    <div className="card">
        <div className="cardHeader">Chatrooms</div>
        <div className="cardBody">
        <div className="inputGroup">
                <label htmlFor="chatroomName">Chatroom Name</label>
                <input 
                    type="text" 
                    name="chatroomName" 
                    id="chatroomName" 
                    placeholder="Chatroom Name" 
                />                
            </div>                     
            <button>Create Chatroom</button>
            <div className="chatrooms">                
                {chatrooms.map((chatroom) => (
                    <div key="chatroom._id" className="chatroom">
                        <div>{chatroom.name}</div>
                        <Link to={"/chatroom/"+ chatroom._id}>
                            <div className="join">Join</div>
                        </Link>                        
                    </div>

                ))}
            </div>
        </div>
    </div>
  )
}

export default DashboardPage
