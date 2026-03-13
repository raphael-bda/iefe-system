import { useState } from 'react';
import { LifeBuoy, Send, Clock, AlertCircle, CheckCircle, Ticket } from 'lucide-react';

type Chamado = {
  id: string;
  subject: string;
  type: string;
  priority: string;
  date: string;
  status: string;
};

export function Suporte() {
  const [history, setHistory] = useState<Chamado[]>(() => {
    const saved = localStorage.getItem('ODIN_SUPPORT_HISTORY');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Estados do Formulário
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Dúvida de Sistema');
  const [priority, setPriority] = useState('Baixa');
  const [desc, setDesc] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  const handleSendTicket = () => {
    if (!subject.trim() || !desc.trim()) {
      return alert('Por favor, descreva o assunto e o problema detalhadamente.');
    }

    setIsSending(true);

    // Simulação do tempo de envio (como no Odin OS original)
    setTimeout(() => {
      const ticketId = 'TKT-' + Math.floor(Math.random() * 90000 + 10000);
      const newTicket: Chamado = {
        id: ticketId,
        subject,
        type,
        priority,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Aberto'
      };

      const newHistory = [newTicket, ...history];
      setHistory(newHistory);
      localStorage.setItem('ODIN_SUPPORT_HISTORY', JSON.stringify(newHistory));

      // Limpar formulário
      setSubject('');
      setDesc('');
      setIsSending(false);
      
      // Mostrar feedback
      setSuccessTicket(ticketId);
      
      setTimeout(() => setSuccessTicket(null), 5000); // Esconde a mensagem de sucesso após 5s
    }, 1500);
  };

  const getPriorityColor = (pri: string) => {
    if (pri === 'Alta') return 'text-red-500 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/30';
    if (pri === 'Média') return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30';
    return 'text-blue-500 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black flex items-center gap-3">
        <LifeBuoy className="text-purple-500" size={32} />
        Suporte Técnico <span className="text-gray-400 text-2xl">/ Helpdesk</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulário de Abertura de Chamado */}
        <div className="lg:col-span-2 glass-card p-6 border-t-4 border-t-purple-500">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Ticket className="text-purple-500" size={20}/> Abrir Novo Chamado</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Assunto Principal</label>
              <input 
                type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ex: Erro ao gerar certificado"
                className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Categoria</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors text-sm">
                  <option>Dúvida de Sistema</option>
                  <option>Relato de Bug / Erro</option>
                  <option>Solicitação de Funcionalidade</option>
                  <option>Acesso / Permissões</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Prioridade</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors text-sm">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Descrição Detalhada</label>
              <textarea 
                value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descreva o problema com o máximo de detalhes possível..."
                className="w-full h-32 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500 transition-colors resize-none text-sm"
              />
            </div>

            <button 
              onClick={handleSendTicket} disabled={isSending}
              className="w-full bg-purple-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-purple-700 transition uppercase tracking-wider text-sm shadow-md"
            >
              {isSending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> A Enviar...</>
              ) : (
                <><Send size={18}/> Enviar Solicitação</>
              )}
            </button>
            
            {successTicket && (
              <div className="bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
                <CheckCircle size={24} />
                <div>
                  <p className="font-bold text-sm">Chamado aberto com sucesso!</p>
                  <p className="text-xs opacity-80">A sua referência é: <strong>{successTicket}</strong></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Chamados */}
        <div className="glass-card p-6 h-fit border-t-4 border-t-gray-400">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <Clock size={20} className="text-gray-400"/> Histórico de Chamados
          </h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Nenhum chamado recente.</p>
              </div>
            ) : (
              history.map(t => (
                <div key={t.id} className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 p-4 rounded-lg flex flex-col gap-2 group hover:border-purple-500 transition">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{t.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1" title={t.subject}>{t.subject}</h4>
                  <div className="flex justify-between items-center mt-1 border-t border-gray-200 dark:border-dark-800 pt-2">
                    <span className="text-[10px] text-gray-500">{t.type}</span>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className={t.status === 'Aberto' ? 'text-yellow-500' : 'text-green-500'}>{t.status}</span>
                      <span className="text-gray-400 font-normal">{t.date}</span>
                    </div>
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