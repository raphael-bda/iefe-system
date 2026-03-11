import { useStore } from '../store/useStore';
import { Target, Users, Wallet, GraduationCap } from 'lucide-react';

export function Dashboard() {
  const { leads, protocolos, alunos } = useStore();

  const kpis = [
    { title: 'Leads Ativos', value: leads.length, icon: Target, color: 'text-iefe' },
    { title: 'Protocolos', value: protocolos.length, icon: Users, color: 'text-blue-500' },
    { title: 'Alunos Ativos', value: alunos.filter(a => a.status !== 'formado').length, icon: Wallet, color: 'text-orange-500' },
    { title: 'Total Formados', value: alunos.filter(a => a.status === 'formado').length, icon: GraduationCap, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black">Visão Geral <span className="text-gray-400">/ Dashboard</span></h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo ao sistema de gestão educacional IEFE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="glass-card p-6 relative overflow-hidden group hover:border-iefe transition-colors">
              <Icon size={48} className={`absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity ${kpi.color}`} />
              <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">{kpi.title}</p>
              <h3 className="text-4xl font-black">{kpi.value}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}