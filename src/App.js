import React, { useState } from "react";
import FetchRepo from "./FetchRepo";

import "./styles.css";

function App() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    const res = await fetch('' ,{
      headers:{
        'Content-Type' : 'application/json'
      },
      method : '' ,
      body: JSON.stringify({
        user:inputs.user,
        password:inputs.password,
      })
    });
    const temp = await res.json();
    window.alert(temp.message);
   
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          
          <input type="submit" value="Log in"/>
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? <FetchRepo/> : renderForm}
      </div>
    </div>
  );
}

export default App;