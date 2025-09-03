import React from 'react';
import { Bell, User, Search, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-border h-14 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-background-secondary rounded-md transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        {/* Settings */}
        <button className="p-2 hover:bg-background-secondary rounded-md transition-colors">
          <Settings className="w-5 h-5 text-text-secondary" />
        </button>
        
        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 hover:bg-background-secondary rounded-md transition-colors">
            <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-secondary truncate max-w-32">{user?.email}</p>
            </div>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-error rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;