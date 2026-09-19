// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Подключаем глобальные стили (сброс + CSS-переменные)
import './styles/global.css';

// Находим корневой элемент, созданный Vite в index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Не найден элемент #root в index.html');
}

// Рендерим приложение в StrictMode для проверки безопасных паттернов
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);