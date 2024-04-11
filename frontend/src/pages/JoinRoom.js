import React, { useState } from "react";
import "../styles/Join_room.css";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
    const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
    const API_PORT = process.env.REACT_APP_API_PORT || "4444";

    const [searchGroupName, setSearchGroupName] = useState("");
    const [groupIdList, setGroupIdList] = useState([]);
    const [groupNameList, setGroupNameList] = useState([]);
    const navigate = useNavigate();

    const fetchGroupList = async (groupName) => {
        try {
            const response = await fetch(
                `http://${API_ADDRESS}:${API_PORT}/api/groups/getGroupsList`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupName: groupName }),
                }
            );

            if (response.ok) {
                const { groups } = await response.json();
                console.log("Groups: ", groups);
                const groupIds = groups.map((group) => group._id);
                const groupNames = groups.map((group) => group.name);
                setGroupIdList(groupIds);
                setGroupNameList(groupNames);
            } else {
                console.log("Error in fetching group list");
            }
        } catch (error) {
            console.log("Error in fetching group list: ", error);
        }
    };

    const requestToJoin = async (groupId) => {
        try {
            const response = await fetch(
                `http://${API_ADDRESS}:${API_PORT}/api/groups/sendRequest`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupId: groupId }),
                }
            );
            if (!response.ok) {
                alert("Error in sending request");
                console.log("Error in sending request");
            }
        } catch (error) {
            alert("Error in sending request");
            console.log("Error in sending request: ", error);
        }
    };

    return (
        <div>
            <div className="bg-color">
                <div className="form">
                    <button type="button" onClick={() => navigate("/home")}>
                        Back
                    </button>
                    <h1>Join Chatroom</h1>
                    <div className="form-input">
                        <input
                            type="text"
                            id="username"
                            value={searchGroupName}
                            onChange={(e) => setSearchGroupName(e.target.value)}
                        />
                        <button type="button" onClick={() => fetchGroupList(searchGroupName)}>
                            Search
                        </button>
                        <span></span>
                        <label>Group Name</label>
                    </div>
                    <div>
                        {groupIdList.map((_id, index) => (
                            <div key={index} className="group-row">
                                <span>{groupNameList[index]}</span>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await requestToJoin(_id);
                                        navigate("/home");
                                    }}
                                >
                                    Request
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinRoom;
