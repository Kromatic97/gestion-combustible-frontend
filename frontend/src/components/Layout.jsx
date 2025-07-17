import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Moon, Sun, Fuel, Home, User, Truck, CalendarArrowDown } from "lucide-react";

const navItems = [
  { label: "Abastecimientos", icon: <Truck />, to: "/" },
  { label: "Recarga Stock", icon: <Fuel />, to: "/recarga-stock" },
  { label: "Usuarios", icon: <User />, to: "/chofer" },
  { label: "Vehículos", icon: <Truck />, to: "/vehiculo" },
  { label: "Historial Recargas", icon: <Fuel />, to: "/recargas" },
  { label: "Historial Filtrado", icon: <Date />, to: "/historial-filtrado" },
  { label: "Dashboard", icon: <Home />, to: "/dashboard" },
];

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">🚛 Combustible</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition ${
                  isActive ? "bg-blue-100 font-bold text-blue-700" : "hover:bg-gray-200"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold">Panel</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block">Hola, Robert</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              R
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
