// src/components/BarChart/BarChart.jsx
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Кастомный tooltip для красивого отображения
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = (payload.find((p) => p.dataKey === 'income')?.value ?? 0).toLocaleString('ru-RU');
    const expense = (payload.find((p) => p.dataKey === 'expense')?.value ?? 0).toLocaleString('ru-RU');

    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          minWidth: '160px',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: '#1a2233',
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          <span style={{ color: '#22c55e' }}>● Доходы:</span>
          <span style={{ fontWeight: 600, color: '#1a2233' }}>{income} ₽</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ color: '#ef4444' }}>● Расходы:</span>
          <span style={{ fontWeight: 600, color: '#1a2233' }}>{expense} ₽</span>
        </div>
      </div>
    );
  }
  return null;
};

// Форматирование значений на оси Y (сокращение больших чисел)
const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
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
    <div style={{ fontSize: '48px' }}>📊</div>
    <div
      style={{
        fontSize: 'var(--font-size-sm)',
        textAlign: 'center',
        maxWidth: '280px',
      }}
    >
      Нет данных для графика. Добавьте операции, чтобы увидеть динамику доходов и расходов по месяцам.
    </div>
  </div>
);

function BarChartComponent({ data = [], title = 'Доходы и расходы по месяцам' }) {
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
          <RechartsBarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              stroke="#5b6b82"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#5b6b82"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 124, 255, 0.05)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '0' }}
            />
            <Bar
              dataKey="income"
              name="Доходы"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              name="Расходы"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartComponent;