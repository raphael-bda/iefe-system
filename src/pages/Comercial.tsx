import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Comercial() {
  const { leads, addLead, moveLead, deleteLead } = useStore();
  const [newLeadName, setNewLeadName] = useState('');

  const handleAdd = () => {
    if (!newLeadName.trim()) return;
    addLead({ name: newLeadName, status: 'novo' });
    setNewLeadName('');
  };

  const getStatusColor = (status: string) => {
    if (status === 'novo') return 'border-blue-500 text-blue-500';
    if (status === 'negociacao') return 'border-yellow-500 text-yellow-500';
    return 'border-iefe text-iefe';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Comercial <span className="text-gray-400">/ CRM</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Adição */}
        <div className="lg:col-span-1 glass-card p-6 h-fit border-t-4 border-t-iefe">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="text-iefe"/> Novo Lead</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              placeholder="Nome do interessado..."
              className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe dark:focus:border-iefe transition-colors"
            />
            <button 
              onClick={handleAdd}
              className="w-full bg-iefe text-white font-bold py-3 rounded-lg hover:bg-iefe-dark transition shadow-md shadow-iefe/20 uppercase text-xs tracking-widest"
            >
              Adicionar ao Pipeline
            </button>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[500px]">
          <h3 className="font-bold mb-4">Pipeline de Vendas</h3>
          
          <div className="space-y-3">
            {leads.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Nenhum lead encontrado.</p>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border-l-4 ${getStatusColor(lead.status)} group`}>
                  <div>
                    <h4 className="font-bold">{lead.name}</h4>
                    <span className="text-xs text-gray-500 uppercase font-semibold">{lead.date} • {lead.status}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {lead.status === 'novo' && (
                      <button onClick={() => moveLead(lead.id, 'negociacao')} className="p-2 text-gray-400 hover:text-yellow-500 bg-white dark:bg-dark-800 rounded shadow-sm"><ArrowRight size={18}/></button>
                    )}
                    {lead.status === 'negociacao' && (
                      <button onClick={() => moveLead(lead.id, 'posvenda')} className="p-2 text-gray-400 hover:text-iefe bg-white dark:bg-dark-800 rounded shadow-sm"><CheckCircle2 size={18}/></button>
                    )}
                    <button onClick={() => deleteLead(lead.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-dark-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}