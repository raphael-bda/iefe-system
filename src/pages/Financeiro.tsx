import { useState } from 'react';
import { Calculator, CreditCard, Receipt, AlertTriangle, Check, Copy, DollarSign, Trash2 } from 'lucide-react';

const CARD_FACTORS = [1.079822, 1.099644, 1.119466, 1.139288, 1.159110, 1.178932, 1.210063, 1.230072, 1.250081, 1.270090, 1.290099, 1.310108];

export function Financeiro() {
  const [activeTab, setActiveTab] = useState<'pix' | 'boleto' | 'cartao' | 'multa'>('pix');

  // --- Helpers de Formatação ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const parseCurrency = (val: string) => parseFloat(val.replace(/\D/g, '')) / 100 || 0;
  
  const handleMask = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '');
    if (v) setter((parseInt(v, 10) / 100).toFixed(2));
    else setter('');
  };

  // --- Estados e Lógica: PIX ---
  const [valPix, setValPix] = useState('');
  const [descPix, setDescPix] = useState(10);
  const pixNum = parseCurrency(valPix);
  const pixFinal = pixNum * (1 - descPix / 100);

  // --- Estados e Lógica: BOLETO ---
  const [valBoleto, setValBoleto] = useState('');
  const [parcBoleto, setParcBoleto] = useState(1);
  const boletoNum = parseCurrency(valBoleto);
  const entradaBoleto = boletoNum * (parcBoleto <= 6 ? 0.30 : 0.25);
  const parcelaBoleto = parcBoleto > 0 ? (boletoNum - entradaBoleto) / parcBoleto : 0;

  // --- Estados e Lógica: CARTÃO ---
  const [valCartao, setValCartao] = useState('');
  const [parcCartao, setParcCartao] = useState(1);
  const cartaoNum = parseCurrency(valCartao);
  const fatorCartao = CARD_FACTORS[Math.max(0, parcCartao - 1)] || 1;
  const cartaoTotal = cartaoNum * fatorCartao;
  const cartaoParcela = parcCartao > 0 ? cartaoTotal / parcCartao : 0;

  // --- Estados e Lógica: MULTA ---
  const [valMensalidade, setValMensalidade] = useState('');
  const [valAdicional, setValAdicional] = useState('');
  const multaMensalidadeNum = parseCurrency(valMensalidade);
  const multaAdicionalNum = parseCurrency(valAdicional);
  const baseSemestral = multaMensalidadeNum * 6;
  const multaValor = baseSemestral * 0.10;
  const multaTotal = multaValor + multaAdicionalNum;

  // --- Estados: REGISTOS FINANCEIROS (Tabela Básica) ---
  const [registos, setRegistos] = useState<{ id: number; nome: string; valor: number; status: string }[]>([]);
  const [novoRegNome, setNovoRegNome] = useState('');
  const [novoRegValor, setNovoRegValor] = useState('');
  const [novoRegStatus, setNovoRegStatus] = useState('pendente');

  const addRegisto = () => {
    if (!novoRegNome || !novoRegValor) return;
    setRegistos([{ id: Date.now(), nome: novoRegNome, valor: parseCurrency(novoRegValor), status: novoRegStatus }, ...registos]);
    setNovoRegNome('');
    setNovoRegValor('');
  };

  const deleteRegisto = (id: number) => setRegistos(registos.filter(r => r.id !== id));
  
  // Totalizadores
  const totalArrecadado = registos.filter(r => r.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendente = registos.filter(r => r.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);

  // --- Funções de Cópia ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Proposta Copiada com Sucesso!'));
  };

  const copyPix = () => copyToClipboard(`💰 *PROPOSTA ESPECIAL PARA PAGAMENTO À VISTA!*\n\nValor original: ~${formatCurrency(pixNum)}~\n*Valor com ${descPix}% de desconto: ${formatCurrency(pixFinal)}* ✨\n\nEsta condição é válida para pagamento via PIX.`);
  const copyBoleto = () => copyToClipboard(`🧾 *ORÇAMENTO PARA PARCELAMENTO NO BOLETO*\n\n*Valor da Entrada:* ${formatCurrency(entradaBoleto)}\n*Restante em ${parcBoleto} de:* ${formatCurrency(parcelaBoleto)}\n\nPosso gerar os boletos para pagamento hoje?`);
  const copyCartao = () => copyToClipboard(`💳 *SIMULAÇÃO CARTÃO DE CRÉDITO*\n\n*Condição Selecionada:*\n${parcCartao}x de ${formatCurrency(cartaoParcela)}\n\n*Valor Total:* ${formatCurrency(cartaoTotal)}\n\nPodemos enviar o link de pagamento?`);
  const copyMulta = () => copyToClipboard(`*Detalhamento - Multa Contratual*\n\n📊 Valor Base Semestral: ${formatCurrency(baseSemestral)}\n⚖️ Multa Contratual (10%): ${formatCurrency(multaValor)}\n🗓️ Valores Adicionais: ${formatCurrency(multaAdicionalNum)}\n-----------------------------------\n💰 *TOTAL A PAGAR:* ${formatCurrency(multaTotal)}`);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black">Financeiro <span className="text-gray-400">/ Operacional</span></h1>

      {/* DASHBOARD FINANCEIRO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-t-4 border-t-green-500 relative overflow-hidden">
          <DollarSign className="absolute right-4 top-4 text-green-500 opacity-20" size={48} />
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">Total Recebido</p>
          <h3 className="text-3xl font-black text-green-500">{formatCurrency(totalArrecadado)}</h3>
        </div>
        <div className="glass-card p-6 border-t-4 border-t-yellow-500 relative overflow-hidden">
          <AlertTriangle className="absolute right-4 top-4 text-yellow-500 opacity-20" size={48} />
          <p className="text-xs uppercase font-bold text-gray-500 mb-1">A Receber (Pendente)</p>
          <h3 className="text-3xl font-black text-yellow-500">{formatCurrency(totalPendente)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIMULADORES E CALCULADORAS */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex bg-gray-100 dark:bg-dark-900 rounded-lg p-1 w-full border border-gray-200 dark:border-dark-700">
            <button onClick={() => setActiveTab('pix')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${activeTab === 'pix' ? 'bg-white dark:bg-dark-700 text-blue-500 shadow-sm' : 'text-gray-500'}`}>PIX</button>
            <button onClick={() => setActiveTab('boleto')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${activeTab === 'boleto' ? 'bg-white dark:bg-dark-700 text-purple-500 shadow-sm' : 'text-gray-500'}`}>Boleto</button>
            <button onClick={() => setActiveTab('cartao')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${activeTab === 'cartao' ? 'bg-white dark:bg-dark-700 text-orange-500 shadow-sm' : 'text-gray-500'}`}>Cartão</button>
            <button onClick={() => setActiveTab('multa')} className={`flex-1 py-2 text-xs font-bold uppercase rounded ${activeTab === 'multa' ? 'bg-white dark:bg-dark-700 text-red-500 shadow-sm' : 'text-gray-500'}`}>Multa</button>
          </div>

          <div className="glass-card p-6">
            {/* CALCULADORA PIX */}
            {activeTab === 'pix' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-bold flex items-center gap-2 text-blue-500 mb-4"><Calculator size={18}/> Simulador PIX</h3>
                <input type="text" value={valPix} onChange={handleMask(setValPix)} placeholder="Valor Original R$ 0,00" className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-blue-500" />
                <div>
                  <div className="flex justify-between mb-1"><span className="text-xs font-bold text-gray-500">Desconto</span><span className="font-bold text-blue-500">{descPix}%</span></div>
                  <input type="range" min="5" max="30" value={descPix} onChange={e => setDescPix(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex justify-between items-center mt-4">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Final PIX:</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(pixFinal)}</span>
                </div>
                <button onClick={copyPix} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-600 transition"><Copy size={16}/> Copiar Proposta</button>
              </div>
            )}

            {/* CALCULADORA BOLETO */}
            {activeTab === 'boleto' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-bold flex items-center gap-2 text-purple-500 mb-4"><Receipt size={18}/> Simulador Boleto</h3>
                <input type="text" value={valBoleto} onChange={handleMask(setValBoleto)} placeholder="Valor Total R$ 0,00" className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500" />
                <select value={parcBoleto} onChange={e => setParcBoleto(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-purple-500">
                  {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x no Boleto</option>)}
                </select>
                <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg mt-4 text-sm space-y-2">
                  <div className="flex justify-between"><span className="font-bold text-purple-600">Entrada ({(parcBoleto <= 6 ? 30 : 25)}%):</span><span className="font-bold text-purple-600">{formatCurrency(entradaBoleto)}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-purple-600">Restante:</span><span className="font-bold text-purple-600">{parcBoleto}x de {formatCurrency(parcelaBoleto)}</span></div>
                </div>
                <button onClick={copyBoleto} className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-purple-600 transition"><Copy size={16}/> Copiar Proposta</button>
              </div>
            )}

            {/* CALCULADORA CARTÃO */}
            {activeTab === 'cartao' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-bold flex items-center gap-2 text-orange-500 mb-4"><CreditCard size={18}/> Simulador Cartão</h3>
                <input type="text" value={valCartao} onChange={handleMask(setValCartao)} placeholder="Valor a Receber R$ 0,00" className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-orange-500" />
                <select value={parcCartao} onChange={e => setParcCartao(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-orange-500">
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x no Cartão</option>)}
                </select>
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg mt-4 text-sm space-y-2">
                  <div className="flex justify-between items-center"><span className="font-bold text-orange-600">Parcelas:</span><span className="text-xl font-black text-orange-600">{parcCartao}x de {formatCurrency(cartaoParcela)}</span></div>
                  <div className="flex justify-between border-t border-orange-500/20 pt-2"><span className="text-orange-600">Total com Taxas:</span><span className="font-bold text-orange-600">{formatCurrency(cartaoTotal)}</span></div>
                </div>
                <button onClick={copyCartao} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-orange-600 transition"><Copy size={16}/> Copiar Proposta</button>
              </div>
            )}

            {/* CALCULADORA MULTA */}
            {activeTab === 'multa' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-bold flex items-center gap-2 text-red-500 mb-4"><AlertTriangle size={18}/> Cálculo de Rescisão</h3>
                <input type="text" value={valMensalidade} onChange={handleMask(setValMensalidade)} placeholder="Valor da Mensalidade R$ 0,00" className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-red-500" />
                <input type="text" value={valAdicional} onChange={handleMask(setValAdicional)} placeholder="Valores em Atraso R$ 0,00" className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-red-500" />
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-4 text-sm space-y-2">
                  <div className="flex justify-between text-red-600/70"><span>Base Semestral (6x):</span><span>{formatCurrency(baseSemestral)}</span></div>
                  <div className="flex justify-between text-red-600 font-bold border-b border-red-500/20 pb-2"><span>Multa Contratual (10%):</span><span>{formatCurrency(multaValor)}</span></div>
                  <div className="flex justify-between items-center pt-2"><span className="font-bold text-red-600">Total a Pagar:</span><span className="text-xl font-black text-red-600">{formatCurrency(multaTotal)}</span></div>
                </div>
                <button onClick={copyMulta} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-red-600 transition"><Copy size={16}/> Copiar Resumo</button>
              </div>
            )}
          </div>
        </div>

        {/* GESTÃO DE REGISTOS / LANÇAMENTOS */}
        <div className="lg:col-span-7 glass-card p-6 min-h-[500px] flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2"><DollarSign className="text-iefe"/> Lançamentos e Cobranças</h3>
          
          <div className="flex gap-2 mb-6">
            <input type="text" value={novoRegNome} onChange={e => setNovoRegNome(e.target.value)} placeholder="Descrição (Ex: João Silva)" className="flex-1 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none text-sm" />
            <input type="text" value={novoRegValor} onChange={handleMask(setNovoRegValor)} placeholder="R$ 0,00" className="w-32 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none text-sm" />
            <select value={novoRegStatus} onChange={e => setNovoRegStatus(e.target.value)} className="w-32 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none text-sm">
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
            <button onClick={addRegisto} className="bg-iefe text-white px-4 rounded-lg font-bold hover:bg-iefe-dark transition"><Check size={20}/></button>
          </div>

          <div className="flex-1 overflow-auto border border-gray-200 dark:border-dark-700 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-dark-900 text-gray-500 font-bold uppercase text-xs sticky top-0">
                <tr>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                {registos.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">Nenhum registo financeiro encontrado.</td></tr>
                )}
                {registos.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/50 transition">
                    <td className="px-4 py-3 font-semibold">{r.nome}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(r.valor)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${r.status === 'pago' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteRegisto(r.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}