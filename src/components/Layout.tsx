import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Sun, Moon, LayoutDashboard, Target, Users, 
  Wallet, GraduationCap, Wrench, Award, LifeBuoy, Settings 
} from 'lucide-react';

export function Layout() {
  const { theme, toggleTheme } = useStore();
  const location = useLocation();

  // Aplica a classe 'dark' no HTML para que o Tailwind v4 e o CSS global a reconheçam
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Lista completa de navegação
  const navItems = [
    { path: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { path: '/comercial', label: 'Comercial', icon: Target },
    { path: '/secretaria', label: 'Secretaria', icon: Users },
    { path: '/financeiro', label: 'Financeiro', icon: Wallet },
    { path: '/pedagogico', label: 'Pedagógico', icon: GraduationCap },
    { path: '/ferramentas', label: 'Ferramentas', icon: Wrench },
    { path: '/certificados', label: 'Certificados', icon: Award },
    { path: '/suporte', label: 'Suporte', icon: LifeBuoy },
  ];

  return (
    // A div principal agora herda as cores confortáveis que definimos no body do CSS
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      
      {/* Efeitos de Luz de Fundo (Mesh Gradient) suaves */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-iefe/10 dark:bg-iefe/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* Header Fixo - Atualizado para cores mais confortáveis e com blur moderno */}
      <header className="fixed top-0 w-full h-16 bg-white/70 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-dark-border z-50 flex items-center justify-between px-6 overflow-x-auto transition-colors duration-500">
        
        {/* Logótipo */}
        <div className="flex items-center gap-3 pr-6 shrink-0 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-iefe to-purple-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg group-hover:shadow-iefe/50 transition-all duration-300">I</div>
          <span className="font-black text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">IEFE</span>
        </div>

        {/* Menu de Navegação Central */}
        <nav className="flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/5 min-w-max mr-4 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-white dark:bg-white/10 text-iefe shadow-sm scale-100' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-iefe' : ''} /> 
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Ações Rápidas à Direita (Configurações e Tema) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            to="/configuracoes" 
            className={`p-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/configuracoes' 
                ? 'bg-iefe/10 text-iefe' 
                : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
            }`}
          >
            <Settings size={20} />
          </Link>
          
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-all duration-300">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Conteúdo das Páginas - Com z-index para ficar acima do brilho de fundo */}
      <main className="flex-grow pt-28 px-6 container mx-auto pb-12 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}