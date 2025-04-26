import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className=" text-xl font-bold !text-white">
            Finance Tracker
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="w-8 h-8 rounded-full bg-white text-indigo-600 font-semibold flex items-center justify-center text-sm uppercase">
                  {currentUser.email.charAt(0)}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
