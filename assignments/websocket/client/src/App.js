import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const messageRef = useRef();

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log(`Connected with ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected from server`);
    });

    socket.on("newMessage", (data) => {
      setMessageList([...messageList, data]);
    });

    socket.on("updateUserList", (data) => {
      setUserList(data);
    });

    socket.on("systemMessage", (data) => {
      setMessageList([...messageList, { user: "SYSTEM", text: data }]);
    });

    socket.on("roomList", (data) => {
      setRoomList(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("updateUserList");
      socket.off("systemMessage");
      socket.off("roomList");
    };
  }, [socket, messageList]);

  const handleJoinRoom = (roomName) => {
    setRoom(roomName);
    setMessageList([]);
    socket.emit("joinRoom", { username, room: roomName });
  };

  const handleCreateRoom = (roomName) => {
    setRoom(roomName);
    setMessageList([]);
    socket.emit("createRoom", { username, room: roomName });
  };

  const handleSendMessage = () => {
    if (!message) return;

    socket.emit("sendMessage", { user: username, text: message, room });
    setMessage("");
    messageRef.current.focus();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Room:</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <div>
        <button onClick={() => handleJoinRoom(room)}>Join Room</button>
        <button onClick={() => handleCreateRoom(room)}>Create Room</button>
      </div>
      <div>
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={messageRef}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h3>User List:</h3>
        <ul>
          {userList.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  )}
