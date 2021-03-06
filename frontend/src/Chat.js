import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';

function Chat() {
  const socket = io('http://localhost:8081');
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [room, setRoom] = useState('teste');

  const handleMessage = useCallback((message) => {
    setChatMessages((prevMessages) => {
      if (prevMessages.length >= 50) prevMessages.pop();
      return [message, ...prevMessages];
    });
  }, []);

  useEffect(() => {
    socket.emit('join', room);
    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, handleMessage, room]);
  return (
    <>
      <img src={logo} className='App-logo' alt='logo' width={100} />
      <div style={{ width: '50vw' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userMessage.length > 0) {
              socket.emit('message', { to: room, message: userMessage });
              setUserMessage('');
            }
          }}
        >
          <input
            value={userMessage}
            onChange={({ target: { value } }) => setUserMessage(value)}
          />
          <button type='submit'>Send</button>
        </form>
        <div
          style={{
            border: '1px solid grey',
            height: '40vh',
            overflowY: 'auto'
          }}
        >
          {chatMessages.map((chatMessage) => (
            <p style={{ fontSize: '12px' }}>{chatMessage}</p>
          ))}
        </div>
      </div>

      {/* <button
          onClick={() => {
            socket.emit('join', room);
          }}
        >
          Join test room
        </button> */}
    </>
  );
}

export default Chat;
