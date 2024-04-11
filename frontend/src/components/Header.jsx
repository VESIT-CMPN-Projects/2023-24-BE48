import React from "react";
import "../styles/Header.css";
import tifrLogo from "../static/tifrl.png";

export default function Header() {
  return (
    <header>
      <div className="logo-root">
        <img className="header-logo logo-left" src={tifrLogo} alt="TIFR Logo" />
        {/* <img className='header-logo logo-right' src={vesLogo} alt="VES Logo" /> */}
      </div>
      <div className="buttons">
        <button
          onClick={() => (window.location.href = "/create-new-room")}
          className="header-button create-room-button"
        >
          Create New Room
        </button>
        <button
          onClick={() => (window.location.href = "/join-new-room")}
          className="header-button join-new-room-button"
        >
          Join New Room
        </button>
      </div>
    </header>
  );
}
