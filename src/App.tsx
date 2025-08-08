// App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ChatApp from './components/ChatApp';

const App = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('username'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/chat" element={<ChatApp currentUser={currentUser || ''} />} />
      </Routes>
    </Router>
  );
};

export default App;
