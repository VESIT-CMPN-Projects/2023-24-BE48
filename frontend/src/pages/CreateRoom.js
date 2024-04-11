import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
    const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
    const API_PORT = process.env.REACT_APP_API_PORT || "4444";

    const [groupName, setGroupName] = useState("");

    const navigate = useNavigate();

    const createGroup = async (groupName) => {
        try {
            const response = await fetch(
                `http://${API_ADDRESS}:${API_PORT}/api/groups/createGroup`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupName: groupName }),
                }
            );
            console.log("Response: ", response);
            if (response.ok) {
                const { message } = await response.json();
                console.log("Message: ", message);
            } else {
                console.log("Error in creating group");
            }
        } catch (error) {
            console.log("Error in creating group: ", error);
        }
    };

    return (
        <div>
            <div className="bg-color">
                <div className="form">
                    <button type="button" onClick={() => navigate("/home")}>
                        Back
                    </button>
                    <h1>Create Chatroom</h1>
                    <div className="form-input">
                        <input
                            type="text"
                            id="groupname"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                await createGroup(groupName);
                                navigate("/home");
                            }}
                        >
                            Create
                        </button>
                        <span></span>
                        <label>Group Name</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;
