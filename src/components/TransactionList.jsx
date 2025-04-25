import { useState } from 'react';
import { format } from 'date-fns';
import { useFirestore } from '../hooks/useFirestore';

export default function TransactionList({ transactions, onUpdate }) {
  const { deleteDocument, updateDocument } = useFirestore('transactions');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    description: '',
    category: '',
    date: '',
    type: ''
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteDocument(id);
      if (onUpdate) onUpdate();
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type
    });
  };

  const handleSave = async () => {
    await updateDocument(editingId, {
      amount: parseFloat(editForm.amount),
      description: editForm.description,
      category: editForm.category,
      date: editForm.date,
      type: editForm.type
    });
    
    setEditingId(null);
    if (onUpdate) onUpdate();
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (!transactions.length) {
    return <p className="text-center text-gray-500 my-4">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
              {editingId === transaction.id ? (
                <>
                  <td className="py-3 px-6">
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end">
                      <select 
                        value={editForm.type}
                        onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                        className="mr-2 px-2 py-1 border rounded"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                        step="0.01"
                        className="w-24 px-2 py-1 border rounded text-right"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button 
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-6">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-6">{transaction.description}</td>
                  <td className="py-3 px-6">{transaction.category}</td>
                  <td className={`py-3 px-6 text-right font-medium ${
                    transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button 
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}