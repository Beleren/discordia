import { useState } from 'react';
import axios from 'axios';
import Chat from './Chat';
import './App.css';

function App() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [token, setToken] = useState('');
  return (
    <div className='App'>
      <header className='App-header'>
        {token ? (
          <Chat />
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const authResult = await axios.post(
                'http://localhost:8084/auth/login',
                form
              );
              setToken(authResult.data.access_token);
            }}
          >
            <input
              placeholder='username'
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  username: e.target.value
                }))
              }
            />
            <input
              placeholder='password'
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  password: e.target.value
                }))
              }
            />
            <button type='submit'>Submit</button>
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
