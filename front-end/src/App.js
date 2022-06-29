import React, { useState } from "react";
import FetchRepo from "./components/FetchRepo";
import RenderForm from "./components/RenderForm";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import "./styles.css";

function App() {
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  
  return (
    <div className="app">
      <div className="login-form">      
       <Router>
           <Routes>
                 <Route exact path='/' element={< RenderForm setIsSubmitted={setIsSubmitted} setToken={setToken}/>}></Route>
                 
                 <Route exact path='/fetchrepo' element={<FetchRepo token={token}/>}></Route>               
          </Routes>
       </Router>
      </div>
    </div>
    
    // <div className="app">
    //   <div className="login-form">      
    //     {isSubmitted ? <FetchRepo token={token}/> : <RenderForm setIsSubmitted={setIsSubmitted} setToken={setToken}/> }
    //   </div>
    // </div>
  );
}
export default App;