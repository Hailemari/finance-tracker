import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions, type = 'expense' }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 1
      }
    ]
  });
  
  useEffect(() => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === type);
    
    // Group by category and sum amounts
    const categoryMap = filteredTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});
    
    // Convert to arrays for chart
    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);
    
    // Generate colors
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
      '#FF9F40', '#8AC249', '#EA526F', '#25CED1', '#FCEADE', 
      '#FF8A5B', '#EA9AB2', '#B0DEFF', '#FFD3B6'
    ];
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1
        }
      ]
    });
  }, [transactions, type]);
  
  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  
  const title = type === 'expense' ? 'Expense' : 'Income';
  
  if (chartData.labels.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">{title} by Category</h2>
        <p className="text-gray-500">No {type} data to display</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title} by Category</h2>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}