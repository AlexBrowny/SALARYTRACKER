// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Импортируем стили страницы
import styles from './Analytics.module.css';

// Импортируем компоненты графиков
import PieChartComponent from '../../components/PieChart/PieChart';
import BarChartComponent from '../../components/BarChart/BarChart';

// Импортируем сервисы
import { getByCategory, getMonthlySummary } from '../../services/summaryService';

// Палитра цветов для круговой диаграммы
const CHART_COLORS = [
  '#4f7cff',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#84cc16',
];

function Analytics() {
  // Состояния данных для графиков
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  // Функция загрузки данных
  const loadData = useCallback(() => {
    // Получаем данные по категориям для круговой диаграммы
    const categoryData = getByCategory('expense');
    
    // Добавляем цвета к данным
    const pieDataWithColors = categoryData.map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
    
    setPieData(pieDataWithColors);

    // Получаем месячную сводку для столбчатого графика
    const monthlyData = getMonthlySummary(6);
    setBarData(monthlyData);
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className={styles.analytics}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        {/* Круговая диаграмма расходов по категориям */}
        <PieChartComponent
          data={pieData}
          title="Расходы по категориям"
        />

        {/* Столбчатый график доходов и расходов по месяцам */}
        <BarChartComponent
          data={barData}
          title="Доходы и расходы по месяцам"
        />
      </div>
    </div>
  );
}

export default Analytics;