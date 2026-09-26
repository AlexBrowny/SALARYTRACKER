// src/utils/formatters.js

/**
 * Форматирует дату в локальный формат (ДД.ММ.ГГГГ)
 * @param {string|Date} dateString - Строка даты или объект Date
 * @returns {string} - Отформатированная дата
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return '—';
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирует дату с названием месяца (ДД месяц ГГГГ)
 * @param {string|Date} dateString - Строка даты или объект Date
 * @returns {string} - Отформатированная дата
 */
export const formatDateLong = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '—';
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Форматирует сумму с разделителями тысяч и символом валюты
 * @param {number} amount - Сумма
 * @param {string} type - Тип операции ('income' | 'expense')
 * @returns {string} - Отформатированная сумма
 */
export const formatAmount = (amount, type = 'balance') => {
  const value = (amount ?? 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  if (type === 'expense') {
    return `−${value} ₽`;
  }
  
  if (type === 'income') {
    return `+${value} ₽`;
  }
  
  return `${value} ₽`;
};

/**
 * Форматирует сумму без знака (для графиков)
 * @param {number} amount - Сумма
 * @returns {string} - Отформатированная сумма
 */
export const formatAmountPlain = (amount) => {
  return (amount ?? 0).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Форматирует большие числа для графиков (1K, 1M)
 * @param {number} value - Число
 * @returns {string} - Сокращённое число
 */
export const formatCompactNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

/**
 * Получает название месяца из даты
 * @param {string|Date} dateString - Строка даты или объект Date
 * @returns {string} - Название месяца
 */
export const getMonthName = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('ru-RU', {
      month: 'long',
    });
  } catch {
    return '';
  }
};

/**
 * Получает короткий месяц и год (ММ.ГГГГ)
 * @param {string|Date} dateString - Строка даты или объект Date
 * @returns {string} - Месяц и год
 */
export const getMonthYear = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

/**
 * Возвращает сегодняшнюю дату в формате YYYY-MM-DD для input[type="date"]
 * @returns {string} - Дата в формате ISO
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};