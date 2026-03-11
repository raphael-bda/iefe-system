import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, CheckCircle, XCircle, FileText } from 'lucide-react';

export function Secretaria() {
  const { protocolos, addProtocolo, updateProtocoloStatus } = useStore();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Histórico Escolar');

  const handleAdd = () => {
    if (!nome.trim()) return;
    addProtocolo({ name: nome, type: tipo });
    setNome('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Secretaria <span className="text-gray-400">/ Validação</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 h-fit border-t-4 border-t-purple-500">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="text-purple-500"/> Novo Protocolo</h3>
          <div className="space-y-4">
            <input 
              type="text" placeholder="Nome do Aluno" value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors"
            />
            <select 
              value={tipo} onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors"
            >
              <option>Histórico Escolar</option>
              <option>Declaração de Matrícula</option>
              <option>Diploma</option>
            </select>
            <button onClick={handleAdd} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-md uppercase text-xs tracking-widest">
              Protocolar
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-6 min-h-[500px]">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="text-gray-400"/> Lista de Requisições</h3>
          <div className="space-y-3">
            {protocolos.length === 0 && <p className="text-center text-gray-500 py-10">Nenhum protocolo ativo.</p>}
            {protocolos.map((prot) => (
              <div key={prot.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-200 dark:bg-dark-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{prot.id}</span>
                    <span className="text-xs text-gray-500 font-bold">{prot.date}</span>
                  </div>
                  <h4 className="font-bold text-lg">{prot.name}</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">{prot.type}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                  {prot.status === 'analise' ? (
                    <>
                      <button onClick={() => updateProtocoloStatus(prot.id, 'deferido')} className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded font-bold text-xs uppercase transition"><CheckCircle size={14}/> Aprovar</button>
                      <button onClick={() => updateProtocoloStatus(prot.id, 'indeferido')} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded font-bold text-xs uppercase transition"><XCircle size={14}/> Negar</button>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 rounded font-bold text-xs uppercase ${prot.status === 'deferido' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {prot.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}