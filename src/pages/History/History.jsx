// src/pages/History/History.jsx
import React, { useState } from 'react';

// Импортируем стили страницы
import styles from './History.module.css';

function History() {
  // Состояния фильтров (пока не подключены к реальным данным)
  const [period, setPeriod] = useState('all');
  const [type, setType] = useState('all');

  // Временная заглушка для TransactionList (будет заменена на компонент TransactionList)
  const TransactionListPlaceholder = () => (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Заголовок таблицы */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 140px 120px 80px',
          gap: 'var(--spacing-md)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'var(--color-bg-muted)',
          borderBottom: '1px solid var(--color-border)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <div>Дата</div>
        <div>Категория</div>
        <div>Комментарий</div>
        <div style={{ textAlign: 'right' }}>Сумма</div>
        <div style={{ textAlign: 'center' }}>Действия</div>
      </div>

      {/* Пустое состояние внутри таблицы */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-2xl)',
          gap: 'var(--spacing-md)',
        }}
      >
        <div style={{ fontSize: '48px' }}>📋</div>
        <div
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Нет операций
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            maxWidth: '320px',
          }}
        >
          {period !== 'all' || type !== 'all'
            ? 'По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры.'
            : 'Добавьте первую операцию, чтобы начать учёт финансов.'}
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
    </div>
  );

  return (
    <div className={styles.history}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>История операций</h1>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        {/* Фильтр по периоду */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="period-filter">
            Период
          </label>
          <select
            id="period-filter"
            className={styles.filterSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="all">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>

        {/* Фильтр по типу операции */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="type-filter">
            Тип
          </label>
          <select
            id="type-filter"
            className={styles.filterSelect}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        <TransactionListPlaceholder />
      </div>
    </div>
  );
}

export default History;