// src/services/storage.js

/**
 * Получает данные из localStorage
 * @param {string} key - Ключ для получения данных
 * @param {any} defaultValue - Значение по умолчанию, если данных нет
 * @returns {any} - Данные из localStorage или defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка при получении данных из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохраняет данные в localStorage
 * @param {string} key - Ключ для сохранения данных
 * @param {any} value - Данные для сохранения
 * @returns {boolean} - Успешность операции
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка при сохранении данных в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Удаляет данные из localStorage
 * @param {string} key - Ключ для удаления данных
 * @returns {boolean} - Успешность операции
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении данных из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

/**
 * Очищает весь localStorage
 * @returns {boolean} - Успешность операции
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка при очистке localStorage:', error);
    return false;
  }
};

/**
 * Генерирует уникальный идентификатор (UUID)
 * @returns {string} - Уникальный идентификатор
 */
export const generateId = () => {
  // Используем crypto.randomUUID(), если доступен
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: генерируем UUID вручную
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Получает текущую дату и время в формате ISO
 * @returns {string} - Дата и время в формате ISO
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};