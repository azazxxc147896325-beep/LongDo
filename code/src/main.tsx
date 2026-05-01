import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { MyListProvider } from './context/MyListContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MyListProvider>
          <App />
        </MyListProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);