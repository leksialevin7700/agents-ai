// App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ChatApp from './components/ChatApp'; // Rename your current App component (see below)

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register  />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
};

export default App;
