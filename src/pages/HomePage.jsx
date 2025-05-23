import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Personal Finance Tracker
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-700">
            Take control of your finances. Track income and expenses, analyze spending patterns, and achieve your financial goals.
          </p>
          {currentUser ? (
            <div className="mt-10">
              <Link
                to="/dashboard"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex justify-center space-x-6">
              <Link
                to="/login"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
        {!currentUser && (
          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
              Features
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Transactions</h3>
                <p className="text-gray-800">
                  Easily record your income and expenses. Categorize transactions to understand where your money goes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Reports</h3>
                <p className="text-gray-800">
                  Visualize your spending patterns with interactive charts. See monthly summaries and category breakdowns.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Insights</h3>
                <p className="text-gray-800">
                  Get insights into your financial health. Track balances, monitor trends, and improve your financial habits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}