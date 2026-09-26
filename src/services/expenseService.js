// src/services/expenseService.js

import { getFromStorage, saveToStorage, generateId, getCurrentTimestamp } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Получает все расходы из localStorage
 * @returns {Array} - Массив объектов расходов
 */
export const getExpenses = () => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  
  // Сортируем по дате (новые сначала)
  return (expenses || []).sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });
};

/**
 * Получает расход по ID
 * @param {string} id - ID расхода
 * @returns {Object|null} - Объект расхода или null
 */
export const getExpenseById = (id) => {
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id) || null;
};

/**
 * Добавляет новый расход
 * @param {Object} expenseData - Данные расхода (type, category, amount, date, comment)
 * @returns {Object} - Созданный объект расхода
 */
export const addExpense = (expenseData) => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  
  // Создаём новый объект расхода
  const newExpense = {
    id: generateId(),
    type: 'expense',
    category: expenseData.category,
    amount: parseFloat(expenseData.amount) || 0,
    date: expenseData.date,
    comment: expenseData.comment || '',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
  
  // Добавляем в массив и сохраняем
  expenses.push(newExpense);
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  
  return newExpense;
};

/**
 * Обновляет существующий расход
 * @param {string} id - ID расхода для обновления
 * @param {Object} expenseData - Новые данные расхода
 * @returns {Object|null} - Обновлённый объект расхода или null
 */
export const updateExpense = (id, expenseData) => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  const index = expenses.findIndex((expense) => expense.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Обновляем данные
  expenses[index] = {
    ...expenses[index],
    category: expenseData.category ?? expenses[index].category,
    amount: parseFloat(expenseData.amount) ?? expenses[index].amount,
    date: expenseData.date ?? expenses[index].date,
    comment: expenseData.comment ?? expenses[index].comment,
    updatedAt: getCurrentTimestamp(),
  };
  
  // Сохраняем обновлённый массив
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  
  return expenses[index];
};

/**
 * Удаляет расход по ID
 * @param {string} id - ID расхода для удаления
 * @returns {boolean} - Успешность операции
 */
export const deleteExpense = (id) => {
  const expenses = getFromStorage(STORAGE_KEYS.EXPENSES, []);
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);
  
  // Если количество не изменилось — значит, расход не найден
  if (filteredExpenses.length === expenses.length) {
    return false;
  }
  
  // Сохраняем отфильтрованный массив
  saveToStorage(STORAGE_KEYS.EXPENSES, filteredExpenses);
  
  return true;
};

/**
 * Получает общую сумму всех расходов
 * @returns {number} - Общая сумма расходов
 */
export const getTotalExpense = () => {
  const expenses = getExpenses();
  return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
};