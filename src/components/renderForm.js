import React, { useState } from "react";


 function RenderForm(props) {

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.getAttribute('name');
        const value = event.target.value;
        const newinput = { ...inputs };
        newinput[name] = value;
        setInputs(newinput);
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        const res = await fetch('http://localhost:3001/user/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                email: inputs.email,
                password: inputs.password,
            })
        });
        const temp = await res.json();
        window.alert(temp.token);

        props.setIsSubmitted(true)

        props.setToken(temp.token)
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Username </label>
                    <input type="text" name="email" value={inputs.email || ""} onChange={handleChange} required />

                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="password" value={inputs.password || ""} onChange={handleChange} required />

                </div>
                <div className="button-container">

                    <input type="submit" value="Log in" />
                </div>
            </form>
        </div>
    )
}

export default RenderForm;