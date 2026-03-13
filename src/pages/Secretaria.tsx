import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, CheckCircle, XCircle, FileText, Search, Copy, Download, Trash2, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf'; // Necessário rodar: npm install jspdf

const CHECKLIST_RULES: Record<string, string[]> = {
  'Diploma': ['RG e CPF Legíveis', 'Certidão Nascimento/Casamento', 'Histórico Ensino Médio', 'ENADE Regular', 'Todas as Notas Lançadas', 'Nada Consta Financeiro'],
  'Histórico Escolar': ['Notas do Semestre Lançadas', 'Nada Consta Financeiro', 'Documentação Básica OK'],
  'Declaração de Matrícula': ['Matrícula Ativa', 'Pagamento Mensalidade Atual'],
  'Cancelamento': ['Entrevista Retenção Realizada', 'Multa Contratual Calculada', 'Carta de Próprio Punho'],
  'default': ['Documentação de Identificação', 'Situação Acadêmica Regular', 'Situação Financeira Regular']
};

export function Secretaria() {
  const { protocolos, addProtocolo, updateProtocoloStatus, deleteProtocolo } = useStore();
  
  // Estados para Adição
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Histórico Escolar');
  const [ra, setRa] = useState('');
  
  // Estados de Interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!nome.trim() || !ra.trim()) return alert('Preencha o nome e o R.A.');
    addProtocolo({ name: nome, type: tipo, ra: ra }); // Certifique-se que o seu useStore suporta 'ra'
    setNome('');
    setRa('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Mensagem Copiada!'));
  };

  const generatePDF = (prot: { id: string; name: string; type: string; ra?: string }) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('pt-BR');

    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("Instituto Evolução Educacional - IEFE", 105, 25, { align: "center" });
    doc.setLineWidth(0.5); doc.line(20, 35, 190, 35);

    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text(prot.type.toUpperCase(), 105, 50, { align: "center" });

    doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.setTextColor(20);

    let bodyText = "";
    if (prot.type.includes("Matrícula")) {
      bodyText = `     Declaramos para os devidos fins que o(a) aluno(a) ${prot.name.toUpperCase()}, portador(a) do R.A. ${prot.ra || 'N/A'}, encontra-se regularmente matriculado(a) nesta instituição de ensino, frequentando o curso no presente período letivo.\n\n     A situação acadêmica e financeira do(a) discente encontra-se regular até a presente data.`;
    } else if (prot.type.includes("Conclusão") || prot.type.includes("Diploma")) {
      bodyText = `     Declaramos que o(a) aluno(a) ${prot.name.toUpperCase()}, R.A. ${prot.ra || 'N/A'}, CONCLUIU com êxito todos os componentes curriculares exigidos para o curso, tendo cumprido a carga horária total e obtido aprovação em todas as disciplinas.\n\n     O diploma encontra-se em fase de registro e expedição.`;
    } else {
      bodyText = `     Declaramos a pedido da parte interessada que o(a) aluno(a) ${prot.name.toUpperCase()}, inscrito(a) sob o Registro Acadêmico ${prot.ra || 'N/A'}, possui vínculo com esta instituição de ensino.\n\n     Este documento refere-se à solicitação de ${prot.type}, processada sob o protocolo ${prot.id}.`;
    }

    const splitText = doc.splitTextToSize(bodyText, 170);
    doc.text(splitText, 20, 70);
    doc.setFontSize(11); doc.text("São Paulo, " + today, 20, 160);
    doc.line(60, 220, 150, 220);
    doc.setFontSize(10); doc.text("Secretaria Acadêmica", 105, 225, { align: "center" });
    doc.text("IEFE - Instituto Evolução Educacional", 105, 230, { align: "center" });

    doc.save(`${prot.type.replace(/\s+/g, '_')}_${prot.name.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredProtocolos = protocolos.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedProtocolo = protocolos.find(p => p.id === selectedId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Secretaria <span className="text-gray-400">/ Validação</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: LISTA & ADIÇÃO */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-purple-500">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="text-purple-500"/> Novo Protocolo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nome do Aluno" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500" />
              <input type="text" placeholder="R.A. do Aluno" value={ra} onChange={(e) => setRa(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500" />
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full md:col-span-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500">
                <option>Histórico Escolar</option>
                <option>Declaração de Matrícula</option>
                <option>Diploma</option>
                <option>Cancelamento</option>
              </select>
            </div>
            <button onClick={handleAdd} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-md uppercase text-xs tracking-widest">Protocolar</button>
          </div>

          <div className="glass-card p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2"><FileText className="text-gray-400"/> Fila de Requisições</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Buscar protocolo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredProtocolos.length === 0 && <p className="text-center text-gray-500 py-10">Nenhum protocolo encontrado.</p>}
              {filteredProtocolos.map((prot) => (
                <div 
                  key={prot.id} 
                  onClick={() => setSelectedId(prot.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedId === prot.id ? 'bg-purple-50 border-purple-500 dark:bg-purple-500/10 dark:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-300 dark:bg-dark-800 dark:border-dark-700 dark:hover:border-purple-500/50'}`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{prot.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">{prot.type}</span>
                      <span className="text-[10px] text-gray-400 font-mono">• {prot.id}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={selectedId === prot.id ? 'text-purple-500' : 'text-gray-300 dark:text-gray-600'} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: VALIDADOR */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 sticky top-6">
            {!selectedProtocolo ? (
              <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                <CheckCircle size={48} className="mb-4 opacity-20" />
                <p>Selecione um protocolo na lista para iniciar a validação.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded text-gray-500">{selectedProtocolo.id}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${selectedProtocolo.status === 'deferido' ? 'bg-green-100 text-green-700' : selectedProtocolo.status === 'indeferido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {selectedProtocolo.status === 'analise' ? 'Em Análise' : selectedProtocolo.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black">{selectedProtocolo.name}</h2>
                  <p className="text-sm text-purple-600 font-bold">{selectedProtocolo.type}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-500 mb-3">Checklist de Validação</h4>
                  <div className="space-y-2">
                    {(CHECKLIST_RULES[selectedProtocolo.type] || CHECKLIST_RULES['default']).map((rule, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 rounded bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 cursor-pointer hover:border-gray-400 transition">
                        <input type="checkbox" className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{rule}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateProtocoloStatus(selectedProtocolo.id, 'deferido')} className="bg-green-100 text-green-700 hover:bg-green-200 p-3 rounded-lg font-bold text-sm uppercase transition flex items-center justify-center gap-2"><CheckCircle size={18}/> Deferir</button>
                  <button onClick={() => updateProtocoloStatus(selectedProtocolo.id, 'indeferido')} className="bg-red-100 text-red-700 hover:bg-red-200 p-3 rounded-lg font-bold text-sm uppercase transition flex items-center justify-center gap-2"><XCircle size={18}/> Indeferir</button>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-4 space-y-2">
                  <button onClick={() => generatePDF(selectedProtocolo)} className="w-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 p-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2">
                    <Download size={18}/> Gerar Documento PDF
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => copyToClipboard(`Olá ${selectedProtocolo.name}. Sua solicitação de *${selectedProtocolo.type}* foi DEFERIDA.`)} className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 hover:border-purple-500 p-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400"><Copy size={14}/> Resp. Deferido</button>
                    <button onClick={() => copyToClipboard(`Olá ${selectedProtocolo.name}. Identificamos uma pendência que impede o processamento de *${selectedProtocolo.type}*.`)} className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 hover:border-purple-500 p-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400"><Copy size={14}/> Resp. Pendência</button>
                  </div>
                  
                  {deleteProtocolo && (
                    <button onClick={() => { if(confirm('Excluir?')) { deleteProtocolo(selectedProtocolo.id); setSelectedId(null); } }} className="w-full mt-4 text-red-500 hover:text-red-700 text-xs font-bold py-2 flex items-center justify-center gap-2 transition">
                      <Trash2 size={14}/> Excluir Protocolo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}