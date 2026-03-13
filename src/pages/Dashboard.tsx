import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Target, Users, Wallet, GraduationCap, Clock } from 'lucide-react';

export function Dashboard() {
  const { leads, protocolos, alunos } = useStore();
  const [time, setTime] = useState(new Date());
  
  const greeting = (() => {
    const hour = time.getHours();
    if (hour < 12) return "Bom dia. Vamos construir.";
    if (hour < 18) return "Boa tarde. Mantenha o foco.";
    return "Boa noite. O mundo é seu.";
  })();

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const kpis = [
    { title: 'Leads Ativos', value: leads.length, icon: Target, color: 'text-iefe' },
    { title: 'Protocolos', value: protocolos.length, icon: Users, color: 'text-blue-500' },
    { title: 'Alunos Ativos', value: alunos.filter(a => a.status !== 'formado').length, icon: Wallet, color: 'text-orange-500' },
    { title: 'Total Formados', value: alunos.filter(a => a.status === 'formado').length, icon: GraduationCap, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Visão Geral <span className="text-gray-400">/ Dashboard</span></h1>
          <p className="text-gray-500 text-sm mt-1">{greeting} Bem-vindo ao sistema de gestão educacional IEFE.</p>
        </div>
        
        {/* Relógio Dinâmico */}
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
            <div key={index} className="glass-card p-6 relative overflow-hidden group hover:border-iefe transition-colors">
              <Icon size={48} className={`absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-transform group-hover:scale-110 ${kpi.color}`} />
              <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">{kpi.title}</p>
              <h3 className="text-4xl font-black">{kpi.value}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}