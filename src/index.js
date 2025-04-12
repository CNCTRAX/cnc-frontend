import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext'; // ✅ Wraps global auth state

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {/* ✅ App is wrapped in Auth Context */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();