import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import CreatePoll from './components/CreatePoll';
import { setAuthToken } from './services/api';
import Polls from './components/Polls';

function App() {
  const [token, setToken] = useState(null);

  const handleSignup = (token) => {
    setAuthToken(token);
    setToken(token);
  };

  const handleLogin = (token) => {
    setAuthToken(token);
    setToken(token);
  };

  return (
    <div>
      {!token ? (
        <>
          <h2>Signup</h2>
          <Signup onSignup={handleSignup} />
          <h2>Login</h2>
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <h2>Create Poll</h2>
          <CreatePoll />
          <h2>Polls</h2>
          <Polls />
        </>
      )}
    </div>
  );
}

export default App;





