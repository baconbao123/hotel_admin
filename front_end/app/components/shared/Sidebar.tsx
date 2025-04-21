
import { useState } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, Navigate, redirect, useLocation, useNavigate } from 'react-router';
import { navigation } from '../../config/menu.config';

export default function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(current =>
      current.includes(menuName)
        ? current.filter(name => name !== menuName)
        : [...current, menuName]
    );
  };

  const handleCollapse = () => setCollapsed(c => !c);

  // Helper to check if a menu or submenu is active
  const isActive = (href: string) => location.pathname === href;

  const navigate = useNavigate();
  // ... existing code ...
  const handleLogout = () => {
    // TODO: Add your logout logic here (clear tokens, etc.) if needed
    navigate('/login');
  };

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 min-h-screen transition-all duration-200 ${collapsed ? 'w-20' : 'w-56'}`}>
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <img
            src="/logo.svg"
            alt="Novotel"
            className={`transition-all duration-200 ${collapsed ? 'w-8' : 'w-8 mr-2'}`}
          />
          {!collapsed && <span className="text-xl font-bold text-blue-700 tracking-wide">Novotel</span>}
        </div>
        <button
          onClick={handleCollapse}
          className="text-gray-400 hover:text-blue-300 p-1 rounded transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <div>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                      ${active ? 'bg-blue-50 text-blue-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                      ${collapsed ? 'justify-center px-2' : ''}
                    `}
                    onClick={() => item.children && toggleMenu(item.name)}
                  >
                    {item.icon && <item.icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-400'}`} />}
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed && item.children && (
                      <ChevronDownIcon
                        className={`w-4 h-4 ml-auto transition-transform duration-200 ${expandedMenus.includes(item.name) ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                  {/* Submenu */}
                  {!collapsed && item.children && expandedMenus.includes(item.name) && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={child.href}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition
                              ${isActive(child.href) ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}
                            `}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className={`flex items-center px-4 py-4 border-t border-gray-100 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}>
        <img
          className="w-9 h-9 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User avatar"
        />
        {!collapsed && (
          <div className="ml-3">
            <p className="text-base font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-400">admin@hotel.com</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`flex items-center w-full px-4 py-3 border-t border-gray-100 text-red-500 hover:bg-red-50 transition-all duration-200
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        {!collapsed && <span className="ml-3 font-medium cursor-pointer">Logout</span>}
      </button>
    </div>
  );
}