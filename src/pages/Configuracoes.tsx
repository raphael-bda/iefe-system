import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Settings, User, Image as ImageIcon, Volume2, VolumeX, 
  Moon, Sun, Trash2, LogOut, Save 
} from 'lucide-react';

export function Configuracoes() {
  const { theme, toggleTheme } = useStore();
  
// Estados do Perfil
  const [userName, setUserName] = useState(() => localStorage.getItem('ODIN_USER_NAME') || 'Utilizador');
  const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem('ODIN_USER_PHOTO') || '');
  
  // Estados de Preferências
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('ODIN_MUTE') === 'true');

  // Funções de Perfil
  const handleSaveProfile = () => {
    if (!userName.trim()) return alert('Nome inválido.');
    localStorage.setItem('ODIN_USER_NAME', userName);
    alert('Perfil atualizado com sucesso!');
  };

  const handleChangePhoto = () => {
    const url = prompt("Cole o URL da sua nova foto (formato quadrado recomendado):", userPhoto);
    if (url) {
      localStorage.setItem('ODIN_USER_PHOTO', url);
      setUserPhoto(url);
      alert('Foto de perfil alterada.');
    }
  };

  // Funções de Preferências
  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    localStorage.setItem('ODIN_MUTE', String(newVal));
  };

  // Funções de Perigo
  const handleClearCache = () => {
    if (confirm('ATENÇÃO: Isto apagará todos os leads, alunos e configurações guardados neste navegador. Deseja continuar?')) {
      localStorage.clear();
      alert('Sistema reposto. A página será recarregada.');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (confirm('Tem a certeza que deseja terminar a sessão?')) {
      // Aqui integrarias com a tua lógica de Autenticação Real
      alert('Sessão terminada.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black flex items-center gap-3">
        <Settings className="text-iefe" size={32} />
        Configurações <span className="text-gray-400 text-2xl">/ Sistema</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Painel de Perfil */}
        <div className="glass-card p-6 border-t-4 border-t-iefe h-fit">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
            <User className="text-iefe" size={20}/> O Seu Perfil
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative group cursor-pointer" onClick={handleChangePhoto}>
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-dark-800 border-4 border-white dark:border-dark-700 shadow-lg overflow-hidden flex items-center justify-center">
                {userPhoto ? (
                  <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <ImageIcon className="text-white" size={24} />
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">Nome de Exibição</label>
                <input 
                  type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-3 outline-none focus:border-iefe transition-colors font-bold"
                />
              </div>
            </div>
          </div>
          
          <button onClick={handleSaveProfile} className="w-full bg-iefe text-white font-bold py-3 rounded-lg hover:bg-iefe-dark transition flex items-center justify-center gap-2">
            <Save size={18} /> Guardar Alterações
          </button>
        </div>

        <div className="space-y-6">
          {/* Painel de Preferências */}
          <div className="glass-card p-6 border-t-4 border-t-blue-500">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
              <Settings className="text-blue-500" size={20}/> Preferências do Sistema
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="text-blue-500" size={20}/> : <Sun className="text-orange-500" size={20}/>}
                  <div>
                    <p className="font-bold text-sm">Tema do Sistema</p>
                    <p className="text-xs text-gray-500">Alternar entre modo Claro e Escuro</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className="px-4 py-2 bg-gray-200 dark:bg-dark-800 hover:bg-gray-300 dark:hover:bg-dark-700 rounded-lg text-xs font-bold uppercase transition">
                  {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-3">
                  {isMuted ? <VolumeX className="text-red-500" size={20}/> : <Volume2 className="text-green-500" size={20}/>}
                  <div>
                    <p className="font-bold text-sm">Efeitos Sonoros</p>
                    <p className="text-xs text-gray-500">Silenciar notificações do sistema</p>
                  </div>
                </div>
                <button 
                  onClick={toggleMute} 
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${isMuted ? 'bg-red-100 text-red-600 dark:bg-red-500/10' : 'bg-green-100 text-green-600 dark:bg-green-500/10'}`}
                >
                  {isMuted ? 'Silenciado (OFF)' : 'Ativo (ON)'}
                </button>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="glass-card p-6 border-t-4 border-t-red-500">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
              <Trash2 size={20}/> Zona de Perigo
            </h3>
            <p className="text-sm text-gray-500 mb-4">Ações irreversíveis que afetam o armazenamento local deste dispositivo.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleLogout} className="w-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                <LogOut size={16} /> Terminar Sessão
              </button>
              <button onClick={handleClearCache} className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 font-bold py-3 rounded-lg transition border border-red-200 dark:border-red-500/30 flex items-center justify-center gap-2 text-sm">
                <Trash2 size={16} /> Repor Sistema
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}