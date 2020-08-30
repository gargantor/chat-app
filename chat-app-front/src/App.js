import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import LoginPage from './pages/LoginPages';
import RegisterPage from "./pages/RegisterPages";
import DashboardPage from "./pages/DashboardPages";
import IndexPage from './pages/IndexPages';
import ChatroomPage from './pages/ChatroomPages';
import makeToast from './Toaster';

function App() {
  const [socket, setSocket] = React.useState(null);
  
  const setupSocket = () => {
    const token = localStorage.getItem("CA_Token");
    if(token && !socket){
      const newsocket = io("http://localhost:8080", {
        query: {
          token: localStorage.getItem("CA_Token"),
        },
      });    
      
      newsocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected");
      });

      newsocket.on("connect", () => {        
        makeToast("success", "Socket Connected");
      });
      setSocket(newsocket);
    }
  }

  React.useEffect(() =>{    
    setupSocket();
  }, []);
  return (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route 
        path="/login" 
        render={() =><LoginPage setupSocket={setupSocket} />} 
      />
      <Route path="/register" component={RegisterPage} />
      <Route 
        path="/dashboard" 
        render={() =><DashboardPage socket={socket} />} 
      />
      <Route 
        path="/chatroom/:id" 
        render={() =><ChatroomPage socket={socket} />}
        //render={() => socket ? <ChatroomPage socket={socket} /> : null }
      />      
    </Switch>
  </BrowserRouter>
  )
}

export default App;
