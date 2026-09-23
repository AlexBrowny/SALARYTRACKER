// src/pages/Analytics/Analytics.jsx
import React from 'react';

// Импортируем стили страницы
import styles from './Analytics.module.css';

function Analytics() {
  // Временная заглушка для PieChart (будет заменена на компонент PieChart)
  const PieChartPlaceholder = () => (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Расходы по категориям</h2>
      <div className={styles.chartArea}>
        <div className={styles.chartPlaceholder}>
          <div className={styles.placeholderIcon}>🥧</div>
          <div className={styles.placeholderText}>
            Графики появятся после подключения данных
          </div>
        </div>
      </div>
    </div>
  );

  // Временная заглушка для BarChart (будет заменена на компонент BarChart)
  const BarChartPlaceholder = () => (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
      <div className={styles.chartArea}>
        <div className={styles.chartPlaceholder}>
          <div className={styles.placeholderIcon}>📊</div>
          <div className={styles.placeholderText}>
            Графики появятся после подключения данных
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.analytics}>
      {/* Заголовок страницы */}
      <h1 className={styles.title}>Аналитика</h1>

      {/* Сетка графиков */}
      <div className={styles.chartsGrid}>
        <PieChartPlaceholder />
        <BarChartPlaceholder />
      </div>
    </div>
  );
}

export default Analytics;