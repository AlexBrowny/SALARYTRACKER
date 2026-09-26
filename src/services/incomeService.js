// src/services/incomeService.js

import { getFromStorage, saveToStorage, generateId, getCurrentTimestamp } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Получает все доходы из localStorage
 * @returns {Array} - Массив объектов доходов
 */
export const getIncomes = () => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  
  // Сортируем по дате (новые сначала)
  return (incomes || []).sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });
};

/**
 * Получает доход по ID
 * @param {string} id - ID дохода
 * @returns {Object|null} - Объект дохода или null
 */
export const getIncomeById = (id) => {
  const incomes = getIncomes();
  return incomes.find((income) => income.id === id) || null;
};

/**
 * Добавляет новый доход
 * @param {Object} incomeData - Данные дохода (type, category, amount, date, comment)
 * @returns {Object} - Созданный объект дохода
 */
export const addIncome = (incomeData) => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  
  // Создаём новый объект дохода
  const newIncome = {
    id: generateId(),
    type: 'income',
    category: incomeData.category,
    amount: parseFloat(incomeData.amount) || 0,
    date: incomeData.date,
    comment: incomeData.comment || '',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
  
  // Добавляем в массив и сохраняем
  incomes.push(newIncome);
  saveToStorage(STORAGE_KEYS.INCOMES, incomes);
  
  return newIncome;
};

/**
 * Обновляет существующий доход
 * @param {string} id - ID дохода для обновления
 * @param {Object} incomeData - Новые данные дохода
 * @returns {Object|null} - Обновлённый объект дохода или null
 */
export const updateIncome = (id, incomeData) => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  const index = incomes.findIndex((income) => income.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Обновляем данные
  incomes[index] = {
    ...incomes[index],
    category: incomeData.category ?? incomes[index].category,
    amount: parseFloat(incomeData.amount) ?? incomes[index].amount,
    date: incomeData.date ?? incomes[index].date,
    comment: incomeData.comment ?? incomes[index].comment,
    updatedAt: getCurrentTimestamp(),
  };
  
  // Сохраняем обновлённый массив
  saveToStorage(STORAGE_KEYS.INCOMES, incomes);
  
  return incomes[index];
};

/**
 * Удаляет доход по ID
 * @param {string} id - ID дохода для удаления
 * @returns {boolean} - Успешность операции
 */
export const deleteIncome = (id) => {
  const incomes = getFromStorage(STORAGE_KEYS.INCOMES, []);
  const filteredIncomes = incomes.filter((income) => income.id !== id);
  
  // Если количество не изменилось — значит, доход не найден
  if (filteredIncomes.length === incomes.length) {
    return false;
  }
  
  // Сохраняем отфильтрованный массив
  saveToStorage(STORAGE_KEYS.INCOMES, filteredIncomes);
  
  return true;
};

/**
 * Получает общую сумму всех доходов
 * @returns {number} - Общая сумма доходов
 */
export const getTotalIncome = () => {
  const incomes = getIncomes();
  return incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
};