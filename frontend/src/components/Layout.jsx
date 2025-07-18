import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {Moon, Sun, Fuel,Home, User, Truck, CalendarArrowDown,} from "lucide-react";



const navItems = [
  { label: "Abastecimientos", icon: <Truck />, to: "/" },
  { label: "Recarga Stock", icon: <Fuel />, to: "/recarga-stock" },
  { label: "Usuarios", icon: <User />, to: "/chofer" },
  { label: "Vehículos", icon: <Truck />, to: "/vehiculo" },
  { label: "Historial Recargas", icon: <CalendarArrowDown />, to: "/recargas" },
  { label: "Historial Filtrado", icon: <CalendarArrowDown />, to: "/historial-filtrado" },
  { label: "Historial Abastecimientos", icon: <CalendarArrowDown />, to: "/historial-abastecimientos" },
  { label: "Dashboard", icon: <Home />, to: "/dashboard" },
];

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 flex justify-center items-center text-center gap-2">
             <span className="text-indigo-400"></span> PANEL ABASTECIMIENTO
          </h1>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>

        

        </div>

        {/* Footer usuario */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-white">Robert</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-8 flex justify-center items-center text-center gap-2">Cia. Agricola Corpus Christi</h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

