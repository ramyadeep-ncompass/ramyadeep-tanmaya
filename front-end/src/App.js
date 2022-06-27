import React, { useState } from "react";
import FetchRepo from "./FetchRepo";
import RenderForm from "./components/renderForm";
import "./styles.css";

function App() {
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  
  return (
    <div className="app">
      <div className="login-form">
        
        {isSubmitted ? <FetchRepo token={token}/> : <RenderForm setIsSubmitted={setIsSubmitted} setToken={setToken}/> }
      </div>
    </div>
  );
}
export default App;