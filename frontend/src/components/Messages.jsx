import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { getGroupMessages, convertIdToDate, setUpEventSource } from "./utils";

function Messages({ groupId }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Group Id:", groupId);
      const res = await getGroupMessages(groupId);
      if (res.error) {
        console.error("Error:", res.error);
        alert("Error: " + res.error);
        return;
      }
      console.log("Response: ", res);
      const text = res.data;
      console.log("Messages: ", text);
      setMessages(text);
    };

    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    const eventSource = setUpEventSource(setMessages, groupId);
    return () => {
      console.log("Closing event source");
      eventSource.close();
    };
  }, [setMessages, groupId]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current.scrollIntoView();
    }, 100);
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <Message
          key={index}
          senderId={message.Sender}
          groupId={message.Group}
          data={message.Text}
          timeStamp={convertIdToDate(message.ID)}
          isFile={message.IsFile}
          fileName={message.FileName}
          fileHash={message.FileHash}
          fileSize={message.FileSize}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;
