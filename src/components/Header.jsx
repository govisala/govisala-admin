// components/Header.jsx
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function Header({ onToggleSidebar, onLogout }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 p-2 rounded-md md:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-2 md:ml-0">
            GoviSala Admin
          </h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <BellIcon className="h-6 w-6" />
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                <div className="py-2 px-4 text-sm font-medium border-b border-gray-200">
                  Notifications
                </div>
                <div className="py-2 px-4 text-sm text-gray-700">
                  No new notifications
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
