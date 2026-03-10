import { Link } from "react-router-dom";

function Navbar() {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          Dashboard
        </Link>
        <Link to="/teams" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
          Teams
        </Link>
        <button
          onClick={logout}
          className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;