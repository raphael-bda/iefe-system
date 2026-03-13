import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { 
  Wrench, Type, MessageSquare, FileImage, 
  Search, Copy, Plus, Trash2, X, Download, BookOpen
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const PROCEDURES = [
  { id: 1, title: "Atendimento ao Aluno", sector: "secretaria", description: "Protocolo inicial de atendimento e verificação.", content: "Aluno entrou em contato – Primeira coisa: abrir a página no IRC, verificar histórico escolar, histórico de anotações internas e ficha financeira. Sempre verificar as conversas anteriores no digisac caso o aluno cite que estava falando com alguém ou que fulano disse isso ou aquilo." },
  { id: 3, title: "Reposição de Aulas", sector: "secretaria", description: "Regras de gratuidade e taxas.", content: "Todo aluno tem o direito a 3 reposições gratuitas. Após este número, será cobrada taxa. Só é permitida a reposição de no máximo 5 aulas. Para realizar uma reposição: primeiramente ir na planilha escala 2025 > verificar se possuí a reposição da disciplina desejada > enviar para a aluna esse modelo de mensagem." },
  { id: 5, title: "Lançamento de Notas EAD", sector: "pedagogico", description: "Passo a passo notas EAD.", content: "Verificar as informações antes de lançar a nota: IRC > nome da aluna e verificar a turma que a aluna estuda > gravar a disciplina para o próximo passo. Lançamento de notas: secretária > diário de notas > turma > disciplina > gerar lista de notas > salvar." },
  { id: 9, title: "Cancelamento de Matrícula", sector: "financeiro", description: "Regras de multa e reembolso.", content: "Cancelamento até 10 dias antes do início das aulas: devolução de 80% do valor da matrícula. 20% do valor da matrícula é retido como multa compensatória em caso de cancelamento prévio. Após o início das aulas: multa de 20% sobre as mensalidades vincendas." },
  { id: 14, title: "Reposição - Valores", sector: "contrato", description: "Tabela de preços reposição.", content: "Até 3 reposições gratuitas durante o curso. Reposições extras: R$ 250,00 por aula. Falta em reposição agendada: cobrança de novo valor de R$ 250,00 para reagendamento." },
  // Podes colar o resto do array procedures original aqui. Mantive apenas alguns para o código não ficar demasiado gigante.
];

const CATEGORY_COLORS: Record<string, string> = {
  'Vendas': 'text-green-600 bg-green-100 border-green-200 dark:bg-green-500/10 dark:border-green-500/30',
  'Suporte': 'text-pink-600 bg-pink-100 border-pink-200 dark:bg-pink-500/10 dark:border-pink-500/30',
  'Financeiro': 'text-red-600 bg-red-100 border-red-200 dark:bg-red-500/10 dark:border-red-500/30',
  'Secretaria': 'text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30',
  'Geral': 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700'
};

export function Ferramentas() {
  const [activeTab, setActiveTab] = useState<'utils' | 'scripts' | 'pops'>('utils');

  // --- TAB: UTILS ---
  const [textoOriginal, setTextoOriginal] = useState('');
  const [images, setImages] = useState<{name: string, url: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if(ev.target?.result) {
          setImages(prev => [...prev, { name: file.name, url: ev.target!.result as string }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const generatePDF = () => {
    if (images.length === 0) return alert('Nenhuma imagem selecionada.');
    const doc = new jsPDF();
    
    images.forEach((img, i) => {
      if (i > 0) doc.addPage();
      const imgProps = doc.getImageProperties(img.url);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img.url, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    });
    
    doc.save(`IEFE_Documentos_${Date.now()}.pdf`);
    setImages([]); // Limpa após gerar
  };

  // --- TAB: SCRIPTS ---
  const { scripts, addScript, deleteScript } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');
  const [newText, setNewText] = useState('');
  const [searchScript, setSearchScript] = useState('');

  const handleAddScript = () => {
    if (!newTitle || !newText) return alert('Preencha título e texto.');
    addScript({ title: newTitle, category: newCategory, text: newText });
    setNewTitle(''); setNewText('');
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Copiado!'));
  };

  const filteredScripts = scripts.filter(s => s.title.toLowerCase().includes(searchScript.toLowerCase()) || s.text.toLowerCase().includes(searchScript.toLowerCase()));

  // --- TAB: POPS ---
  const [searchPop, setSearchPop] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [selectedPop, setSelectedPop] = useState<typeof PROCEDURES[0] | null>(null);

  const filteredPops = PROCEDURES.filter(p => {
    const matchSector = filterSector === 'all' || p.sector === filterSector;
    const matchSearch = p.title.toLowerCase().includes(searchPop.toLowerCase()) || p.content.toLowerCase().includes(searchPop.toLowerCase());
    return matchSector && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-dark-700 pb-4">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Wrench className="text-iefe" size={32} />
          Ferramentas <span className="text-gray-400 text-2xl">/ Sistema</span>
        </h1>
        
        <div className="flex bg-gray-100 dark:bg-dark-900 rounded-lg p-1 border border-gray-200 dark:border-dark-700">
          <button onClick={() => setActiveTab('utils')} className={`px-4 py-2 text-sm font-bold rounded ${activeTab === 'utils' ? 'bg-white dark:bg-dark-700 text-iefe shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Utilitários</button>
          <button onClick={() => setActiveTab('scripts')} className={`px-4 py-2 text-sm font-bold rounded ${activeTab === 'scripts' ? 'bg-white dark:bg-dark-700 text-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Scripts</button>
          <button onClick={() => setActiveTab('pops')} className={`px-4 py-2 text-sm font-bold rounded ${activeTab === 'pops' ? 'bg-white dark:bg-dark-700 text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Base POP</button>
        </div>
      </div>

      {/* --- ABA UTILITÁRIOS --- */}
      {activeTab === 'utils' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Conversor de Texto */}
          <div className="glass-card p-6 border-t-4 border-t-iefe h-fit">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Type className="text-iefe"/> Conversor de Texto</h3>
            <textarea
              value={textoOriginal} onChange={(e) => setTextoOriginal(e.target.value)} placeholder="Insira o seu texto aqui..."
              className="w-full h-40 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setTextoOriginal(textoOriginal.toUpperCase())} className="flex-1 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 font-bold py-2 rounded text-sm transition">MAIÚSCULAS</button>
              <button onClick={() => setTextoOriginal(textoOriginal.toLowerCase())} className="flex-1 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 font-bold py-2 rounded text-sm transition">minúsculas</button>
              <button onClick={() => setTextoOriginal('')} className="bg-red-100 text-red-600 hover:bg-red-200 font-bold px-4 py-2 rounded transition"><Trash2 size={18}/></button>
            </div>
          </div>

          {/* Imagem para PDF */}
          <div className="glass-card p-6 border-t-4 border-t-purple-500 h-fit flex flex-col">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileImage className="text-purple-500"/> Imagem para PDF</h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition mb-4 bg-gray-50 dark:bg-dark-900"
            >
              <FileImage size={32} className="mx-auto text-gray-400 mb-2"/>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Clique para selecionar imagens</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG suportados</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>

            {images.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 flex-shrink-0 group rounded-lg overflow-hidden border border-gray-200 dark:border-dark-700">
                    <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={generatePDF} disabled={images.length === 0} className="mt-auto w-full bg-purple-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-purple-700 transition">
              <Download size={18}/> Gerar Ficheiro PDF
            </button>
          </div>
        </div>
      )}

      {/* --- ABA SCRIPTS --- */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          <div className="glass-card p-6 border-t-4 border-t-blue-500 h-fit">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="text-blue-500"/> Novo Script</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título do Script" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-blue-500" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-blue-500">
                <option>Vendas</option><option>Suporte</option><option>Financeiro</option><option>Secretaria</option><option>Geral</option>
              </select>
              <textarea placeholder="Conteúdo da mensagem..." value={newText} onChange={e => setNewText(e.target.value)} className="w-full h-32 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-blue-500 resize-none" />
              <button onClick={handleAddScript} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">Salvar Script</button>
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2"><MessageSquare className="text-gray-400"/> Os Seus Scripts</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Procurar script..." value={searchScript} onChange={e => setSearchScript(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScripts.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Nenhum script encontrado.</p>}
              {filteredScripts.map(script => (
                <div key={script.id} className="bg-gray-50 dark:bg-dark-900 p-4 rounded-lg border border-gray-200 dark:border-dark-700 flex flex-col group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${CATEGORY_COLORS[script.category] || CATEGORY_COLORS['Geral']}`}>{script.category}</span>
                    <button onClick={() => {if(confirm('Apagar script?')) deleteScript(script.id)}} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>
                  </div>
                  <h4 className="font-bold mb-1 text-gray-800 dark:text-white">{script.title}</h4>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-3 flex-grow">{script.text}</p>
                  <button onClick={() => copyText(script.text)} className="w-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold py-2 rounded text-xs transition flex justify-center gap-2">
                    <Copy size={14}/> Copiar Texto
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ABA POPS (PROCEDIMENTOS) --- */}
      {activeTab === 'pops' && (
        <div className="animate-in fade-in space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'secretaria', 'pedagogico', 'financeiro', 'ead', 'contrato'].map(sector => (
                <button key={sector} onClick={() => setFilterSector(sector)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${filterSector === sector ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 dark:bg-dark-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>
                  {sector === 'all' ? 'Todos' : sector}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Procurar procedimento..." value={searchPop} onChange={e => setSearchPop(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPops.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">Nenhum POP encontrado.</div>}
            {filteredPops.map(pop => (
              <div key={pop.id} onClick={() => setSelectedPop(pop)} className="glass-card p-6 cursor-pointer hover:border-orange-500 transition group flex flex-col h-full border-t-4 border-t-gray-200 dark:border-t-dark-700 hover:border-t-orange-500">
                <div className="mb-3"><span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">{pop.sector}</span></div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition">{pop.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{pop.description}</p>
                <div className="pt-3 border-t border-gray-100 dark:border-dark-700 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono">POP-{String(pop.id).padStart(3, '0')}</span>
                  <span className="text-orange-500 font-bold opacity-0 group-hover:opacity-100 transition">Ler Documento &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal POP */}
      {selectedPop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-dark-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-dark-700 animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500"><BookOpen size={24}/></div>
                <div>
                  <h3 className="font-black text-xl">{selectedPop.title}</h3>
                  <span className="text-xs font-mono text-gray-500">POP-{String(selectedPop.id).padStart(3, '0')} • {selectedPop.sector.toUpperCase()}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPop(null)} className="text-gray-400 hover:text-red-500 bg-white dark:bg-dark-900 p-2 rounded-full shadow-sm transition"><X size={20}/></button>
            </div>
            <div className="p-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedPop.content}</p>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-dark-800 bg-gray-50 dark:bg-dark-800 flex justify-end">
              <button onClick={() => setSelectedPop(null)} className="bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-700 dark:text-white px-6 py-2 rounded-lg font-bold transition">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}