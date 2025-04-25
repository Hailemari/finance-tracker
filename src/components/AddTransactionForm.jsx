import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';

const categories = {
  expense: [
    'Food & Dining', 
    'Shopping', 
    'Housing', 
    'Transportation', 
    'Utilities', 
    'Entertainment', 
    'Healthcare', 
    'Education', 
    'Personal Care', 
    'Travel', 
    'Other'
  ],
  income: [
    'Salary', 
    'Business', 
    'Investments', 
    'Gifts', 
    'Other'
  ]
};

export default function AddTransactionForm({ onTransactionAdded }) {
  const { currentUser } = useAuth();
  const { addDocument } = useFirestore('transactions');
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [type, setType] = useState('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || !description || !category || !date) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    const transaction = {
      amount: parseFloat(amount),
      description,
      category,
      date,
      type,
      userId: currentUser.uid
    };
    
    const result = await addDocument(transaction);
    
    if (result.success) {
      setAmount('');
      setDescription('');
      setCategory(type === 'expense' ? 'Food & Dining' : 'Salary');
      setDate(new Date().toISOString().substr(0, 10));
      if (onTransactionAdded) onTransactionAdded();
    } else {
      setError(result.error || 'Failed to add transaction');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={() => {
                  setType('expense');
                  setCategory('Food & Dining');
                }}
                className="mr-2"
              />
              <span>Expense</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => {
                  setType('income');
                  setCategory('Salary');
                }}
                className="mr-2"
              />
              <span>Income</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this transaction for?"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}