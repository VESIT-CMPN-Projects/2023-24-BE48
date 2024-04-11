import React, { useState, useContext, useEffect } from "react";
import "../styles/Join_room.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

function Notifications() {
  const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
  const API_PORT = process.env.REACT_APP_API_PORT || "4444";

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchNotificationList = async () => {
      try {
        const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/groups/getRequests`, {
          method: "GET",
          credentials: "include",
        });
        console.log("Response: ", response);
        if (response.ok) {
          const { requests } = await response.json();
          console.log("Requests: ", requests);
          setNotifications(requests);
        } else {
          console.log("Error in fetching notifications list");
        }
      } catch (error) {
        console.log("Error in fetching notifications list: ", error);
      }
    };
    fetchNotificationList();
  }, [refresh, API_ADDRESS, API_PORT]);

  const handleAccept = async (requestId, groupId, userId) => {
    try {
      const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/groups/acceptRequest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: requestId, groupId: groupId, userId: userId }),
      });
      console.log("Response: ", response);
      if (response.ok) {
        console.log("Request accepted");
      } else {
        console.log("Error in accepting request");
      }
    } catch (error) {
      console.log("Error in accepting request: ", error);
    }
  };

  return (
    <div>
      <div className="bg-color">
        <div className="form">
          <button type="button" onClick={() => navigate("/home")}>
            Back
          </button>
          <h1>Notifications</h1>
          <div>
            {Array.isArray(notifications) && notifications.map((noti, index) => (
              <div key={index} className="group-row">
                <span>
                  {noti.userEmail} - {noti.userName} wants to join {noti.groupName}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await handleAccept(noti._id, noti.groupId, noti.userId);
                    console.log(`${noti.userName} added to ${noti.groupName} by ${user.uname}`);
                    setRefresh(!refresh);
                  }}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
