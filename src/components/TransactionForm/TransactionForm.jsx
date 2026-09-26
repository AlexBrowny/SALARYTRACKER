// src/components/TransactionForm/TransactionForm.jsx
import React, { useState, useEffect } from 'react';

// Импортируем стили формы
import styles from './TransactionForm.module.css';

// Fallback-категории (будут заменены на импорт из constants.js)
const FALLBACK_INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

const FALLBACK_EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

// Пробуем импортировать реальные константы, иначе используем fallback
let INCOME_CATEGORIES = FALLBACK_INCOME_CATEGORIES;
let EXPENSE_CATEGORIES = FALLBACK_EXPENSE_CATEGORIES;

try {
  // eslint-disable-next-line no-undef
  const constants = require('../../utils/constants.js');
  INCOME_CATEGORIES = constants.INCOME_CATEGORIES ?? FALLBACK_INCOME_CATEGORIES;
  EXPENSE_CATEGORIES = constants.EXPENSE_CATEGORIES ?? FALLBACK_EXPENSE_CATEGORIES;
} catch {
  // Файл constants.js ещё не создан — используем fallback
}

// Получаем список категорий в зависимости от типа операции
const getCategoriesByType = (type) => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};

// Получаем сегодняшнюю дату в формате YYYY-MM-DD для input[type="date"]
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function TransactionForm({ onSubmit, onCancel, editData = null }) {
  // Определяем, режим редактирования или создания
  const isEditing = !!editData;

  // Состояние формы
  const [type, setType] = useState(editData?.type || 'expense');
  const [category, setCategory] = useState(editData?.category || '');
  const [amount, setAmount] = useState(editData?.amount?.toString() || '');
  const [date, setDate] = useState(editData?.date || getTodayString());
  const [comment, setComment] = useState(editData?.comment || '');

  // Ошибки валидации
  const [errors, setErrors] = useState({});

  // Сбрасываем категорию при смене типа операции
  useEffect(() => {
    const categories = getCategoriesByType(type);
    // Если текущая категория не входит в новый список — сбрасываем
    if (!categories.find((c) => c.id === category)) {
      setCategory(categories[0]?.id || '');
    }
  }, [type]);

  // Валидация формы
  const validate = () => {
    const newErrors = {};

    if (!category) {
      newErrors.category = 'Выберите категорию';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Введите корректную сумму';
    }

    if (!date) {
      newErrors.date = 'Укажите дату';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    // Формируем объект операции
    const transactionData = {
      type,
      category,
      amount: parseFloat(amount),
      date,
      comment: comment.trim(),
    };

    // Если редактирование — передаём id
    if (isEditing && editData?.id) {
      transactionData.id = editData.id;
    }

    onSubmit?.(transactionData);
  };

  // Доступные категории для текущего типа
  const availableCategories = getCategoriesByType(type);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.typeSwitcher}>
        <button
          type="button"
          className={`${styles.typeButton} ${
            type === 'income' ? styles.typeButtonActiveIncome : ''
          }`}
          onClick={() => setType('income')}
        >
          ↑ Доход
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${
            type === 'expense' ? styles.typeButtonActiveExpense : ''
          }`}
          onClick={() => setType('expense')}
        >
          ↓ Расход
        </button>
      </div>

      {/* Категория */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="category">
          Категория<span className={styles.required}>*</span>
        </label>
        <select
          id="category"
          className={`${styles.select} ${errors.category ? styles.selectError : ''}`}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (errors.category) {
              setErrors((prev) => ({ ...prev, category: '' }));
            }
          }}
        >
          <option value="">Выберите категорию</option>
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className={styles.errorMessage}>{errors.category}</span>
        )}
      </div>

      {/* Сумма и дата в одной строке */}
      <div className={styles.row}>
        {/* Сумма */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="amount">
            Сумма (₽)<span className={styles.required}>*</span>
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`${styles.input} ${errors.amount ? styles.inputError : ''}`}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: '' }));
              }
            }}
          />
          {errors.amount && (
            <span className={styles.errorMessage}>{errors.amount}</span>
          )}
        </div>

        {/* Дата */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="date">
            Дата<span className={styles.required}>*</span>
          </label>
          <input
            id="date"
            type="date"
            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) {
                setErrors((prev) => ({ ...prev, date: '' }));
              }
            }}
          />
          {errors.date && (
            <span className={styles.errorMessage}>{errors.date}</span>
          )}
        </div>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="comment">
          Комментарий
        </label>
        <textarea
          id="comment"
          className={styles.textarea}
          placeholder="Необязательное описание операции..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <span className={styles.hint}>Необязательное поле</span>
      </div>

      {/* Кнопки действий */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {isEditing ? 'Сохранить изменения' : 'Добавить операцию'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;