"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/lib/logout';

// TypeScript interface'leri
interface UserSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface UserMenuProps {
  session?: UserSession | null;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (): void => {
    setIsOpen(false);
  };

  // Giriş yapmamış kullanıcı için
  if (!session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <User className="w-4 h-4" />
          <span>Giriş Yap</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Login/Register Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Hoş geldiniz</p>
              <p className="text-xs text-gray-500 mt-1">Hesabınıza giriş yapın</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link 
                href="/login" 
                onClick={handleMenuClick}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 group"
              >
                <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Giriş Yap
                </span>
              </Link>

              <Link 
                href="/register" 
                onClick={handleMenuClick}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 group"
              >
                <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Üye Ol
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Giriş yapmış kullanıcı için
  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        )}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {session.user.name || 'Kullanıcı'}
          </span>
          <span className="text-xs text-gray-500">{session.user.email}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {session.user.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={handleMenuClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-3 group"
            >
              <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Hesabım
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hesap bilgilerinizi görüntüleyin
                </p>
              </div>
            </Link>

            <Link
              href="/profile"
              onClick={handleMenuClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-3 group"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Profil Ayarları
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hesap ayarlarınızı düzenleyin
                </p>
              </div>
            </Link>

            <Link
              href="/orders"
              onClick={handleMenuClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-3 group"
            >
              <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Siparişlerim
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sipariş geçmişinizi inceleyin
                </p>
              </div>
            </Link>

            <Link
              href="/wishlist"
              onClick={handleMenuClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-3 group"
            >
              <Heart className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Favorilerim
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Beğendiğiniz ürünler
                </p>
              </div>
            </Link>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Logout Form - Server Action ile */}
          <form action={logout} className="w-full">
            <button
              type="submit"
              onClick={handleMenuClick}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 flex items-center space-x-3 group"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              <span className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                Çıkış Yap
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}