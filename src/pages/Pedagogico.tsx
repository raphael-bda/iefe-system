import { useState } from 'react';
import { useStore, type Aluno } from '../store/useStore';
import { GraduationCap, ArrowRight } from 'lucide-react';

type ColumnProps = {
  title: string;
  status: Aluno['status'];
  color: string;
};

const Column = ({ title, status, color }: ColumnProps) => {
  const { alunos, moveAluno } = useStore();
  const list = alunos.filter(a => a.status === status);
  return (
    <div className={`glass-card p-4 flex flex-col min-h-[400px] border-t-4 ${color}`}>
      <h3 className="font-bold text-gray-500 uppercase text-xs mb-4 flex justify-between items-center">
        {title} <span className="bg-gray-100 dark:bg-dark-900 px-2 py-1 rounded font-mono">{list.length}</span>
      </h3>
      <div className="space-y-3">
        {list.map(aluno => (
          <div key={aluno.id} className="bg-gray-50 dark:bg-dark-900 p-3 rounded-lg border border-gray-200 dark:border-dark-700">
            <h4 className="font-bold text-sm">{aluno.name}</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{aluno.course}</p>
            {status !== 'formado' && (
              <button 
                onClick={() => moveAluno(aluno.id, status === 'pendente' ? 'cursando' : 'formado')}
                className="mt-3 w-full bg-white dark:bg-dark-800 text-xs py-1.5 rounded font-bold text-gray-600 hover:text-iefe border border-gray-200 dark:border-dark-700 flex items-center justify-center gap-1 transition"
              >
                Avançar <ArrowRight size={12}/>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function Pedagogico() {
  const { addAluno } = useStore();
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('Pedagogia');

  const handleAdd = () => {
    if (!nome.trim()) return;
    addAluno({ name: nome, course: curso });
    setNome('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black flex justify-between items-end">
        <span>Pedagógico <span className="text-gray-400">/ Gestão</span></span>
      </h1>

      <div className="glass-card p-4 flex gap-4 items-center bg-gray-50 dark:bg-dark-900">
        <GraduationCap className="text-iefe" size={32}/>
        <input type="text" placeholder="Nome do Aluno" value={nome} onChange={(e)=>setNome(e.target.value)} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-2 outline-none focus:border-iefe text-sm flex-grow"/>
        <select value={curso} onChange={(e)=>setCurso(e.target.value)} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-2 outline-none focus:border-iefe text-sm">
          <option>Pedagogia</option>
          <option>Neuropsicopedagogia</option>
          <option>Gestão Escolar</option>
        </select>
        <button onClick={handleAdd} className="bg-iefe text-white font-bold px-4 py-2 rounded-lg hover:bg-iefe-dark text-sm">Matricular</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Pendentes" status="pendente" color="border-t-yellow-500" />
        <Column title="Cursando" status="cursando" color="border-t-blue-500" />
        <Column title="Formados" status="formado" color="border-t-iefe" />
      </div>
    </div>
  );
}