// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Импортируем стили страницы
import styles from './Dashboard.module.css';

// Импортируем компоненты
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

// Импортируем сервисы
import { getBalance, getRecentTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';

function Dashboard() {
  // Состояния данных
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Функция загрузки данных
  const loadData = useCallback(() => {
    setBalance(getBalance());
    setRecentTransactions(getRecentTransactions(5));
  }, []);

  // Загружаем данные при монтировании
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

  // Определяем заголовок модалки
  const modalTitle = editData
    ? `Редактирование ${editData.type === 'income' ? 'дохода' : 'расхода'}`
    : 'Новая операция';

  return (
    <div className={styles.dashboard}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Главная</h1>

      {/* Сетка карточек баланса */}
      <div className={styles.cardsGrid}>
        <BalanceCard
          title="Доходы"
          amount={balance.totalIncome}
          type="income"
        />
        <BalanceCard
          title="Расходы"
          amount={balance.totalExpense}
          type="expense"
        />
        <BalanceCard
          title="Баланс"
          amount={balance.balance}
          type="balance"
        />
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <Link to="/history" className={styles.viewAllLink}>
            Показать все →
          </Link>
        </div>

        {/* Список последних операций */}
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTransaction}
          onAdd={handleOpenAddModal}
        />
      </div>

      {/* Плавающая кнопка добавления операции */}
      <button
        className={styles.addButton}
        onClick={handleOpenAddModal}
        aria-label="Добавить операцию"
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

export default Dashboard;