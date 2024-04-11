import React, { useEffect, useState } from "react";
import { getUserGroups } from "./utils";

function SidebarChats({ onChatSelect, onGroupSelect }) {
  const [groupIds, setGroupIds] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getUserGroups();
      if (res.error) {
        console.error("Error:", res.error);
        alert("Error: " + res.error);
        return;
      }
      const { groupIds, groupNames } = res.data;
      console.log("Groups: ", groupNames);
      setGroupIds(groupIds);
      setGroupNames(groupNames);
    };

    fetchGroups();
  }, [refresh]);

  return (
    <div className="chats">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <h2 style={{ color: "white" }}>Chats</h2>
        <button onClick={() => setRefresh(!refresh)}>Refresh</button>
      </div>
      {groupIds.map((_id, index) => {
        return (
          <div
            className="userChat"
            key={index}
            onClick={() => {
              onChatSelect(true);
              onGroupSelect(_id, groupNames[index]);
            }}
          >
            <img
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
            />
            <div className="userChatInfo">
              <span>{groupNames[index]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarChats;
