import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'; // <-- Import the correct App component with routing
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);