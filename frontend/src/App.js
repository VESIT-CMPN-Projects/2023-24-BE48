import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import Notifications from "./pages/Notification";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./components/UserContext";

function App() {
  const API_ADDRESS = process.env.REACT_APP_API_ADDRESS || "localhost";
  const API_PORT = process.env.REACT_APP_API_PORT || "4444";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleUnload = async (e) => {
      try {
        await fetch(`http://${API_ADDRESS}:${API_PORT}/api/disconnect`, {
          method: "GET",
        });
      } catch (error) {
        console.log("Error disconnecting.....");
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  });

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/create" element={<ProtectedRoute element={<CreateRoom />} />} />
            <Route path="/join" element={<ProtectedRoute element={<JoinRoom />} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
