import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Plus, Trash2, ArrowRight, CheckCircle2, 
  MessageCircle, FileText, Copy, Link as LinkIcon, Users 
} from 'lucide-react';

type TabType = 'hub' | 'link' | 'contratos' | 'scripts';

export function Comercial() {
  const { leads, addLead, moveLead, deleteLead } = useStore();
  
  // Estados Gerais
  const [activeTab, setActiveTab] = useState<TabType>('hub');
  const [newLeadName, setNewLeadName] = useState('');
  
  // Estados - Gerador de Link WhatsApp
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Estados - Gerador de Contrato
  const [contName, setContName] = useState('');
  const [contCpf, setContCpf] = useState('');
  const [contCurso, setContCurso] = useState('');
  const [contValor, setContValor] = useState('');

  // --- FUNÇÕES CRM ---
  const handleAdd = () => {
    if (!newLeadName.trim()) return;
    addLead({ name: newLeadName, status: 'novo' });
    setNewLeadName('');
  };

  const getStatusColor = (status: string) => {
    if (status === 'novo') return 'border-blue-500 text-blue-500 bg-blue-500/10';
    if (status === 'negociacao') return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
    return 'border-iefe text-iefe bg-iefe/10';
  };

  // --- ESTATÍSTICAS ---
  const stats = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, { novo: 0, negociacao: 0, posvenda: 0 } as Record<string, number>);

  const conversionRate = leads.length > 0 
    ? ((stats.posvenda / leads.length) * 100).toFixed(1) 
    : '0.0';

  // --- FUNÇÕES FERRAMENTAS ---
  const handleGenerateWaLink = () => {
    const phoneNum = waPhone.replace(/\D/g, '');
    if (phoneNum.length < 10) {
      alert('Número inválido');
      return;
    }
    window.open(`https://wa.me/55${phoneNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  const contractPreview = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${contName || "________________"}, CPF ${contCpf || "___.___.___-__"}.
CURSO: Pós-Graduação em ${contCurso || "________________"}.
INVESTIMENTO: R$ ${contValor || "0,00"}.
DATA: ${new Date().toLocaleDateString('pt-BR')}

__________________________
Assinatura`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(message); // Aqui você pode substituir por um Toast da sua preferência
    });
  };

  const scripts = [
    { title: 'Abordagem Inicial', text: 'Olá! Vi que você demonstrou interesse em nossos cursos de Pós-Graduação. Gostaria de conhecer nossa grade curricular e valores especiais?' },
    { title: 'Cobrança', text: 'Olá! Identificamos uma pendência financeira em seu cadastro. Conseguimos uma condição especial para regularização hoje. Podemos verificar?' },
    { title: 'Boas-vindas (Pós-venda)', text: 'Parabéns pela matrícula! Seja muito bem-vindo(a) à nossa instituição. Segue abaixo seu acesso ao portal do aluno.' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Comercial <span className="text-gray-400">/ Workspace</span></h1>

      {/* Navegação de Abas */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-dark-700 pb-2">
        <button onClick={() => setActiveTab('hub')} className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'hub' ? 'border-b-2 border-iefe text-iefe bg-iefe/5' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><Users size={16}/> CRM / Hub</button>
        <button onClick={() => setActiveTab('link')} className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'link' ? 'border-b-2 border-iefe text-iefe bg-iefe/5' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><LinkIcon size={16}/> Link WhatsApp</button>
        <button onClick={() => setActiveTab('contratos')} className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'contratos' ? 'border-b-2 border-iefe text-iefe bg-iefe/5' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><FileText size={16}/> Contratos</button>
        <button onClick={() => setActiveTab('scripts')} className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'scripts' ? 'border-b-2 border-iefe text-iefe bg-iefe/5' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><MessageCircle size={16}/> Scripts</button>
      </div>

      {/* CONTEÚDO: CRM / HUB */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Conversão</span>
              <h3 className="text-2xl font-black text-iefe">{conversionRate}%</h3>
            </div>
            <div className="glass-card p-4 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Novos</span>
              <h3 className="text-2xl font-black text-blue-500">{stats.novo || 0}</h3>
            </div>
            <div className="glass-card p-4 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Em Negociação</span>
              <h3 className="text-2xl font-black text-yellow-500">{stats.negociacao || 0}</h3>
            </div>
            <div className="glass-card p-4 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Matriculados</span>
              <h3 className="text-2xl font-black text-iefe">{stats.posvenda || 0}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <div className="lg:col-span-2 glass-card p-6 min-h-[500px]">
              <h3 className="font-bold mb-4">Pipeline de Vendas</h3>
              <div className="space-y-3">
                {leads.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">Nenhum lead encontrado.</p>
                ) : (
                  leads.map((lead) => (
                    <div key={lead.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border-l-4 ${getStatusColor(lead.status)} group gap-4`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${getStatusColor(lead.status)}`}>
                          {lead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold">{lead.name}</h4>
                          <span className="text-xs text-gray-500 uppercase font-semibold">{lead.date} • {lead.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-200 dark:border-dark-700 pt-3 sm:pt-0">
                        {lead.status === 'novo' && (
                          <button onClick={() => moveLead(lead.id, 'negociacao')} className="p-2 text-gray-400 hover:text-yellow-500 bg-white dark:bg-dark-800 rounded shadow-sm transition"><ArrowRight size={18}/></button>
                        )}
                        {lead.status === 'negociacao' && (
                          <button onClick={() => moveLead(lead.id, 'posvenda')} className="p-2 text-gray-400 hover:text-iefe bg-white dark:bg-dark-800 rounded shadow-sm transition"><CheckCircle2 size={18}/></button>
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
      )}

      {/* CONTEÚDO: GERADOR DE LINK WHATSAPP */}
      {activeTab === 'link' && (
        <div className="glass-card p-6 max-w-2xl mx-auto border-t-4 border-t-green-500">
          <h3 className="font-bold mb-4 text-green-500 flex items-center gap-2"><LinkIcon size={20}/> Gerador de Link WhatsApp</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-1">Telefone (com DDD)</label>
              <input 
                type="text" 
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="Ex: 11999999999"
                className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500 block mb-1">Mensagem Inicial</label>
              <textarea 
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="Olá, tudo bem? Gostaria de saber mais sobre..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <button 
              onClick={handleGenerateWaLink}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition shadow-md shadow-green-500/20 uppercase text-xs tracking-widest"
            >
              Gerar Link e Abrir WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* CONTEÚDO: GERADOR DE CONTRATOS */}
      {activeTab === 'contratos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 border-t-4 border-t-blue-500">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="text-blue-500"/> Dados do Contrato</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nome do Aluno" value={contName} onChange={e => setContName(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none" />
              <input type="text" placeholder="CPF" value={contCpf} onChange={e => setContCpf(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none" />
              <input type="text" placeholder="Curso Desejado" value={contCurso} onChange={e => setContCurso(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none" />
              <input type="text" placeholder="Valor (R$)" value={contValor} onChange={e => setContValor(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none" />
            </div>
          </div>
          <div className="glass-card p-6 bg-gray-50 dark:bg-dark-900 flex flex-col">
            <h3 className="font-bold mb-4">Preview</h3>
            <pre className="flex-1 whitespace-pre-wrap font-mono text-sm text-gray-600 dark:text-gray-400 overflow-auto p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg mb-4">
              {contractPreview}
            </pre>
            <button onClick={() => copyToClipboard(contractPreview, 'Contrato copiado!')} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
              <Copy size={18} /> Copiar Texto do Contrato
            </button>
          </div>
        </div>
      )}

      {/* CONTEÚDO: SCRIPTS */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scripts.map((script, idx) => (
            <div key={idx} className="glass-card p-6 border-t-4 border-t-purple-500 flex flex-col">
              <h4 className="font-bold text-purple-500 mb-3">{script.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{script.text}</p>
              <button 
                onClick={() => copyToClipboard(script.text, 'Script copiado!')}
                className="w-full bg-purple-500/10 text-purple-500 font-bold py-2 rounded-lg hover:bg-purple-500 hover:text-white transition flex items-center justify-center gap-2 text-sm"
              >
                <Copy size={16} /> Copiar Script
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}