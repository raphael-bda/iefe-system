import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Sun, Moon, LayoutDashboard, Target, Users, 
  Wallet, GraduationCap, Wrench, Award, LifeBuoy, Settings 
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Visão Geral', icon: LayoutDashboard },
  { path: '/comercial', label: 'Comercial', icon: Target },
  { path: '/secretaria', label: 'Secretaria', icon: Users },
  { path: '/financeiro', label: 'Financeiro', icon: Wallet },
  { path: '/pedagogico', label: 'Pedagógico', icon: GraduationCap },
  { path: '/ferramentas', label: 'Ferramentas', icon: Wrench },
  { path: '/certificados', label: 'Certificados', icon: Award },
  { path: '/suporte', label: 'Suporte', icon: LifeBuoy },
];

export function Layout() {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-iefe/10 dark:bg-iefe/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <header className="fixed top-0 w-full h-16 bg-white/40 dark:bg-dark-bg/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 z-50 flex items-center justify-between px-6 overflow-x-auto">
        <div className="flex items-center gap-3 pr-6 shrink-0 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-iefe to-purple-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-iefe/20 transition-all duration-300">I</div>
          <span className="font-black text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">IEFE</span>
        </div>

        <nav className="flex items-center gap-1 bg-gray-500/5 dark:bg-white/5 p-1.5 rounded-xl border border-gray-200/50 dark:border-white/5 min-w-max mr-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${
                  isActive ? 'text-iefe dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm border border-gray-100 dark:border-transparent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={16} className={`relative z-10 ${isActive ? 'text-iefe dark:text-white' : ''}`} /> 
                <span className="hidden xl:inline relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/configuracoes" className={`p-2 rounded-xl transition-all ${location.pathname === '/configuracoes' ? 'bg-iefe/10 text-iefe' : 'hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-500'}`}>
            <Settings size={20} />
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-500 transition-all">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-28 px-6 container mx-auto pb-12 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}