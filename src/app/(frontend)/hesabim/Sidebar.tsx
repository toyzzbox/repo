"use clien"
import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Store, 
  Calendar, 
  Settings, 
  Lock, 
  HelpCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  hasSubmenu?: boolean;
  submenuItems?: { id: string; label: string }[];
}

interface AccountSidebarProps {
  userName?: string;  // Session'dan gelecek
  membershipLevel?: string;
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
  onLogout?: () => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  userName = 'KULLANICI', // Default değer
  membershipLevel = 'BLACK',
  activeMenu,
  onMenuChange,
  onLogout
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { id: 'hesabim', label: 'Hesabım', icon: <User size={20} /> },
    { 
      id: 'kart-programi', 
      label: 'Kart Programı', 
      icon: <CreditCard size={20} />, 
      badge: '0 Puan' 
    },
    { id: 'siparislerim', label: 'Siparişlerim', icon: <ShoppingBag size={20} /> },
    { id: 'favorilerim', label: 'Favorilerim', icon: <Heart size={20} /> },
    { id: 'iletisim', label: 'İletişim Tercihlerim', icon: <MessageSquare size={20} /> },
    { id: 'magaza', label: 'Favori Mağazam', icon: <Store size={20} /> },
    { id: 'randevu', label: 'Randevu Al', icon: <Calendar size={20} /> },
    { 
      id: 'ayarlar', 
      label: 'Hesap Ayarları', 
      icon: <Settings size={20} />, 
      hasSubmenu: true,
      submenuItems: [
        { id: 'kisisel-bilgiler', label: 'Kişisel Bilgiler' },
        { id: 'adres-bilgileri', label: 'Adres Bilgileri' }
      ]
    },
    { id: 'sifre', label: 'Şifre Değiştir', icon: <Lock size={20} /> },
    { id: 'yardim', label: 'Yardıma mı İhtiyacınız Var?', icon: <HelpCircle size={20} /> },
  ];

  const toggleSubmenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (id: string, hasSubmenu?: boolean) => {
    onMenuChange(id);
    if (hasSubmenu) {
      toggleSubmenu(id);
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-[10px] leading-tight">
            Toyzz Box<br/>{membershipLevel}
          </div>
          <div>
            <h2 className="font-semibold text-lg">HOŞ GELDİN {userName}</h2>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-gray-100 text-black font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs text-gray-500">{item.badge}</span>
                )}
                {item.hasSubmenu && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${
                      expandedMenus.includes(item.id) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
            </button>
            
            {/* Submenu */}
            {item.hasSubmenu && expandedMenus.includes(item.id) && item.submenuItems && (
              <div className="ml-11 mt-1 space-y-1">
                {item.submenuItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onMenuChange(subItem.id)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                      activeMenu === subItem.id
                        ? 'bg-gray-100 text-black font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full mt-8 px-4 py-3 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Çıkış yap
      </button>
    </aside>
  );
};