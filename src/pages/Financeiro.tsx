import { useState } from 'react';
import { Calculator, CreditCard, Receipt } from 'lucide-react';

export function Financeiro() {
  const [valor, setValor] = useState('');
  const [descontoPix, setDescontoPix] = useState(10);

  const valorNum = parseFloat(valor.replace(/\D/g, '')) / 100 || 0;
  const valorPix = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNum * (1 - descontoPix / 100));

  const handleMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if(v) { v = (parseInt(v, 10)/100).toFixed(2); setValor(v); }
    else { setValor(''); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Financeiro <span className="text-gray-400">/ Operacional</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-fit border-t-4 border-t-iefe">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Calculator className="text-iefe"/> Simulador PIX</h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase font-bold text-gray-500">Valor Original</label>
              <input 
                type="text" value={valor} onChange={handleMask} placeholder="R$ 0,00"
                className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe transition-colors text-lg font-bold text-iefe"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase font-bold text-gray-500">Desconto PIX</label>
                <span className="text-iefe font-bold">{descontoPix}%</span>
              </div>
              <input 
                type="range" min="5" max="30" value={descontoPix} onChange={(e) => setDescontoPix(Number(e.target.value))}
                className="w-full accent-iefe"
              />
            </div>
            <div className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg flex justify-between items-center border border-gray-200 dark:border-dark-700">
              <span className="font-bold text-gray-600 dark:text-gray-300">Valor Final:</span>
              <span className="text-2xl font-black text-iefe">{valorPix}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-fit">
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-iefe transition cursor-pointer group">
            <Receipt className="text-gray-400 group-hover:text-iefe transition" size={32} />
            <span className="font-bold">Gerar Boleto</span>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-iefe transition cursor-pointer group">
            <CreditCard className="text-gray-400 group-hover:text-iefe transition" size={32} />
            <span className="font-bold">Link de Cartão</span>
          </div>
        </div>
      </div>
    </div>
  );
}