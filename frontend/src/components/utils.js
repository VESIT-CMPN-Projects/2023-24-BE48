// Desc: Utility functions for the frontend

import EventSource from "eventsource";

const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || "4444";

// Query all messages. Used when the page is loaded and whenever a new message is sent
const getGroupMessages = async (groupId) => {
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/groups/${groupId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      return { error: response.error };
    }
    const result = await response.json();
    const data = result.result;
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

const getUserGroups = async () => {
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/groups`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

const convertIdToDate = (id) => {
  const timestamp = parseInt(id, 10);
  if (!isNaN(timestamp)) {
    let date = new Date(timestamp);
    date = date.toISOString();
    const format_date = date.split("T");
    const curr_time = format_date[1].split(":");
    const curr_hour = curr_time[0];
    const curr_min = curr_time[1];
    const final_time = curr_hour + ":" + curr_min;
    return final_time;
  }
  return null;
};

const getSenderName = async (senderId) => {
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/senderName`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ senderId: senderId }),
    });
    const { senderName } = await response.json();
    return { senderName };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

// Event listener used to update the chat when a new message is sent
const setUpEventSource = (setMessages, groupId) => {
  const eventSource = new EventSource(`http://${API_ADDRESS}:${API_PORT}/api/events/${groupId}`);

  eventSource.onmessage = async () => {
    const response = await getGroupMessages(groupId);
    if (response.error) {
      console.error("Error:", response.error);
      return;
    }
    setMessages(response.data);
  };

  eventSource.onerror = (error) => {
    console.log("EventSource failed: ", error);
    eventSource.close();
  };

  return eventSource;
};

// Creates a new asset
const createAsset = async (text, isFile, fileName, fileHash, fileSize) => {
  const data = {
    text: text,
    isFile: isFile,
    fileName: fileName,
    fileHash: fileHash,
    fileSize: fileSize,
  };
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) {
      return { error: response.error };
    }
    const result = await response.json();
    return { message: result.message };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

const handleFileUpload = async (message, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/uploadFile`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) {
      return { error: response.error };
    }
    const result = await response.json();
    const msgResult = await createAsset("", "true", message, result.fileHash, file.size);
    if (msgResult.error) {
      return { error: msgResult.error };
    }
    return { message: msgResult.message };
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

const handleFileDownload = async (fileName, fileHash) => {
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/chat/downloadFile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileHash, fileName }),
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Error:", response.error);
      return { error: response.error };
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
};

const handleLogout = async () => {
  try {
    const response = await fetch(`http://${API_ADDRESS}:${API_PORT}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      console.log("Logout successful");
      return true;
    }
    console.log("Logout failed");
    return false;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export {
  getGroupMessages,
  getUserGroups,
  getSenderName,
  convertIdToDate,
  setUpEventSource,
  createAsset,
  handleFileUpload,
  handleFileDownload,
  handleLogout,
};
