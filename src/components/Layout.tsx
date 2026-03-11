import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Sun, Moon, LayoutDashboard, Target, Users, Wallet, GraduationCap, Wrench, Award } from 'lucide-react';

export function Layout() {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Menu atualizado com Ferramentas e Certificados
  const navItems = [
    { path: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { path: '/comercial', label: 'Comercial', icon: Target },
    { path: '/secretaria', label: 'Secretaria', icon: Users },
    { path: '/financeiro', label: 'Financeiro', icon: Wallet },
    { path: '/pedagogico', label: 'Pedagógico', icon: GraduationCap },
    { path: '/ferramentas', label: 'Ferramentas', icon: Wrench },
    { path: '/certificados', label: 'Certificados', icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full h-16 glass-card !rounded-none z-50 flex items-center justify-between px-6 overflow-x-auto">
        <div className="flex items-center gap-3 pr-6">
          <div className="w-8 h-8 bg-iefe rounded flex items-center justify-center text-white font-bold shrink-0">I</div>
          <span className="font-black text-xl tracking-widest text-iefe">IEFE</span>
        </div>

        <nav className="flex items-center gap-2 bg-gray-100 dark:bg-dark-900 p-1 rounded-lg border border-gray-200 dark:border-dark-700 min-w-max mr-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  isActive ? 'bg-white dark:bg-dark-800 text-iefe shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} /> <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition shrink-0">
          {theme === 'light' ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-gray-300" />}
        </button>
      </header>

      {/* Conteúdo das Páginas */}
      <main className="flex-grow pt-24 px-6 container mx-auto pb-12">
        <Outlet />
      </main>
    </div>
  );
}