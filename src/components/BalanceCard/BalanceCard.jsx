// src/components/BalanceCard/BalanceCard.jsx
import React from 'react';

// Импортируем стили карточки
import styles from './BalanceCard.module.css';

function BalanceCard({ title, amount = 0, type = 'balance' }) {
  // Определяем классы в зависимости от типа
  const getIconClass = () => {
    switch (type) {
      case 'income':
        return `${styles.icon} ${styles.incomeBg}`;
      case 'expense':
        return `${styles.icon} ${styles.expenseBg}`;
      default:
        return `${styles.icon} ${styles.balanceBg}`;
    }
  };

  const getAmountClass = () => {
    switch (type) {
      case 'income':
        return `${styles.amount} ${styles.income}`;
      case 'expense':
        return `${styles.amount} ${styles.expense}`;
      default:
        return `${styles.amount} ${styles.balance}`;
    }
  };

  // Определяем иконку в зависимости от типа
  const getIcon = () => {
    switch (type) {
      case 'income':
        return '↑';
      case 'expense':
        return '↓';
      default:
        return '₽';
    }
  };

  // Форматируем сумму с разделителями тысяч
  const formattedAmount = (amount ?? 0).toLocaleString('ru-RU');

  return (
    <div className={styles.card}>
      {/* Иконка/индикатор */}
      <div className={getIconClass()}>{getIcon()}</div>

      {/* Заголовок */}
      <div className={styles.title}>{title}</div>

      {/* Сумма */}
      <div className={getAmountClass()}>
        {formattedAmount} ₽
      </div>
    </div>
  );
}

export default BalanceCard;