// src/services/summaryService.js

import { getIncomes, getTotalIncome } from './incomeService';
import { getExpenses, getTotalExpense } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../utils/constants';

/**
 * Получает общий баланс (доходы минус расходы)
 * @returns {Object} - Объект с totalIncome, totalExpense, balance
 */
export const getBalance = () => {
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const balance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
  };
};

/**
 * Получает суммы по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' | 'expense')
 * @returns {Array} - Массив объектов {id, name, value, color}
 */
export const getByCategory = (type = 'expense') => {
  const transactions = type === 'income' ? getIncomes() : getExpenses();
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Группируем суммы по категориям
  const categoryTotals = {};

  (transactions || []).forEach((transaction) => {
    const categoryId = transaction.category;
    if (!categoryId) return;

    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = 0;
    }
    categoryTotals[categoryId] += transaction.amount || 0;
  });

  // Формируем массив для графика
  const result = categories
    .map((category) => ({
      id: category.id,
      name: category.label,
      value: categoryTotals[category.id] || 0,
      icon: CATEGORY_ICONS[category.id] || '📦',
    }))
    .filter((item) => item.value > 0) // Только непустые категории
    .sort((a, b) => b.value - a.value); // Сортируем по убыванию суммы

  return result;
};

/**
 * Получает месячную сводку для столбчатого графика
 * @param {number} monthsCount - Количество последних месяцев (по умолчанию 6)
 * @returns {Array} - Массив объектов {month, income, expense}
 */
export const getMonthlySummary = (monthsCount = 6) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  // Генерируем список последних N месяцев
  const months = [];
  const today = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Формат ключа: YYYY-MM
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;

    // Формат названия: "янв 2026"
    const label = date.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });

    months.push({
      key,
      label,
      year,
      month,
      income: 0,
      expense: 0,
    });
  }

  // Считаем доходы по месяцам
  (incomes || []).forEach((income) => {
    const date = new Date(income.date);
    if (isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthData = months.find((m) => m.key === key);

    if (monthData) {
      monthData.income += income.amount || 0;
    }
  });

  // Считаем расходы по месяцам
  (expenses || []).forEach((expense) => {
    const date = new Date(expense.date);
    if (isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthData = months.find((m) => m.key === key);

    if (monthData) {
      monthData.expense += expense.amount || 0;
    }
  });

  // Формируем результат для графика
  return months.map((m) => ({
    month: m.label,
    income: m.income,
    expense: m.expense,
  }));
};

/**
 * Получает последние N операций (доходы + расходы, отсортированные по дате)
 * @param {number} limit - Количество операций (по умолчанию 5)
 * @returns {Array} - Массив объектов операций
 */
export const getRecentTransactions = (limit = 5) => {
  const incomes = getIncomes();
  const expenses = getExpenses();

  // Объединяем и сортируем по дате
  const allTransactions = [...incomes, ...expenses].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });

  return allTransactions.slice(0, limit);
};

/**
 * Получает все операции с возможностью фильтрации
 * @param {Object} filters - Объект фильтров {period, type}
 * @returns {Array} - Отфильтрованный массив операций
 */
export const getFilteredTransactions = (filters = {}) => {
  const { period = 'all', type = 'all' } = filters;

  let transactions = [];

  // Получаем операции по типу
  if (type === 'income') {
    transactions = getIncomes();
  } else if (type === 'expense') {
    transactions = getExpenses();
  } else {
    transactions = [...getIncomes(), ...getExpenses()];
  }

  // Фильтруем по периоду
  const now = new Date();
  let startDate = null;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = null;
  }

  if (startDate) {
    transactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date || t.createdAt);
      return transactionDate >= startDate;
    });
  }

  // Сортируем по дате (новые сначала)
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });
};