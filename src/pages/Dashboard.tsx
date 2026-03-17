import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Target, Users, Wallet, GraduationCap, Clock } from 'lucide-react';

function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = time.getHours();
    if (hour < 12) return "Bom dia. Vamos construir.";
    if (hour < 18) return "Boa tarde. Mantenha o foco.";
    return "Boa noite. O mundo é seu.";
  }, [time]);

  return { time, greeting };
}

export function Dashboard() {
  const leads = useStore((state) => state.leads);
  const protocolos = useStore((state) => state.protocolos);
  const alunos = useStore((state) => state.alunos);
  
  const { time, greeting } = useClock();

  const kpis = useMemo(() => [
    { title: 'Leads Ativos', value: leads.length, icon: Target, color: 'text-blue-500', shadow: 'hover:shadow-blue-500/20 hover:border-blue-500/50' },
    { title: 'Protocolos', value: protocolos.length, icon: Users, color: 'text-indigo-500', shadow: 'hover:shadow-indigo-500/20 hover:border-indigo-500/50' },
    { title: 'Alunos Ativos', value: alunos.filter(a => a.status !== 'formado').length, icon: Wallet, color: 'text-orange-500', shadow: 'hover:shadow-orange-500/20 hover:border-orange-500/50' },
    { title: 'Total Formados', value: alunos.filter(a => a.status === 'formado').length, icon: GraduationCap, color: 'text-emerald-500', shadow: 'hover:shadow-emerald-500/20 hover:border-emerald-500/50' },
  ], [leads, protocolos, alunos]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Visão Geral <span className="text-gray-400 font-medium">/ Dashboard</span></h1>
          <p className="text-gray-500 text-sm mt-1">{greeting} Bem-vindo ao IEFE.</p>
        </div>
        
        <div className="glass-card px-6 py-3 flex items-center gap-3 w-fit border-l-4 border-l-iefe">
          <Clock className="text-iefe" size={24} />
          <span className="text-2xl font-mono font-bold tracking-widest text-gray-800 dark:text-white">
            {time.toLocaleTimeString('pt-BR', { hour12: false })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className={`glass-card p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${kpi.shadow}`}>
              <Icon size={48} className={`absolute right-4 top-4 opacity-10 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 blur-sm group-hover:blur-none ${kpi.color}`} />
              <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2 relative z-10">{kpi.title}</p>
              <h3 className="text-4xl font-black relative z-10">{kpi.value}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}