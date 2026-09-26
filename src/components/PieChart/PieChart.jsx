// src/components/PieChart/PieChart.jsx
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Палитра цветов по умолчанию (если в data не передан color)
const DEFAULT_COLORS = [
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

// Кастомный tooltip для красивого отображения
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = (data.value ?? 0).toLocaleString('ru-RU');
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
        }}
      >
        <div style={{ fontWeight: 600, color: '#1a2233' }}>
          {data.name}
        </div>
        <div style={{ color: '#5b6b82' }}>
          {value} ₽
        </div>
      </div>
    );
  }
  return null;
};

// Заглушка для пустого состояния
const EmptyChart = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--color-bg-muted)',
      borderRadius: 'var(--radius-md)',
      border: '2px dashed var(--color-border-strong)',
      gap: 'var(--spacing-md)',
      color: 'var(--color-text-secondary)',
    }}
  >
    <div style={{ fontSize: '48px' }}>🥧</div>
    <div
      style={{
        fontSize: 'var(--font-size-sm)',
        textAlign: 'center',
        maxWidth: '280px',
      }}
    >
      Нет данных для графика. Добавьте расходы, чтобы увидеть распределение по категориям.
    </div>
  </div>
);

function PieChartComponent({ data = [], title = 'Расходы по категориям' }) {
  // Если данных нет — показываем заглушку
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </h2>
        <div style={{ width: '100%', height: '300px' }}>
          <EmptyChart />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h2>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={(entry) => entry.name}
              labelLine={false}
            >
              {(data || []).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartComponent;