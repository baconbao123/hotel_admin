
import { useState } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, Navigate, redirect, useLocation, useNavigate } from 'react-router';
import { navigation } from '../../config/menu.config';
import logo from '../../asset/images/logo.png';

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
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 min-h-screen transition-all duration-200 ${collapsed ? 'w-20' : 'w-56'}`}>
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Novotel"
            className={`w-6 transition-all duration-200${!collapsed ? ' mr-2' : ''}`}
          />
          {!collapsed && <span className="text-xl font-bold text-black tracking-wide">Portal Hotel</span>}
        </div>
        <button
          onClick={handleCollapse}
          className="text-gray-500 hover:text-blue-400 p-1 rounded transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

 :<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
 <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


}
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
                  {item.children ? (
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                        ${active ? 'bg-blue-50 text-blue-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                        ${collapsed ? 'justify-center px-2' : ''}
                      `}
                      onClick={() => toggleMenu(item.name)}
                    >
                      {item.icon && <item.icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-400'}`} />}
                      {!collapsed && <span>{item.name}</span>}
                      {!collapsed && (
                        <ChevronDownIcon
                          className={`w-4 h-4 ml-auto transition-transform duration-200 ${expandedMenus.includes(item.name) ? 'rotate-180' : ''}`}
                        />
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                        ${active ? 'bg-blue-50 text-blue-500 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                        ${collapsed ? 'justify-center px-2' : ''}
                      `}
                    >
                      {item.icon && <item.icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-gray-400'}`} />}
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  )}
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
    </div>
  );
}