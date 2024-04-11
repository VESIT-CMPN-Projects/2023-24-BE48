import React, { useRef, useState } from "react";
import Attach from "../img/attach.png";
import { createAsset, handleFileUpload } from "./utils";

function Input() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  // Create asset with message and set message to empty string
  const handleSendClick = async () => {
    if (file === null && message !== "") {
      const res = await createAsset(message, "false", "", "", "");
      if (res.error) {
        console.error("Error:", res.error);
        alert("Error: " + res.error);
      }
      setMessage("");
    } else {
      const result = await handleFileUpload(message, file);
      if (result.error) {
        console.error("Error:", result.error);
        alert("Error: " + result.error);
      }
      setMessage("");
      setFile(null);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        value={message}
        placeholder="Type something..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <img src={Attach} alt="" onClick={handleAttachClick} />
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        ref={fileInputRef}
        onChange={(event) => {
          const file = event.target.files[0];
          if (file) {
            setMessage(file.name);
            setFile(file);
          }
        }}
      />
      <div className="send">
        <button onClick={handleSendClick}>Send</button>
      </div>
    </div>
  );
}

export default Input;
