import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

function Sidebar({ open, setOpen }) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Users", href: "/users", icon: "👥" },
    { name: "Listings", href: "/listings", icon: "🥕" },
    { name: "Payments", href: "/payments", icon: "💰" },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-300/50 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white transform transition-transform ease-in-out duration-300 md:translate-x-0 md:static md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-green-900">
          <span className="text-xl font-semibold">GoviSala</span>
          <button
            onClick={() => setOpen(false)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-white md:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-5 flex flex-col flex-grow">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-white hover:bg-green-700 rounded-md"
                onClick={() => setOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-green-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                  A
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-green-300">admin@govisala.uor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
