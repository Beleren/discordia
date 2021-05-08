import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

function App() {
  const socket = io('http://localhost:3001');
  socket.on('connect_error', function (e) {
    console.log('erro', e);
  });
  socket.on('connect', function () {
    console.log('Connected');

    socket.emit('events', 0, (response) =>
      console.log('Identity:', response)
    );
  });
  socket.on('events', function (data) {
    console.log('event', data);
  });
  socket.on('exception', function (data) {
    console.log('event', data);
  });
  socket.on('disconnect', function () {
    console.log('Disconnected');
  });
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
      <button
        onClick={() => {
          console.log('emiting message');
          socket.emit('events', { test: 'aaaa' });
        }}
      >
        balbal
      </button>
    </div>
  );
}

export default App;
