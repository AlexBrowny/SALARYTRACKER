// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Импортируем стили страницы
import styles from './Dashboard.module.css';

function Dashboard() {
  // Временные данные-заглушки (будут заменены на реальные данные из сервисов)
  const balanceData = [
    { id: 'income', title: 'Доходы', amount: 0, color: 'var(--color-income)', bg: 'var(--color-income-soft)' },
    { id: 'expense', title: 'Расходы', amount: 0, color: 'var(--color-expense)', bg: 'var(--color-expense-soft)' },
    { id: 'balance', title: 'Баланс', amount: 0, color: 'var(--color-balance)', bg: 'var(--color-balance-soft)' },
  ];

  // Временные заглушки для карточек (будут заменены на компонент BalanceCard)
  const BalanceCardPlaceholder = ({ title, amount, color, bg }) => (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 700,
        }}
      >
        {title === 'Доходы' ? '↑' : title === 'Расходы' ? '↓' : '₽'}
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        {title}
      </div>
      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color }}>
        {amount.toLocaleString('ru-RU')} ₽
      </div>
    </div>
  );

  // Временная заглушка для EmptyState (будет заменена на компонент EmptyState)
  const EmptyStatePlaceholder = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl)',
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-strong)',
        textAlign: 'center',
        gap: 'var(--spacing-md)',
      }}
    >
      <div style={{ fontSize: '48px' }}>📭</div>
      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        Нет операций
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        Добавьте первую операцию, чтобы начать учёт финансов
      </div>
      <button
        style={{
          marginTop: 'var(--spacing-sm)',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 500,
          transition: 'background-color var(--transition-fast)',
        }}
        onClick={() => alert('Модалка добавления появится позже')}
      >
        Добавить операцию
      </button>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Главная</h1>

      {/* Сетка карточек баланса */}
      <div className={styles.cardsGrid}>
        {balanceData.map((card) => (
          <BalanceCardPlaceholder
            key={card.id}
            title={card.title}
            amount={card.amount}
            color={card.color}
            bg={card.bg}
          />
        ))}
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <Link to="/history" className={styles.viewAllLink}>
            Показать все →
          </Link>
        </div>

        {/* Заглушка пустого состояния */}
        <EmptyStatePlaceholder />
      </div>

      {/* Плавающая кнопка добавления операции */}
      <button
        className={styles.addButton}
        onClick={() => alert('Модалка добавления появится позже')}
        aria-label="Добавить операцию"
      >
        +
      </button>
    </div>
  );
}

export default Dashboard;