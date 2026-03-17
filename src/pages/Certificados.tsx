import { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Award, UploadCloud, FileArchive, Eye, Download, Users, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { UF_MAP, NATURALIDADE_MAP, type Aluno } from '../utils/constants';
import { CertificateTemplate } from '../components/CertificateTemplate';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const cleanName = (nome: string) => nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');

const processExcelData = (json: Record<string, unknown>[]): Aluno[] => {
  const parseNaturalidade = (val: string) => {
    if (!val) return "do Brasil";
    let estado = val.trim();
    if (val.includes("/") || val.includes("-")) estado = val.split(/[/ -]/).pop()?.trim() || estado;
    const ufUpper = estado.toUpperCase();
    if (UF_MAP[ufUpper]) estado = UF_MAP[ufUpper];
    const chave = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return NATURALIDADE_MAP[chave] || `de ${estado}`;
  };

  return json.map((row) => {
    const findKey = (term: string) => Object.keys(row).find((k) => k.toLowerCase().includes(term.toLowerCase()));
    return {
      nome: (row[findKey('nome') || ''] as string) || 'Nome Desconhecido',
      cpf: (row[findKey('cpf') || ''] as string) || '---',
      naturalidade: parseNaturalidade((row[findKey('naturalidade') || ''] || row[findKey('estado') || ''] || row[findKey('uf') || '']) as string),
      telefone: (row[findKey('whatsapp') || ''] || row[findKey('telefone') || '']) as string
    };
  }).filter(a => a.nome !== 'Nome Desconhecido');
};

const SkeletonLoader = ({ status }: { status: string }) => (
  <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in">
    <div className="w-full max-w-sm space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse mx-auto" />
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse mx-auto" />
    </div>
    <p className="mt-6 font-mono text-sm font-bold text-gray-500 animate-pulse">{status}</p>
  </div>
);

export function Certificados() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [formData, setFormData] = useState({ tema: '', dataReal: '20 de outubro de 2025', horas: '2 horas', local: 'São Paulo, 07 de novembro de 2025' });
  const [gerando, setGerando] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [previewModal, setPreviewModal] = useState<Aluno | null>(null);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]]);
        const extracted = processExcelData(json);
        setAlunos(extracted);
        toast.success(`${extracted.length} alunos importados com sucesso!`);
      } catch {
        toast.error("Erro ao ler planilha. Verifique o arquivo.");
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const gerarPdfBlob = async (): Promise<Blob> => {
    if (!page1Ref.current || !page2Ref.current) throw new Error("Refs not found");
    const canvasFrente = await html2canvas(page1Ref.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    const canvasVerso = await html2canvas(page2Ref.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(canvasFrente.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 297, 210);
    pdf.addPage('a4', 'landscape');
    pdf.addImage(canvasVerso.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 297, 210);
    return pdf.output('blob');
  };

  const baixarIndividual = async (aluno: Aluno) => {
    setPreviewModal(aluno);
    setGerando(true);
    setStatusText(`Renderizando: ${aluno.nome}...`);
    try {
      await wait(300);
      const blob = await gerarPdfBlob();
      saveAs(blob, `Certificado_${cleanName(aluno.nome)}.pdf`);
      toast.success(`Certificado gerado com sucesso.`);
    } catch {
      toast.error("Erro ao gerar certificado.");
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
        setStatusText(`Processando lote: ${i + 1} de ${alunos.length} (${aluno.nome})`);
        setPreviewModal(aluno);
        await wait(300);
        const blob = await gerarPdfBlob();
        folder?.file(`${cleanName(aluno.nome)}.pdf`, blob);
      }
      setStatusText("Empacotando arquivo ZIP...");
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Certificados_IEFE_Lote.zip');
      toast.success("Arquivo ZIP baixado com sucesso!");
    } catch {
      toast.error("Erro ao gerar lote.");
    } finally {
      setGerando(false);
      setPreviewModal(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 dark:border-dark-700 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <Award className="text-iefe" size={36} />
            Emissão Oficial <span className="text-gray-400 font-medium">/ Certificados</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <label className="block glass-card p-8 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700 hover:border-iefe hover:shadow-[0_0_30px_rgba(var(--color-iefe),0.1)] transition-all text-center cursor-pointer group">
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
            <UploadCloud className="mx-auto text-gray-400 group-hover:text-iefe transition-colors mb-3" size={48} />
            <p className="font-bold text-lg mb-1">Carregar Alunos</p>
            <p className="text-xs text-gray-500">Planilha Excel ou CSV</p>
          </label>

          <div className="glass-card p-6 rounded-xl border-t-4 border-t-iefe">
            <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-gray-500">Dados Variáveis</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Curso / Tema</label>
                <textarea name="tema" value={formData.tema} onChange={(e) => setFormData(p => ({...p, tema: e.target.value}))} className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-iefe/50 h-20 resize-none text-sm transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Data</label>
                  <input type="text" name="dataReal" value={formData.dataReal} onChange={(e) => setFormData(p => ({...p, dataReal: e.target.value}))} className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-2 outline-none focus:ring-2 focus:ring-iefe/50 text-sm transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Horas</label>
                  <input type="text" name="horas" value={formData.horas} onChange={(e) => setFormData(p => ({...p, horas: e.target.value}))} className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-2 outline-none focus:ring-2 focus:ring-iefe/50 text-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Local</label>
                <input type="text" name="local" value={formData.local} onChange={(e) => setFormData(p => ({...p, local: e.target.value}))} className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-2 outline-none focus:ring-2 focus:ring-iefe/50 text-sm transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-card rounded-xl flex flex-col min-h-[500px] relative overflow-hidden">
            <div className="p-4 border-b border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center z-10">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="text-gray-400" size={18}/> 
                Lista de Emissão 
                {alunos.length > 0 && <span className="bg-iefe/10 text-iefe text-xs px-2.5 py-0.5 rounded-full ml-2 font-bold">{alunos.length}</span>}
              </h3>
              {alunos.length > 0 && (
                <button onClick={baixarLoteZIP} disabled={gerando} className="bg-iefe hover:bg-iefe-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-iefe/30 active:scale-95">
                  <FileArchive size={14} /> Gerar Lote (ZIP)
                </button>
              )}
            </div>

            <div className="flex-grow overflow-x-auto relative custom-scrollbar">
              {alunos.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/5">
                    <FileText size={32} className="opacity-50" />
                  </div>
                  <p className="font-medium text-gray-600 dark:text-gray-400">Nenhum aluno carregado</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100/50 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/5">
                    <tr>
                      <th className="px-6 py-4">Aluno</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">CPF</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-white/5">
                    {alunos.map((aluno, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{aluno.nome}</td>
                        <td className="px-6 py-4 text-gray-500">{aluno.naturalidade}</td>
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">{aluno.cpf}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => setPreviewModal(aluno)} className="p-2 bg-gray-100 dark:bg-white/5 hover:text-iefe hover:bg-iefe/10 rounded-lg transition-all"><Eye size={16}/></button>
                          <button onClick={() => baixarIndividual(aluno)} className="p-2 bg-gray-100 dark:bg-white/5 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><Download size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {gerando && <SkeletonLoader status={statusText} />}
          </div>
        </div>
      </div>

      <div className="fixed top-[-10000px] left-[-10000px] opacity-1 pointer-events-none">
        {(previewModal || alunos[0]) && (
          <CertificateTemplate aluno={previewModal || alunos[0]} tema={formData.tema} dataReal={formData.dataReal} horas={formData.horas} local={formData.local} page1Ref={page1Ref} page2Ref={page2Ref} />
        )}
      </div>

      {previewModal && !gerando && (
        <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-xl tracking-tight">Preview: {previewModal.nome}</h3>
            <button onClick={() => setPreviewModal(null)} className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all backdrop-blur-sm"><X size={20}/></button>
          </div>
          <div className="overflow-auto max-h-[85vh] custom-scrollbar w-full flex justify-center pb-12">
            <div className="transform scale-[0.4] sm:scale-[0.5] lg:scale-[0.7] xl:scale-[0.8] origin-top shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden transition-transform">
               <CertificateTemplate aluno={previewModal} tema={formData.tema} dataReal={formData.dataReal} horas={formData.horas} local={formData.local} page1Ref={page1Ref} page2Ref={page2Ref} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}