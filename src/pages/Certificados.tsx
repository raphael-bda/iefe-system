import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Award, UploadCloud, FileArchive, Eye, Download, Users, X, FileText } from 'lucide-react';

// Tipagem do Aluno
type Aluno = {
  nome: string;
  cpf: string;
  naturalidade: string;
  telefone: string;
};

// Mapeamentos para transformar a Sigla do Estado na frase correta
const UF_MAP: Record<string, string> = {
  "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas", "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo", "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul", "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná", "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte", "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina", "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

const NATURALIDADE_MAP: Record<string, string> = {
  "alagoas": "de Alagoas", "goias": "de Goiás", "goiás": "de Goiás", "mato grosso": "de Mato Grosso", "mato grosso do sul": "de Mato Grosso do Sul", "minas gerais": "de Minas Gerais", "pernambuco": "de Pernambuco", "rondonia": "de Rondônia", "rondônia": "de Rondônia", "roraima": "de Roraima", "santa catarina": "de Santa Catarina", "sao paulo": "de São Paulo", "são paulo": "de São Paulo", "sergipe": "de Sergipe", "bahia": "da Bahia", "paraiba": "da Paraíba", "paraíba": "da Paraíba", "acre": "do Acre", "amapa": "do Amapá", "amapá": "do Amapá", "amazonas": "do Amazonas", "ceara": "do Ceará", "ceará": "do Ceará", "espirito santo": "do Espírito Santo", "espírito santo": "do Espírito Santo", "maranhao": "do Maranhão", "maranhão": "do Maranhão", "para": "do Pará", "pará": "do Pará", "parana": "do Paraná", "paraná": "do Paraná", "piaui": "do Piauí", "piauí": "do Piauí", "rio de janeiro": "do Rio de Janeiro", "rio grande do norte": "do Rio Grande do Norte", "rio grande do sul": "do Rio Grande do Sul", "tocantins": "do Tocantins"
};

export function Certificados() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [tema, setTema] = useState('');
  const [dataReal, setDataReal] = useState('20 de outubro de 2025');
  const [horas, setHoras] = useState('2 horas');
  const [local, setLocal] = useState('São Paulo, 07 de novembro de 2025');
  
  const [gerando, setGerando] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [previewModal, setPreviewModal] = useState<Aluno | null>(null);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  // --- PROCESSAMENTO DA PLANILHA ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);

      const parseNaturalidade = (val: string) => {
        if (!val) return "do Brasil";
        let estado = val.trim();
        if (val.includes("/") || val.includes("-")) {
          const partes = val.split(/[/ -]/);
          estado = partes[partes.length - 1].trim();
        }
        const ufUpper = estado.toUpperCase();
        if (UF_MAP[ufUpper]) estado = UF_MAP[ufUpper];
        const chave = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return NATURALIDADE_MAP[chave] || `de ${estado}`;
      };

      const extracted: Aluno[] = json.map((row) => {
        const findKey = (term: string): string | undefined => Object.keys(row).find((k) => k.toLowerCase().includes(term.toLowerCase()));
        const nomeKey = findKey('nome');
        const cpfKey = findKey('cpf');
        const naturalidadeKey = findKey('naturalidade');
        const estadoKey = findKey('estado');
        const ufKey = findKey('uf');
        const whatsappKey = findKey('whatsapp');
        const telefoneKey = findKey('telefone');
        
        const getValue = (key: string | undefined): string => {
          if (!key) return '';
          const val = row[key];
          return typeof val === 'string' ? val : '';
        };
        
        return {
          nome: getValue(nomeKey) || 'Nome Desconhecido',
          cpf: getValue(cpfKey) || '---',
          naturalidade: parseNaturalidade(getValue(naturalidadeKey) || getValue(estadoKey) || getValue(ufKey)),
          telefone: getValue(whatsappKey) || getValue(telefoneKey)
        };
      }).filter(a => a.nome !== 'Nome Desconhecido');

      setAlunos(extracted);
      // Reset no input para permitir re-upload do mesmo arquivo
      e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  // --- GERADOR DE PDF CORE ---
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const gerarPdfBlob = async (): Promise<Blob> => {
    if (!page1Ref.current || !page2Ref.current) throw new Error("Refs not found");
    
    const canvasFrente = await html2canvas(page1Ref.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    const canvasVerso = await html2canvas(page2Ref.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });

    const imgFrente = canvasFrente.toDataURL('image/jpeg', 0.98);
    const imgVerso = canvasVerso.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(imgFrente, 'JPEG', 0, 0, 297, 210);
    pdf.addPage('a4', 'landscape');
    pdf.addImage(imgVerso, 'JPEG', 0, 0, 297, 210);

    return pdf.output('blob');
  };

  const baixarIndividual = async (aluno: Aluno) => {
    setPreviewModal(aluno); // Define o aluno no template oculto
    setGerando(true);
    setStatusText(`Gerando certificado de ${aluno.nome}...`);
    
    try {
      await wait(300); // Aguarda o React renderizar os dados do aluno no template oculto
      const blob = await gerarPdfBlob();
      const cleanName = aluno.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
      saveAs(blob, `Certificado_${cleanName}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar certificado.");
    } finally {
      setGerando(false);
      setPreviewModal(null);
    }
  };

  const baixarLoteZIP = async () => {
    if (alunos.length === 0) return;
    setGerando(true);
    const zip = new JSZip();
    const folder = zip.folder("Certificados_IEFE");

    try {
      for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];
        setStatusText(`Processando: ${aluno.nome} (${i + 1}/${alunos.length})`);
        setPreviewModal(aluno); // Injeta os dados na tela oculta
        
        await wait(300); // Dá tempo pro DOM atualizar
        const blob = await gerarPdfBlob();
        const cleanName = aluno.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
        folder?.file(`${cleanName}.pdf`, blob);
      }

      setStatusText("Empacotando arquivo ZIP...");
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Certificados_IEFE_Lote.zip');
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar lote.");
    } finally {
      setGerando(false);
      setPreviewModal(null);
    }
  };

  // --- RENDER DO TEMPLATE DO CERTIFICADO ---
  // Este é o componente exato do PDF que ficará oculto/ou no preview
  const CertificateTemplate = ({ aluno }: { aluno: Aluno }) => (
    <div id="pdf-content" className="bg-white w-[1123px]">
      {/* PÁGINA 1 - FRENTE */}
      <div ref={page1Ref} className="relative w-[1123px] h-[794px] overflow-hidden bg-white">
        <img src="/img/fundo_certificado.jpg" className="absolute inset-0 w-full h-full object-fill z-0" crossOrigin="anonymous" alt="Fundo" />
        <div className="absolute inset-0 z-10 font-serif text-black">
          
          <div className="absolute top-[42%] left-[50%] -translate-x-1/2 w-[82%] text-[20px] leading-[1.8] text-justify">
            <span className="block text-[32px] font-bold uppercase text-center mb-[25px] leading-tight font-sans tracking-wide">
              {aluno.nome}
            </span>
            natural do estado <span className="font-bold">{aluno.naturalidade}</span>, portador(a) do CPF <span className="font-bold">{aluno.cpf}</span> participou da aula sobre o tema "<span className="font-bold">{tema || "TEMA DO CURSO"}</span>", realizado no dia <span className="font-bold">{dataReal}</span>, com carga horária total de <span className="font-bold">{horas}</span>.
          </div>
          
          <div className="absolute top-[70%] right-[13%] w-[40%] text-[18px] text-center">
            {local}
          </div>
          
          <div className="absolute top-[80%] left-[13%] w-[25%] text-[18px] font-bold uppercase text-center font-sans leading-tight">
            {aluno.nome}
          </div>
        </div>
      </div>

      {/* PÁGINA 2 - VERSO */}
      <div ref={page2Ref} className="relative w-[1123px] h-[794px] overflow-hidden bg-white mt-4">
        <img src="/img/verso_certificado.jpg" className="absolute inset-0 w-full h-full object-fill z-0" crossOrigin="anonymous" alt="Verso" />
        {/* Se quiser adicionar texto dinâmico no verso, basta criar as divs absolutas aqui, assim como fizemos na frente */}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 dark:border-dark-700 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
            <Award className="text-iefe" size={36} />
            Emissão Oficial <span className="text-gray-400 font-normal">/ Certificados</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Importe uma planilha e gere os PDFs em lote rapidamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo - Configurações */}
        <div className="lg:col-span-4 space-y-6">
          <label className="block glass-card p-8 rounded-xl border-dashed border-2 hover:border-iefe transition text-center cursor-pointer group">
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
            <UploadCloud className="mx-auto text-gray-400 group-hover:text-iefe transition mb-3" size={48} />
            <p className="font-bold text-lg mb-1">Carregar Alunos</p>
            <p className="text-xs text-gray-500">Planilha Excel ou CSV</p>
          </label>

          <div className="glass-card p-6 rounded-xl border-t-4 border-t-iefe">
            <h3 className="font-bold mb-4 uppercase text-sm tracking-wider text-gray-500">Dados Variáveis</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Curso / Tema</label>
                <textarea value={tema} onChange={e => setTema(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded p-3 outline-none focus:border-iefe h-20 resize-none text-sm" placeholder="Ex: Pós-Graduação em..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Data Realização</label>
                  <input type="text" value={dataReal} onChange={e => setDataReal(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded p-2 outline-none focus:border-iefe text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Horas</label>
                  <input type="text" value={horas} onChange={e => setHoras(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded p-2 outline-none focus:border-iefe text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Cidade/Emissão</label>
                <input type="text" value={local} onChange={e => setLocal(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded p-2 outline-none focus:border-iefe text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Tabela e Ações */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-xl flex flex-col min-h-[500px] border border-gray-200 dark:border-dark-700 relative overflow-hidden">
            
            <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 flex justify-between items-center z-10">
              <h3 className="font-bold flex items-center gap-2"><Users className="text-gray-400" size={18}/> Lista de Emissão <span className="bg-gray-200 dark:bg-dark-800 text-xs px-2 py-0.5 rounded ml-2">{alunos.length}</span></h3>
              {alunos.length > 0 && (
                <button onClick={baixarLoteZIP} disabled={gerando} className="bg-iefe hover:bg-iefe-dark text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition disabled:opacity-50">
                  <FileArchive size={14} /> {gerando ? 'Gerando...' : 'Gerar ZIP em Lote'}
                </button>
              )}
            </div>

            <div className="flex-grow overflow-x-auto relative">
              {alunos.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <FileText size={48} className="mb-3 opacity-30" />
                  <p>Nenhuma planilha importada.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
                    <tr>
                      <th className="px-6 py-4">Nome do Aluno</th>
                      <th className="px-6 py-4">Estado (Formatado)</th>
                      <th className="px-6 py-4">CPF</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                    {alunos.map((aluno, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition">
                        <td className="px-6 py-3 font-bold">{aluno.nome}</td>
                        <td className="px-6 py-3 text-gray-500">{aluno.naturalidade}</td>
                        <td className="px-6 py-3 font-mono text-gray-500">{aluno.cpf}</td>
                        <td className="px-6 py-3 text-right flex justify-end gap-2">
                          <button onClick={() => setPreviewModal(aluno)} className="p-2 bg-gray-200 dark:bg-dark-900 hover:text-iefe rounded transition"><Eye size={14}/></button>
                          <button onClick={() => baixarIndividual(aluno)} className="p-2 bg-gray-200 dark:bg-dark-900 hover:text-blue-500 rounded transition"><Download size={14}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Loader Overlay (Bloqueia a tela durante a geração) */}
            {gerando && (
              <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-iefe border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="font-bold text-lg">Processando Documentos...</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">{statusText}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RENDER OCULTO PARA O HTML2CANVAS --- */}
      {/* Nós só renderizamos o template invisível se houver um modal de preview ativo ou uma geração em andamento */}
      <div className="fixed top-[-10000px] left-[-10000px] opacity-1 pointer-events-none">
        {(previewModal || alunos[0]) && (
          <CertificateTemplate aluno={previewModal || alunos[0]} />
        )}
      </div>

      {/* --- MODAL DE PREVISUALIZAÇÃO VISUAL --- */}
      {previewModal && !gerando && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Pré-visualização: {previewModal.nome}</h3>
            <button onClick={() => setPreviewModal(null)} className="text-gray-400 hover:text-white bg-dark-800 p-2 rounded-full"><X size={24}/></button>
          </div>
          {/* Usamos scale do CSS para caber na tela do usuário, mas ele reflete o HTML gigante em tempo real */}
          <div className="overflow-auto max-h-[85vh] custom-scrollbar w-full flex justify-center pb-12">
            <div className="transform scale-[0.4] sm:scale-[0.5] lg:scale-[0.7] xl:scale-[0.8] origin-top shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <CertificateTemplate aluno={previewModal} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}