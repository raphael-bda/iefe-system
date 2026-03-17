import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lead = { id: string; name: string; status: 'novo' | 'negociacao' | 'posvenda'; date: string; };
export type Protocolo = { id: string; name: string; type: string; status: 'analise' | 'deferido' | 'indeferido'; date: string; ra?: string; };
export type Aluno = { id: string; name: string; course: string; status: 'pendente' | 'cursando' | 'formado'; date: string; };
export type Script = { id: string; title: string; category: string; text: string; };

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  moveLead: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;

  protocolos: Protocolo[];
  addProtocolo: (prot: Omit<Protocolo, 'id' | 'date' | 'status'>) => void;
  updateProtocoloStatus: (id: string, status: Protocolo['status']) => void;
  deleteProtocolo: (id: string) => void;

  alunos: Aluno[];
  addAluno: (aluno: Omit<Aluno, 'id' | 'date' | 'status'>) => void;
  moveAluno: (id: string, status: Aluno['status']) => void;
  deleteAluno: (id: string) => void;

  scripts: Script[];
  addScript: (script: Omit<Script, 'id'>) => void;
  deleteScript: (id: string) => void;
}

const getTodayDate = () => new Date().toLocaleDateString('pt-BR');
const generateShortId = (prefix: string) => `${prefix}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      leads: [],
      addLead: (lead) => set((state) => ({ leads: [{ id: crypto.randomUUID(), date: getTodayDate(), ...lead }, ...state.leads] })),
      moveLead: (id, status) => set((state) => ({ leads: state.leads.map(l => l.id === id ? { ...l, status } : l) })),
      deleteLead: (id) => set((state) => ({ leads: state.leads.filter(l => l.id !== id) })),

      protocolos: [],
      addProtocolo: (prot) => set((state) => ({ protocolos: [{ id: generateShortId('REQ'), date: getTodayDate(), status: 'analise', ...prot }, ...state.protocolos] })),
      updateProtocoloStatus: (id, status) => set((state) => ({ protocolos: state.protocolos.map(p => p.id === id ? { ...p, status } : p) })),
      deleteProtocolo: (id) => set((state) => ({ protocolos: state.protocolos.filter(p => p.id !== id) })),

      alunos: [],
      addAluno: (aluno) => set((state) => ({ alunos: [{ id: generateShortId('ALU'), date: getTodayDate(), status: 'pendente', ...aluno }, ...state.alunos] })),
      moveAluno: (id, status) => set((state) => ({ alunos: state.alunos.map(a => a.id === id ? { ...a, status } : a) })),
      deleteAluno: (id) => set((state) => ({ alunos: state.alunos.filter(a => a.id !== id) })),

      scripts: [],
      addScript: (script) => set((state) => ({ scripts: [{ id: crypto.randomUUID(), ...script }, ...state.scripts] })),
      deleteScript: (id) => set((state) => ({ scripts: state.scripts.filter(s => s.id !== id) })),
    }),
    { name: 'iefe-storage' }
  )
);