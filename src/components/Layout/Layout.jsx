// src/components/Layout/Layout.jsx
import React from 'react';

// Импортируем стили layout
import styles from './Layout.module.css';

// Импортируем компонент Header
import Header from '../Header/Header';

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      {/* Шапка приложения с навигацией */}
      <Header />

      {/* Основная область контента */}
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;