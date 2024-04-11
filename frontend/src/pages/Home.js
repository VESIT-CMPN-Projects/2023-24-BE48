import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import "../styles/Home.css";
import "../styles/Login.css";
import "../styles/Header.css";
import { handleLogout } from "../components/utils";
import { useNavigate } from "react-router-dom";

function Home() {
    const [isChatSelected, setIsChatSelected] = useState(false);
    const [groupId, setGroupId] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const navigate = useNavigate();

    const handleChatSelect = (set) => {
        setIsChatSelected(set);
    };

    const handleGroupId = (id, name) => {
        setGroupId(id);
        setGroupName(name);
    };

    return (
        <div>
            <div className="home">
                <div className="container">
                    <Sidebar onChatSelect={handleChatSelect} onGroupSelect={handleGroupId} />
                    {isChatSelected ? (
                        <Chat groupId={groupId} groupName={groupName} />
                    ) : (
                        <div className="right">
                            <div className="buttons">
                                <button
                                    onClick={() => {
                                        navigate("/create");
                                    }}
                                    className="header-button create-room-button btn"
                                >
                                    Create New Group
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/join");
                                    }}
                                    className="header-button join-new-room-button btn"
                                >
                                    Join Existing Group
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/notifications");
                                    }}
                                    className="header-button join-new-room-button btn"
                                >
                                    My Notifications
                                </button>
                                <button
                                    onClick={async () => {
                                        const response = await handleLogout();
                                        if (response) {
                                            navigate("/login");
                                        } else {
                                            alert("Error logging out");
                                        }
                                    }}
                                    className="header-button create-room-button btn"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
