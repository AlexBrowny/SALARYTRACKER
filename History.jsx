// src/pages/History/History.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Импортируем стили страницы
import styles from './History.module.css';

// Импортируем компоненты
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

// Импортируем сервисы
import { getFilteredTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';

function History() {
  // Состояния фильтров
  const [period, setPeriod] = useState('all');
  const [type, setType] = useState('all');

  // Состояние данных
  const [transactions, setTransactions] = useState([]);

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Функция загрузки данных с учётом фильтров
  const loadData = useCallback(() => {
    const filtered = getFilteredTransactions({ period, type });
    setTransactions(filtered);
  }, [period, type]);

  // Загружаем данные при монтировании и при изменении фильтров
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Обработчик открытия модалки добавления
  const handleOpenAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  // Обработчик открытия модалки редактирования
  const handleOpenEditModal = (transaction) => {
    setEditData(transaction);
    setIsModalOpen(true);
  };

  // Обработчик закрытия модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Обработчик отправки формы
  const handleSubmitForm = (transactionData) => {
    try {
      if (editData) {
        // Режим редактирования
        if (editData.type === 'income') {
          updateIncome(editData.id, transactionData);
        } else {
          updateExpense(editData.id, transactionData);
        }
      } else {
        // Режим добавления
        if (transactionData.type === 'income') {
          addIncome(transactionData);
        } else {
          addExpense(transactionData);
        }
      }

      // Закрываем модалку и обновляем данные
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Ошибка при сохранении операции:', error);
      alert('Не удалось сохранить операцию. Попробуйте ещё раз.');
    }
  };

  // Обработчик удаления операции
  const handleDeleteTransaction = (id) => {
    if (!window.confirm('Удалить эту операцию?')) {
      return;
    }

    try {
      // Пытаемся удалить как доход, если не получилось — как расход
      const deletedIncome = deleteIncome(id);
      if (!deletedIncome) {
        deleteExpense(id);
      }

      // Обновляем данные
      loadData();
    } catch (error) {
      console.error('Ошибка при удалении операции:', error);
      alert('Не удалось удалить операцию. Попробуйте ещё раз.');
    }
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setPeriod('all');
    setType('all');
  };

  // Проверяем, активны ли фильтры
  const hasActiveFilters = period !== 'all' || type !== 'all';

  // Определяем заголовок модалки
  const modalTitle = editData
    ? `Редактирование ${editData.type === 'income' ? 'дохода' : 'расхода'}`
    : 'Новая операция';

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

        {/* Кнопка сброса фильтров */}
        {hasActiveFilters && (
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>&nbsp;</span>
            <button
              className={styles.filterSelect}
              onClick={handleResetFilters}
              style={{
                cursor: 'pointer',
                backgroundColor: 'var(--color-expense-soft)',
                color: 'var(--color-expense)',
                border: '1px solid var(--color-expense)',
                fontWeight: 500,
              }}
            >
              ✕ Сбросить
            </button>
          </div>
        )}
      </div>

      {/* Счётчик операций */}
      <div
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {transactions.length > 0
          ? `Найдено операций: ${transactions.length}`
          : 'Нет операций'}
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        <TransactionList
          transactions={transactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTransaction}
          onAdd={handleOpenAddModal}
        />
      </div>

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        onClick={handleOpenAddModal}
        aria-label="Добавить операцию"
        style={{
          position: 'fixed',
          bottom: 'var(--spacing-xl)',
          right: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-text-inverse)',
          fontSize: '28px',
          fontWeight: 300,
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all var(--transition-fast)',
          zIndex: 50,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        <TransactionForm
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          editData={editData}
        />
      </Modal>
    </div>
  );
}

export default History;