'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// Type definitions
interface UserSession {
  user: {
    name?: string;
    email: string;
  };
}

interface UserMenuProps {
  session: UserSession | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Menünün dışına tıklandığında kapatmak için
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESC tuşu ile menüyü kapatmak için
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    // Burada logout fonksiyonunuzu çağırın
    // await logout();
    console.log('Logout işlemi');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Giriş yapmamış kullanıcı menüsü
  if (!session) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Giriş Yap</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Hoş geldiniz</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                Üye Ol
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Giriş yapmış kullanıcı menüsü
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:inline font-medium">
          {session.user.name || session.user.email}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Hesabım
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Profil Ayarları
            </Link>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Logout */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;