import React, { useContext } from "react";
import "../styles/Home.css";
import { UserContext } from "./UserContext";
import tifrLogo from "../static/tifrl.png";

function Navbar({ onChatSelect }) {
  const { user } = useContext(UserContext);

  return (
    <div className="navbar">
      <div className="logo-root">
        <img className="header-logo logo-left" src={tifrLogo} alt="TIFR Logo" />
        {/* <img className='header-logo logo-right' src={vesLogo} alt="VES Logo" /> */}
      </div>
      <div className="user" onClick={() => onChatSelect(false)}>
        <img
          src="https://images.pexels.com/photos/707344/pexels-photo-707344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <h3>{user.uname}</h3>
      </div>
    </div>
  );
}

export default Navbar;
