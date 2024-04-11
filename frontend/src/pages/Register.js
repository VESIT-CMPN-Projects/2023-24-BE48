import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import tifrlogo from "../static/tifrl.png";
import "../styles/Login.css";
import { UserContext } from "../components/UserContext";

function Register() {
  const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
  const API_PORT = process.env.REACT_APP_API_PORT || "4444";

  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uname, setUname] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password, uname: uname }),
        credentials: "include",
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
        console.log(user);
        console.log("Login successful");
        navigate("/home");
      } else {
        console.log({ email });
        alert("Login failed.");
      }
    } catch (error) {
      console.log("Error while registration: ", error);
    }
  };

  return (
    <div className="root">
      <div className="left">
        <img alt="tifr-logo" className="logo" src={tifrlogo} />
        <h1>
          <strong>Aatmanirbhar Sanchar</strong>
        </h1>
      </div>
      <div className="right">
        <form action="#">
          <h2 id="login">Welcome !</h2>
          <label>
            Enter your email:
            <br />
            <input
              id="email"
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Enter your password:
            <br />
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Enter your username:
            <br />
            <input
              id="uname"
              type="text"
              placeholder="Enter a username"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
            />
          </label>

          <input className="btn" value="Register" id="btn" type="button" onClick={handleRegister} />
          <Link to="/login">
            Already a user ? <strong>Login here</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
