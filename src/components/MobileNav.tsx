import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Shirt, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Fragrance', path: '/fragrances', icon: Droplets },
    { name: 'Apparel', path: '/apparel', icon: Shirt },
    { name: 'Profile', path: user ? '/profile' : '/login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5EFE6]/95 backdrop-blur-lg border-t border-[#D8C7B0]/30 px-6 py-3 z-[100] pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center space-y-1 group"
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-[#2C2C2C] text-white shadow-lg scale-110" 
                  : "text-[#2C2C2C]/40 group-hover:text-[#2C2C2C] group-hover:bg-[#2C2C2C]/5"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                isActive ? "text-[#2C2C2C]" : "text-[#2C2C2C]/40"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
