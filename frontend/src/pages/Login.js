import React, { useContext, useState } from "react";
import tifrlogo from "../static/tifrl.png";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export default function Login() {
  const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
  const API_PORT = process.env.REACT_APP_API_PORT || "4444";

  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
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
      console.log("Error in login: ", error);
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
        <form action="" method="POST">
          <h2 id="login">Welcome back !</h2>
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

          <input className="btn" value="Login" id="btn" type="button" onClick={handleLogin} />

          <Link to="/register">
            Not registered ? <strong>Register here</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}
