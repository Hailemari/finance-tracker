import { useState, useEffect } from 'react';

export default function FinancialSummary({ transactions }) {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  
  useEffect(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpense;
    
    setSummary({ totalIncome, totalExpense, balance });
  }, [transactions]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h3>
        <p className="text-2xl font-bold text-green-600">
          ${summary.totalIncome.toFixed(2)}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600">
          ${summary.totalExpense.toFixed(2)}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Balance</h3>
        <p className={`text-2xl font-bold ${
          summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          ${summary.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}