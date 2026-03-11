import { useState } from 'react';
import { Wrench, Type, MessageSquare, MonitorPlay, Calendar } from 'lucide-react';

export function Ferramentas() {
  const [textoOriginal, setTextoOriginal] = useState('');

  // Funções do Conversor de Texto
  const converterMaiusculas = () => setTextoOriginal(textoOriginal.toUpperCase());
  const converterMinusculas = () => setTextoOriginal(textoOriginal.toLowerCase());
  const limparTexto = () => setTextoOriginal('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black flex items-center gap-3">
        <Wrench className="text-iefe" size={32} />
        Ferramentas <span className="text-gray-400 text-2xl">/ Utilitários</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Conversor de Texto Dinâmico */}
        <div className="glass-card p-6 border-t-4 border-t-iefe">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Type className="text-iefe"/> Conversor de Texto</h3>
          <textarea
            value={textoOriginal}
            onChange={(e) => setTextoOriginal(e.target.value)}
            placeholder="Insira o seu texto aqui..."
            className="w-full h-32 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe transition-colors resize-none mb-4"
          />
          <div className="flex gap-2">
            <button onClick={converterMaiusculas} className="flex-1 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-sm font-bold py-2 rounded transition shadow-sm">MAIÚSCULAS</button>
            <button onClick={converterMinusculas} className="flex-1 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-sm font-bold py-2 rounded transition shadow-sm">minúsculas</button>
            <button onClick={limparTexto} className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40 text-sm font-bold py-2 rounded transition shadow-sm">Limpar</button>
          </div>
        </div>

        {/* Scripts de Venda Rápidos */}
        <div className="glass-card p-6 border-t-4 border-t-blue-500">
          <h3 className="font-bold mb-4 flex items-center gap-2"><MessageSquare className="text-blue-500"/> Scripts de Abordagem</h3>
          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
            <div className="bg-gray-50 dark:bg-dark-900 p-3 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-blue-500 transition cursor-pointer group">
              <h4 className="text-sm font-bold mb-1 text-gray-700 dark:text-gray-200 group-hover:text-blue-500">1. Abordagem Inicial</h4>
              <p className="text-xs text-gray-500">"Olá! Vi que demonstrou interesse nos nossos cursos. Como o IEFE pode ajudar hoje na sua jornada profissional?"</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-900 p-3 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-blue-500 transition cursor-pointer group">
              <h4 className="text-sm font-bold mb-1 text-gray-700 dark:text-gray-200 group-hover:text-blue-500">2. Quebra de Objeção (Preço)</h4>
              <p className="text-xs text-gray-500">"Compreendo perfeitamente. O nosso valor reflete a qualidade dos professores e o acompanhamento exclusivo que o IEFE oferece. Vamos tentar ajustar as parcelas?"</p>
            </div>
          </div>
        </div>

        {/* Atalhos para Aplicações Externas / Futuras */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-card p-6 flex items-center gap-4 hover:border-iefe transition cursor-pointer group">
              <div className="p-4 bg-gray-100 dark:bg-dark-900 rounded-full group-hover:bg-iefe/10 transition">
                <MonitorPlay className="text-gray-500 group-hover:text-iefe transition" size={32} />
              </div>
              <div>
                <h4 className="font-bold">Dashboard TV</h4>
                <p className="text-sm text-gray-500">Abrir vista em ecrã inteiro para a receção.</p>
              </div>
           </div>
           
           <div className="glass-card p-6 flex items-center gap-4 hover:border-iefe transition cursor-pointer group">
              <div className="p-4 bg-gray-100 dark:bg-dark-900 rounded-full group-hover:bg-iefe/10 transition">
                <Calendar className="text-gray-500 group-hover:text-iefe transition" size={32} />
              </div>
              <div>
                <h4 className="font-bold">Agenda IEFE</h4>
                <p className="text-sm text-gray-500">Gerir eventos e compromissos institucionais.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}