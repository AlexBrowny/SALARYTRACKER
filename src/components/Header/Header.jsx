// src/components/Header/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// Импортируем стили из CSS-модуля
import styles from './Header.module.css';

function Header() {
  // Функция для определения класса активной ссылки
  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      {/* Логотип / название приложения */}
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>₽</span>
        <span>Salary Tracker</span>
      </Link>

      {/* Навигационное меню */}
      <nav className={styles.nav}>
        <NavLink to="/" end className={getNavLinkClass}>
          <span className={styles.navIcon}>🏠</span>
          <span>Главная</span>
        </NavLink>

        <NavLink to="/history" className={getNavLinkClass}>
          <span className={styles.navIcon}>📋</span>
          <span>История</span>
        </NavLink>

        <NavLink to="/analytics" className={getNavLinkClass}>
          <span className={styles.navIcon}>📊</span>
          <span>Аналитика</span>
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;