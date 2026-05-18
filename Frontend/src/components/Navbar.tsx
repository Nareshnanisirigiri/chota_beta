import React, { useEffect, useState } from 'react';
import { Sun, Moon, Languages, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="dashboard-card flex justify-end gap-6 mb-8 px-6 py-3 items-center">
      <button 
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2 hover:bg-foreground/10 rounded-full transition-colors text-foreground"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button className="p-2 hover:bg-foreground/10 rounded-full transition-colors text-foreground">
        <Languages size={20} />
      </button>
      <button className="p-2 hover:bg-foreground/10 rounded-full transition-colors text-foreground relative">
        <Bell size={20} />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
      </button>
      <div 
        onClick={onLogout}
        className="w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center overflow-hidden shadow-xl cursor-pointer"
      >
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
