import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, CreditCard, Settings, Shield, Bell, Check, 
  ChevronRight, Camera, LogOut, Download, Trash2, 
  ExternalLink, Globe, LayoutDashboard, Zap, AlertTriangle
} from 'lucide-react';

export default function SettingsPage({ brand, setBrand, onUpgrade, onBuyCredits, onCancelClick }) {
  const [activeSection, setActiveSection] = useState('perfil');
  const [saveStatus, setSaveStatus] = useState(null);
  const [editingField, setEditingField] = useState(null);

  // MOCK DATA FOR SETTINGS
  const [profileData, setProfileData] = useState({
    name: brand?.userName || 'Usuário PostDNA',
    email: brand?.userEmail || 'usuario@postdna.ai',
    photo: brand?.logo || null
  });

  const billingHistory = [
    { id: 1, date: '15/03/2026', amount: 'R$ 67,00', plan: 'Básico', status: 'Pago' },
    { id: 2, date: '15/02/2026', amount: 'R$ 67,00', plan: 'Básico', status: 'Pago' },
    { id: 3, date: '15/01/2026', amount: 'R$ 29,00', plan: 'Pack 10 CR', status: 'Pago' },
  ];

  const handleSave = (field) => {
    setSaveStatus(field);
    setEditingField(null);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const sections = [
    { id: 'perfil', label: 'Perfil', icon: <User size={18} /> },
    { id: 'plano', label: 'Plano e Créditos', icon: <CreditCard size={18} /> },
    { id: 'preferencias', label: 'Preferências', icon: <Settings size={18} /> },
    { id: 'privacidade', label: 'Privacidade e Segurança', icon: <Shield size={18} /> },
  ];

  // ── SECTIONS RENDERERS ──────────────────────────────────────────────────

  const renderProfile = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 glass border border-white/5 rounded-[32px]">
        <div className="relative group">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {profileData.photo ? <img src={profileData.photo} className="w-full h-full object-cover" /> : <User size={40} className="text-gray-600" />}
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl intel-gradient flex items-center justify-center text-black border-4 border-[#0b0b0f] opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
            <Camera size={18} />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">{profileData.name}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">ID PostDNA: #DNA-{Math.floor(Math.random()*90000+10000)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          { key: 'name', label: 'Nome Completo', value: profileData.name },
          { key: 'email', label: 'E-mail Principal', value: profileData.email },
          { key: 'password', label: 'Senha', value: '••••••••••••', type: 'password' }
        ].map(field => (
          <div key={field.key} className="p-6 glass border border-white/5 rounded-[28px] flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{field.label}</p>
              {editingField === field.key ? (
                <input 
                  type={field.type || 'text'} 
                  defaultValue={field.key === 'password' ? '' : field.value}
                  autoFocus
                  className="bg-white/5 border border-accent/20 rounded-lg px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-accent w-64"
                />
              ) : (
                <p className={`text-sm font-bold text-white ${field.key === 'password' ? 'tracking-[0.5em]' : ''}`}>{field.value}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === field.key && (
                <span className="text-[9px] font-black uppercase text-green-500 flex items-center gap-1 animate-in fade-in zoom-in">
                  <Check size={12} /> Salvo com sucesso
                </span>
              )}
              {editingField === field.key ? (
                <button 
                  onClick={() => handleSave(field.key)}
                  className="px-4 py-2 rounded-xl intel-gradient text-black text-[10px] font-black uppercase tracking-widest"
                >
                  Salvar
                </button>
              ) : (
                <button 
                  onClick={() => setEditingField(field.key)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-accent/40 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlan = () => {
    const planName = (brand.plan || 'free').toUpperCase() === 'FREE' ? 'GRATUITO' : (brand.plan || 'free').toUpperCase();
    const planPrice = planName === 'GRATUITO' ? 'R$ 0' : planName === 'BÁSICO' ? 'R$ 67' : planName === 'CRESCIMENTO' ? 'R$ 147' : 'R$ 197';
    const totalCredits = (brand.credit_balance || 0) + (brand.extra_credits || 0);
    const limitCredits = 240; // Example
    const progress = (totalCredits / limitCredits) * 100;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 glass border border-accent/20 rounded-[32px] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <CreditCard size={80} className="text-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Plano Atual</p>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">{planName}</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">{planPrice} <span className="text-gray-500 text-xs">/mês</span></p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assinatura Ativa</p>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Próxima renovação: 15/04/2026</p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button onClick={() => onUpgrade?.()} className="w-full py-4 rounded-2xl intel-gradient text-black font-black uppercase tracking-widest text-[10px] shadow-lg">Fazer Upgrade</button>
              <button 
                onClick={() => onCancelClick?.()}
                className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors"
              >
                Cancelar Plano
              </button>
            </div>
          </div>

          <div className="p-8 glass border border-white/5 rounded-[32px] space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Créditos de Marca</p>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">{totalCredits} <span className="text-gray-500">CR</span></h3>
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">{limitCredits - totalCredits} USADOS</span>
                <span className="text-accent">{totalCredits} DISPONÍVEIS</span>
              </div>
              <div className="pt-4 space-y-4 border-t border-white/5">
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Seus créditos mensais renovam em 18 dias. Precisa acelerar?</p>
                <button onClick={() => onBuyCredits?.()} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:border-accent/40 transition-all">Comprar Créditos Avulsos</button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-[32px] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
             <h4 className="text-sm font-black uppercase italic tracking-tighter">Histórico de Faturamente</h4>
             <button className="text-[9px] font-black uppercase tracking-widest text-accent">Ver Completo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">Data</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">Valor</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">Plano</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {billingHistory.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5 text-xs font-bold text-gray-300">{invoice.date}</td>
                    <td className="px-8 py-5 text-xs font-black text-white">{invoice.amount}</td>
                    <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{invoice.plan}</td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-accent transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPreferences = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="p-8 glass border border-white/5 rounded-[32px] space-y-8">
        <div className="space-y-2">
           <h4 className="text-sm font-black uppercase italic tracking-tighter">Idioma da Interface</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Como você quer ver o painel de controle</p>
        </div>
        <div className="flex gap-4">
           {[
             { id: 'pt-BR', label: 'Português', flag: '🇧🇷' },
             { id: 'es', label: 'Español', flag: '🇪🇸' }
           ].map(l => (
             <button 
                key={l.id}
                onClick={() => setBrand(p => ({ ...p, interfaceLanguage: l.id }))}
                className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[24px] border transition-all ${brand.interfaceLanguage === l.id ? 'bg-accent/10 border-accent text-white shadow-xl shadow-accent/5' : 'bg-white/3 border-white/5 text-gray-500 hover:border-white/10'}`}
             >
                <span className="text-2xl">{l.flag}</span>
                <span className="text-xs font-black uppercase tracking-widest">{l.label}</span>
             </button>
           ))}
        </div>
      </section>

      <section className="p-8 glass border border-white/5 rounded-[32px] space-y-8">
        <div className="space-y-2">
           <h4 className="text-sm font-black uppercase italic tracking-tighter">Idioma do Conteúdo Gerado</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Em qual idioma o Sherlock deve escrever para você?</p>
        </div>
        <div className="flex gap-4">
           {[
             { id: 'pt-BR', label: 'Português', flag: '🇧🇷' },
             { id: 'es', label: 'Español', flag: '🇪🇸' }
           ].map(l => (
             <button 
                key={l.id}
                onClick={() => setBrand(p => ({ ...p, contentLanguage: l.id }))}
                className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-[24px] border transition-all ${brand.contentLanguage === l.id ? 'bg-accent/10 border-accent text-white shadow-xl shadow-accent/5' : 'bg-white/3 border-white/5 text-gray-500 hover:border-white/10'}`}
             >
                <span className="text-2xl">{l.flag}</span>
                <span className="text-xs font-black uppercase tracking-widest">{l.label}</span>
             </button>
           ))}
        </div>
      </section>

      <section className="p-8 glass border border-white/5 rounded-[32px] space-y-6">
        <div className="space-y-2 mb-4">
           <h4 className="text-sm font-black uppercase italic tracking-tighter">Notificações</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Escolha o que quer receber</p>
        </div>
        
        {[
          { key: 'notify_ready', label: 'Conteúdo Pronto', desc: 'Avisar imediatamente quando o Sherlock concluir a geração.' },
          { key: 'notify_credits', label: 'Créditos Acabando', desc: 'Avisar quando você atingir 20% do saldo mensal.' },
          { key: 'notify_renewal', label: 'Lembrete de Renovação', desc: 'Avisar 3 dias antes da renovação automática.' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
             <div className="space-y-1">
                <p className="text-xs font-bold text-white">{item.label}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">{item.desc}</p>
             </div>
             <button 
               onClick={() => setBrand(p => ({ ...p, [item.key]: !p[item.key] !== false }))}
               className={`w-12 h-6 rounded-full p-1 transition-all ${brand[item.key] !== false ? 'bg-accent' : 'bg-white/10'}`}
             >
                <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${brand[item.key] !== false ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
          </div>
        ))}
      </section>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="glass border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <h4 className="text-sm font-black uppercase italic tracking-tighter">Sessões Ativas</h4>
           <button className="text-[9px] font-black uppercase tracking-widest text-red-400">Encerrar todas</button>
        </div>
        <div className="p-4 space-y-2">
          {[
            { device: 'MacBook Pro', browser: 'Chrome', location: 'São Paulo, BR', current: true },
            { device: 'iPhone 15 Pro', browser: 'Safari', location: 'São Paulo, BR', current: false }
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/3 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                     <LayoutDashboard size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                       {session.device} 
                       {session.current && <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[7px] font-black uppercase">Atual</span>}
                    </p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{session.browser} • {session.location}</p>
                  </div>
               </div>
               {!session.current && <button className="text-[9px] font-black uppercase text-gray-500 hover:text-red-400">Encerrar</button>}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 glass border border-white/5 rounded-[32px] space-y-4">
           <h4 className="text-sm font-black uppercase italic tracking-tighter">Exportar Dados</h4>
           <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
             Baixe todos os seus conteúdos aprovados, DNA da Marca e histórico em um arquivo ZIP.
           </p>
           <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:text-accent transition-all flex items-center justify-center gap-2">
             <Download size={14} /> Solicitar Exportação
           </button>
        </div>

        <div className="p-8 glass border border-red-500/10 rounded-[32px] space-y-4">
           <h4 className="text-sm font-black uppercase italic tracking-tighter text-red-400">Zona de Perigo</h4>
           <p className="text-[10px] text-red-500/60 font-bold leading-relaxed uppercase tracking-widest">
             A exclusão de conta é permanente e não pode ser desfeita.
           </p>
           <button className="w-full py-4 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
             <Trash2 size={14} /> Excluir Conta
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 max-w-6xl">
      {/* Sidebar de Configurações */}
      <aside className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-4 p-5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
              activeSection === section.id 
                ? 'bg-accent text-black shadow-xl shadow-accent/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2">
           <button className="flex items-center gap-4 p-5 rounded-[20px] text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/5 transition-all">
             <LogOut size={18} /> Sair da Conta
           </button>
        </div>
      </aside>

      {/* Conteúdo da Seção */}
      <main className="flex-1 min-w-0">
         <header className="mb-10 space-y-1">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
               {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Gerencie suas informações e segurança no PostDNA</p>
         </header>

         {activeSection === 'perfil' && renderProfile()}
         {activeSection === 'plano' && renderPlan()}
         {activeSection === 'preferencias' && renderPreferences()}
         {activeSection === 'privacidade' && renderSecurity()}
      </main>
    </div>
  );
}
