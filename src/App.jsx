// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Импортируем стили корневого контейнера
import styles from './App.module.css';

// Импортируем реальный Layout
import Layout from './components/Layout/Layout';

// Временные заглушки для страниц (будут заменены на импорты из отдельных файлов)
const DashboardPlaceholder = () => <div>Главная страница (Dashboard)</div>;
const HistoryPlaceholder = () => <div>История операций (History)</div>;
const AnalyticsPlaceholder = () => <div>Аналитика (Analytics)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <DashboardPlaceholder />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout>
              <HistoryPlaceholder />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <AnalyticsPlaceholder />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;