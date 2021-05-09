import { SocketContext } from './socket-context';
import logo from './logo.svg';
import './App.css';
import { useCallback, useContext, useEffect, useState } from 'react';

function App() {
  const socket = useContext(SocketContext);
  const [userMessage, setUserMessage] = useState('');
  const [room, setRoom] = useState('teste');
  const handleMessage = useCallback((message) => {
    console.log(message);
  }, []);

  useEffect(() => {
    socket.emit('join', room);
    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, handleMessage, room]);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' width={50} />
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
        <button
          onClick={() => {
            socket.emit('join', room);
          }}
        >
          Join test room
        </button>
      </header>
    </div>
  );
}

export default App;
