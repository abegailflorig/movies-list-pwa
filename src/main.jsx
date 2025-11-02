import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ This renders your React app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ✅ This part registers your Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')  // <-- This is like serviceWorker.register();
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}
