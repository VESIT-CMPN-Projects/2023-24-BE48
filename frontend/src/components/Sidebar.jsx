import React from "react";
import Navbar from "./Navbar";
import SidebarChats from "./SidebarChats";

function Sidebar({ onChatSelect, onGroupSelect }) {
  return (
    <div className="sidebar">
      <Navbar onChatSelect={onChatSelect} />
      <SidebarChats onChatSelect={onChatSelect} onGroupSelect={onGroupSelect} />
    </div>
  );
}

export default Sidebar;
