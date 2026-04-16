import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const TrafficChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#ffffff', titleColor: '#1e293b', bodyColor: '#64748b', borderColor: '#e2e8f0', borderWidth: 1 }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  const chartData = {
    labels: data.length > 0 ? data.map((d) => d.time) : ['10am','11am','12pm','01am','02am','03am','04am'],
    datasets: [{
      fill: true,
      label: 'Visits',
      data: data.length > 0 ? data.map((d) => d.visits) : [45,39,52,40,55,48,50],
      borderColor: '#3b82f6', // primary blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3b82f6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default TrafficChart;
