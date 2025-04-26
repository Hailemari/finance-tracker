import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import FinancialSummary from '../components/FinancialSummary';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { getDocumentsByUser } = useFirestore('transactions');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const fetchTransactions = async () => {
    if (currentUser) {
      setLoading(true);
      const data = await getDocumentsByUser(currentUser.uid);
      setTransactions(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);
  
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !transaction.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (dateRange.startDate && new Date(transaction.date) < new Date(dateRange.startDate)) {
      return false;
    }
    
    if (dateRange.endDate && new Date(transaction.date) > new Date(dateRange.endDate)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
      
      <FinancialSummary transactions={transactions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyChart transactions={transactions} />
        <div className="grid grid-cols-1 gap-6">
          <CategoryChart transactions={transactions} type="expense" />
          <CategoryChart transactions={transactions} type="income" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <AddTransactionForm onTransactionAdded={fetchTransactions} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label>Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-3 py-1 w-full"
                />
              </div>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label>From:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="border rounded px-2 py-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label>To:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="border rounded px-2 py-1"
                />
              </div>
              
              <button
                onClick={() => setDateRange({ startDate: '', endDate: '' })}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Clear Dates
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <p>Loading transactions...</p>
              </div>
            ) : (
              <TransactionList 
                transactions={filteredTransactions} 
                onUpdate={fetchTransactions} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
