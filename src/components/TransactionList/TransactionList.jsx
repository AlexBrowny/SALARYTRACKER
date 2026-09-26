// src/components/TransactionList/TransactionList.jsx
import React from 'react';

// Импортируем стили таблицы
import styles from './TransactionList.module.css';

// Импортируем компонент EmptyState
import EmptyState from '../EmptyState/EmptyState';

// Временный маппинг категорий (будет заменён на импорт из constants.js)
const CATEGORY_MAP = {
  // Доходы
  salary: { label: 'Зарплата', icon: '💼' },
  freelance: { label: 'Подработка', icon: '💻' },
  bonus: { label: 'Премия', icon: '🎁' },
  debt_return: { label: 'Возврат долга', icon: '🔄' },
  deposit_interest: { label: 'Проценты', icon: '🏦' },
  gift: { label: 'Подарок', icon: '🎉' },
  // Расходы
  groceries: { label: 'Продукты', icon: '🛒' },
  utilities: { label: 'Коммуналка', icon: '💡' },
  rent: { label: 'Аренда', icon: '🏠' },
  subscriptions: { label: 'Подписки', icon: '📱' },
  transport: { label: 'Транспорт', icon: '🚗' },
  health: { label: 'Здоровье', icon: '💊' },
  clothing: { label: 'Одежда', icon: '👕' },
  entertainment: { label: 'Развлечения', icon: '🎬' },
  communication: { label: 'Связь', icon: '📞' },
  other: { label: 'Прочее', icon: '📦' },
};

// Форматирование даты (упрощённое, будет заменено на formatters.js)
const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

// Форматирование суммы
const formatAmount = (amount, type) => {
  const value = (amount ?? 0).toLocaleString('ru-RU');
  return type === 'expense' ? `−${value} ₽` : `+${value} ₽`;
};

function TransactionList({ transactions = [], onEdit, onDelete, onAdd }) {
  // Если операций нет — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы начать учёт финансов"
        actionLabel={onAdd ? 'Добавить операцию' : undefined}
        onAction={onAdd}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {/* Заголовок таблицы */}
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Дата</th>
            <th className={styles.th}>Категория</th>
            <th className={styles.th}>Комментарий</th>
            <th className={`${styles.th} ${styles.thRight}`}>Сумма</th>
            <th className={`${styles.th} ${styles.thCenter}`}>Действия</th>
          </tr>
        </thead>

        {/* Тело таблицы */}
        <tbody className={styles.tbody}>
          {(transactions || []).map((transaction) => {
            const category = CATEGORY_MAP[transaction.category] || {
              label: transaction.category || 'Прочее',
              icon: '📦',
            };
            const isIncome = transaction.type === 'income';

            return (
              <tr key={transaction.id}>
                {/* Дата */}
                <td className={styles.dateCell}>
                  {formatDate(transaction.date)}
                </td>

                {/* Категория */}
                <td>
                  <div className={styles.categoryCell}>
                    <div
                      className={`${styles.categoryBadge} ${
                        isIncome ? styles.badgeIncome : styles.badgeExpense
                      }`}
                    >
                      {category.icon}
                    </div>
                    <span className={styles.categoryLabel}>
                      {category.label}
                    </span>
                  </div>
                </td>

                {/* Комментарий */}
                <td className={styles.commentCell}>
                  {transaction.comment || '—'}
                </td>

                {/* Сумма */}
                <td
                  className={`${styles.amountCell} ${
                    isIncome ? styles.amountIncome : styles.amountExpense
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </td>

                {/* Действия */}
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit(transaction)}
                        aria-label="Редактировать"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete(transaction.id)}
                        aria-label="Удалить"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;