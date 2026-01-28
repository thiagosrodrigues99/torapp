import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface MercadoPagoConfigProps {
  onBack: () => void;
}

export const MercadoPagoConfig: React.FC<MercadoPagoConfigProps> = ({ onBack }) => {
  const [isSandbox, setIsSandbox] = useState(true);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [keys, setKeys] = useState({
    publicKey: '',
    accessToken: '',
    clientId: '8271029384'
  });

  // Load saved keys on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('torapp_mercadopago_keys');
    const savedSandbox = localStorage.getItem('torapp_mercadopago_sandbox');

    if (savedKeys) {
      setKeys(JSON.parse(savedKeys));
    } else {
      // Fallback to env or defaults
      setKeys({
        publicKey: import.meta.env.VITE_MP_PUBLIC_KEY || '',
        accessToken: import.meta.env.VITE_MP_ACCESS_TOKEN || '',
        clientId: '8271029384'
      });
    }

    if (savedSandbox !== null) {
      setIsSandbox(savedSandbox === 'true');
    }
  }, []);

  const webhookUrl = `${window.location.origin}/api/webhooks/mercadopago`;

  const handleTestConnection = async () => {
    if (!keys.accessToken) {
      setTestStatus('error');
      alert('Por favor, insira um Access Token para testar.');
      return;
    }

    setTestStatus('testing');

    try {
      const response = await fetch('https://api.mercadopago.com/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keys.accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestStatus('success');
        alert(`Conectado com sucesso como: ${data.nickname || 'Usuário MP'}`);
      } else {
        const errorData = await response.json();
        setTestStatus('error');
        alert(`Erro na API: ${errorData.message || 'Token inválido'}`);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      // Fallback for CORS issues if running in purely browser environment without proxy
      // Most MP APIs for developers allow CORS from validated origins or have specific headers
      setTestStatus('error');
      alert('Erro de rede ao conectar com o Mercado Pago. Verifique o console ou tente novamente.');
    }
  };

  const handleSave = () => {
    localStorage.setItem('torapp_mercadopago_keys', JSON.stringify(keys));
    localStorage.setItem('torapp_mercadopago_sandbox', isSandbox.toString());
    alert('Configurações salvas com sucesso!');
    onBack();
  };

  return (
    <div className="bg-background-dark text-gray-94 min-h-screen flex flex-col font-display">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 max-w-lg mx-auto gap-4">
          <button
            onClick={onBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight text-white uppercase italic">Mercado Pago</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 w-full flex-grow">
        <div className="flex flex-col gap-8">
          {/* Header Info */}
          <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Icon name="payments" className="text-7xl" />
            </div>
            <div className="size-16 rounded-2xl bg-[#009EE3] flex items-center justify-center shrink-0 shadow-lg shadow-[#009EE3]/20">
              <img
                src="https://vignette.wikia.nocookie.net/logopedia/images/2/22/Mercado_Pago_2017.png/revision/latest?cb=20210214154425"
                alt="MP"
                className="w-10 h-10 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">Gateway de Pagamento</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`size-2 rounded-full ${testStatus === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {testStatus === 'success' ? 'Link Ativo' : 'Aguardando Configuração'}
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Chave Pública (Public Key)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Icon name="vpn_key" />
                  </div>
                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-card-dark border border-white/10 text-white placeholder:text-slate-600 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="APP_USR-7829..."
                    type="text"
                    value={keys.publicKey}
                    onChange={(e) => setKeys({ ...keys, publicKey: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">Token de Acesso (Access Token)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Icon name="lock" />
                  </div>
                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-card-dark border border-white/10 text-white placeholder:text-slate-600 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="APP_USR-9281..."
                    type="password"
                    value={keys.accessToken}
                    onChange={(e) => setKeys({ ...keys, accessToken: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Config & Toggle */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-card-dark border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Icon name="bug_report" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">Modo Sandbox</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ambiente de Testes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSandbox(!isSandbox)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isSandbox ? 'bg-primary' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${isSandbox ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-card-dark border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="webhook" className="text-primary" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Notificações IPN</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('URL copiada!');
                    }}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Copiar URL
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[9px] text-slate-400 break-all leading-relaxed">
                  {webhookUrl}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-6">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3"
              >
                {testStatus === 'testing' ? (
                  <Icon name="sync" className="animate-spin" />
                ) : (
                  <Icon name={testStatus === 'success' ? 'check_circle' : testStatus === 'error' ? 'error' : 'bolt'} className={testStatus === 'success' ? 'text-emerald-500' : testStatus === 'error' ? 'text-red-500' : ''} />
                )}
                {testStatus === 'testing' ? 'Verificando...' : testStatus === 'success' ? 'Conexão Estabelecida' : testStatus === 'error' ? 'Falha na Conexão' : 'Testar Credenciais'}
              </button>

              <button
                className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs italic"
                type="button"
                onClick={handleSave}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="p-8 text-center text-slate-600">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Mercado Pago API v2 • Pro Edition</p>
      </footer>
    </div>
  );
};
