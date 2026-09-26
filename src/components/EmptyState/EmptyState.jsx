// src/components/EmptyState/EmptyState.jsx
import React from 'react';

// Импортируем стили заглушки
import styles from './EmptyState.module.css';

function EmptyState({
  title = 'Нет данных',
  description = 'Данные появятся позже',
  actionLabel,
  onAction,
  icon = '📭',
}) {
  return (
    <div className={styles.emptyState}>
      {/* Иконка */}
      <div className={styles.icon}>{icon}</div>

      {/* Заголовок */}
      <div className={styles.title}>{title}</div>

      {/* Описание */}
      <div className={styles.description}>{description}</div>

      {/* Кнопка действия (если передана) */}
      {actionLabel && onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;