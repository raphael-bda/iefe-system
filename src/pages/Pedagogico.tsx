import { useState } from 'react';
import { useStore, type Aluno } from '../store/useStore';
import { GraduationCap, ArrowRight, Search, X } from 'lucide-react';

const COURSE_CONFIG: Record<string, { color: string, bg: string, border: string }> = {
  'Pedagogia': { color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-500/10', border: 'border-pink-200 dark:border-pink-500/30' },
  'Neuropsicopedagogia': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/30' },
  'Gestão Escolar': { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/30' },
  'Psicanálise': { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/30' }
};

type ColumnProps = {
  title: string;
  status: Aluno['status'];
  color: string;
  searchTerm: string;
};

const Column = ({ title, status, color, searchTerm }: ColumnProps) => {
  const { alunos, moveAluno, deleteAluno } = useStore(); // Presumindo que você adicione deleteAluno no useStore
  
  const list = alunos.filter(a => a.status === status && a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`glass-card p-4 flex flex-col min-h-[500px] border-t-4 ${color}`}>
      <h3 className="font-bold text-gray-500 uppercase text-xs mb-4 flex justify-between items-center">
        {title} <span className="bg-gray-100 dark:bg-dark-900 px-2 py-1 rounded font-mono text-gray-700 dark:text-gray-300">{list.length}</span>
      </h3>
      <div className="space-y-3">
        {list.length === 0 && <p className="text-center text-xs text-gray-400 py-4">Vazio</p>}
        {list.map(aluno => {
          const style = COURSE_CONFIG[aluno.course] || COURSE_CONFIG['Pedagogia'];
          const initials = aluno.name.substring(0, 2).toUpperCase();

          return (
            <div key={aluno.id} className={`group bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-md transition relative border-l-4 ${style.border.replace('border-', 'border-l-')}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${style.bg} ${style.color} border ${style.border}`}>
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{aluno.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{aluno.id}</p>
                  </div>
                </div>
                {deleteAluno && (
                  <button onClick={() => { if(confirm('Remover aluno?')) deleteAluno(aluno.id); }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-dark-700/50">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.bg} ${style.color} border ${style.border}`}>
                  {aluno.course}
                </span>
                
                {status !== 'formado' ? (
                  <button 
                    onClick={() => moveAluno(aluno.id, status === 'pendente' ? 'cursando' : 'formado')}
                    className="text-[10px] uppercase font-bold text-gray-500 hover:text-iefe flex items-center gap-1 bg-gray-50 dark:bg-dark-900 px-2 py-1 rounded border border-gray-200 dark:border-dark-700 hover:border-iefe transition"
                  >
                    Avançar <ArrowRight size={12}/>
                  </button>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-iefe flex items-center gap-1">
                    <GraduationCap size={14}/> Formado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function Pedagogico() {
  const { addAluno } = useStore();
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('Pedagogia');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!nome.trim()) return;
    addAluno({ name: nome, course: curso });
    setNome('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-3xl font-black">
          Pedagógico <span className="text-gray-400">/ Gestão</span>
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" placeholder="Buscar aluno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
            className="w-full bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-iefe shadow-sm" 
          />
        </div>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center bg-gray-50 dark:bg-dark-900 border-t-4 border-t-iefe">
        <div className="hidden md:flex bg-iefe/10 p-3 rounded-full text-iefe">
          <GraduationCap size={24}/>
        </div>
        <input 
          type="text" placeholder="Nome do Aluno" value={nome} onChange={(e)=>setNome(e.target.value)} 
          className="w-full md:w-auto flex-grow bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe text-sm shadow-sm"
        />
        <select 
          value={curso} onChange={(e)=>setCurso(e.target.value)} 
          className="w-full md:w-auto bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe text-sm shadow-sm"
        >
          {Object.keys(COURSE_CONFIG).map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleAdd} className="w-full md:w-auto bg-iefe text-white font-bold px-6 py-3 rounded-lg hover:bg-iefe-dark text-sm shadow-md transition whitespace-nowrap">
          Matricular Aluno
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Pendentes" status="pendente" color="border-t-yellow-500" searchTerm={searchTerm} />
        <Column title="Cursando" status="cursando" color="border-t-blue-500" searchTerm={searchTerm} />
        <Column title="Formados" status="formado" color="border-t-iefe" searchTerm={searchTerm} />
      </div>
    </div>
  );
}