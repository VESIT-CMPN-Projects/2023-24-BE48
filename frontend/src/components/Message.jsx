import React, { useContext, useEffect, useState } from "react";
import { handleFileDownload } from "./utils";
import { UserContext } from "./UserContext";
import { getSenderName } from "./utils";

function Message({ senderId, data, timeStamp, isFile, fileName, fileHash, fileSize }) {
  const { user } = useContext(UserContext);
  const isOwner = senderId === user._id;
  const fileSizeinMB = parseFloat((fileSize / (1024 * 1024)).toFixed(2));
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    const fetchSenderName = async () => {
      const res = await getSenderName(senderId);
      if (res.error) {
        console.error("Error:", res.error);
        alert("Error: " + res.error);
        return;
      }
      const { name } = res.senderName;
      setSenderName(name);
    };

    fetchSenderName();
  }, [senderId]);

  return (
    <div className={`message ${isOwner ? "owner" : ""}`}>
      <div className="messageInfo">
        {!isOwner && (
          <img
            src="https://images.pexels.com/photos/707344/pexels-photo-707344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        )}
        <span>{timeStamp}</span>
      </div>
      {isFile === "true" ? (
        <div className="fileInfo">
          <div className="senderDetails">
            <h5>{senderName}</h5>
          </div>
          <div className="fileDetails">
            <h4>File: {fileName}</h4>
            <p>Size: {fileSizeinMB} MB</p>
          </div>
          <button className="downloadButton" onClick={() => {
            const res = handleFileDownload(fileName, fileHash);
            if (res.error) {
              console.error("Error:", res.error);
              alert("Error: " + res.error);
            }
          }}>
            Download
          </button>
        </div>
      ) : (
        <div className="messageContent">
          <div className="senderDetails">
            <h5>{senderName}</h5>
          </div>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
}

export default Message;
