import { useState } from "react";
import { Moon, Sun, Fuel, Home, User, Truck } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home />, href: "#" },
  { label: "Recargas", icon: <Fuel />, href: "#" },
  { label: "Abastecimientos", icon: <Truck />, href: "#" },
  { label: "Usuarios", icon: <User />, href: "#" },
];

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false); // lo vamos a manejar después

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">🚛 Combustible</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold">Dashboard</h2>

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

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
