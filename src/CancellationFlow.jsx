import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, ArrowLeft, ArrowRight, Check, 
  ChevronRight, DollarSign, Download, History, 
  MessageSquare, Pause, Search, Sparkles, Trash2, X, Zap 
} from 'lucide-react';

export default function CancellationFlow({ brand, onConfirm, onDowngrade, onPause, onClose, setGlobalAlert }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);

  const planHierarchy = ['free', 'basico', 'crescimento', 'completo'];
  const currentPlan = brand.plan || 'free';
  const currentIndex = planHierarchy.indexOf(currentPlan);
  
  const downgradePlan = currentIndex > 1 ? planHierarchy[currentIndex - 1] : 'basico';
  const downgradePlanName = downgradePlan.toUpperCase() === 'BASICO' ? 'BÁSICO' : downgradePlan.toUpperCase();
  const downgradePrice = downgradePlan === 'basico' ? '67' : '147';
  const downgradeCredits = downgradePlan === 'basico' ? '80' : '240';

  const reasons = [
    { id: 'expensive',    label: 'Está caro para mim agora' },
    { id: 'not_using',    label: 'Não estou usando o suficiente' },
    { id: 'alternative',  label: 'Encontrei outra ferramenta' },
    { id: 'not_met',      label: 'O produto não atendeu o que eu esperava' },
    { id: 'pause_biz',    label: 'Estou pausando meu negócio temporariamente' },
    { id: 'other',        label: 'Outro motivo' },
  ];

  const handleNext = () => {
    if (reason === 'alternative' || reason === 'not_met') {
      if (!reasonText.trim()) {
        setGlobalAlert?.({
          title: "Feedback Essencial",
          message: "Poderia nos contar um pouco mais sobre o que faltou? Seu feedback é vital para melhorarmos.",
          type: "warning"
        });
        return;
      }
      setStep(3); // Skip offer for these reasons
    } else {
      setStep(2);
    }
  };

  const finalizeCancellation = () => {
    onConfirm({ reason, reasonText });
    setIsFinalized(true);
    setStep(4);
  };

  const renderReasonStep = () => (
    <div className="space-y-8 max-w-lg mx-auto py-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Sentimos muito que você queira sair.</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Antes de cancelar, nos conta o que aconteceu?</p>
      </div>

      <div className="space-y-3">
        {reasons.map(r => (
          <button
            key={r.id}
            onClick={() => setReason(r.id)}
            className={`w-full p-5 rounded-[24px] border transition-all text-left flex items-center justify-between group ${reason === r.id ? 'bg-accent/10 border-accent text-white' : 'bg-white/3 border-white/5 text-gray-400 hover:border-white/20'}`}
          >
            <span className="text-xs font-black uppercase tracking-widest">{r.label}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${reason === r.id ? 'border-accent bg-accent text-black' : 'border-white/10 group-hover:border-white/20'}`}>
              {reason === r.id && <Check size={12} strokeWidth={4} />}
            </div>
          </button>
        ))}
      </div>

      {reason && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Quer nos contar mais? (opcional)</p>
           <textarea 
             value={reasonText}
             onChange={e => setReasonText(e.target.value)}
             placeholder="Seu feedback ajuda a melhorar o PostDNA..."
             className="w-full bg-white/3 border border-white/5 rounded-[24px] p-5 text-sm font-bold text-white outline-none focus:border-accent/40 h-32 resize-none"
           />
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        <button 
          onClick={handleNext}
          disabled={!reason}
          className="w-full py-5 rounded-[24px] intel-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl disabled:opacity-20 transition-all hover:scale-[1.02]"
        >
          Continuar →
        </button>
        <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors">Voltar</button>
      </div>
    </div>
  );

  const renderOfferStep = () => {
    if (reason === 'expensive' || reason === 'other') {
      return (
        <div className="space-y-8 max-w-2xl mx-auto py-12 text-center">
          <div className="space-y-4">
             <div className="w-16 h-16 rounded-[20px] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                <DollarSign size={32} />
             </div>
             <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">E se você pagasse menos?</h2>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
               Você mantém o PostDNA, sua identidade visual e todo o histórico de conteúdos. Só reduz a quantidade de criações mensais.
             </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-6">
            <div className="p-6 rounded-[32px] glass border border-white/5 opacity-40 grayscale scale-90 w-full max-w-[240px]">
               <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Seu Plano Atual</p>
               <p className="text-xl font-black uppercase italic text-white">{currentPlan.toUpperCase()}</p>
               <p className="text-xs font-bold text-gray-500 mt-2">Valor Total</p>
            </div>
            
            <ChevronRight size={32} className="text-accent hiden md:block animate-pulse" />

            <div className="p-8 rounded-[40px] glass border border-accent/30 bg-accent/5 w-full max-w-[320px] shadow-2xl shadow-accent/5 ring-1 ring-accent/20">
               <p className="text-[10px] font-black uppercase text-accent mb-2">Proposta de Downgrade</p>
               <p className="text-3xl font-black uppercase italic text-white">{downgradePlanName}</p>
               <p className="text-lg font-black text-accent mt-4">R$ {downgradePrice}<span className="text-[10px] text-gray-500">/mês</span></p>
               <ul className="mt-6 space-y-2 text-left">
                 <li className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                   <Check size={12} className="text-green-500" /> {downgradeCredits} Créditos de Marca
                 </li>
                 <li className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                   <Check size={12} className="text-green-500" /> Histórico Mantido
                 </li>
               </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-sm mx-auto">
             <button 
               onClick={() => onDowngrade(downgradePlan)}
               className="w-full py-5 rounded-[24px] intel-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl"
             >
               Mudar para o Plano {downgradePlanName}
             </button>
             <button onClick={() => setStep(3)} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-red-400 transition-colors">Continuar cancelando</button>
          </div>
        </div>
      );
    }

    if (reason === 'not_using' || reason === 'pause_biz') {
      return (
        <div className="space-y-8 max-w-lg mx-auto py-12 text-center">
          <div className="space-y-4">
             <div className="w-16 h-16 rounded-[20px] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                <Pause size={32} />
             </div>
             <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Que tal pausar por um mês?</h2>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
               Podemos suspender sua cobrança por 30 dias. Você não perde nenhum conteúdo, seu DNA da Marca fica salvo e você volta quando quiser.
             </p>
          </div>

          <div className="p-8 rounded-[40px] glass border border-white/10 bg-white/3 space-y-6">
             <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Zap size={20}/></div>
                <div>
                   <p className="text-xs font-black text-white uppercase italic">Pausa de 30 dias</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Próxima cobrança apenas em maio</p>
                </div>
             </div>
             <ul className="space-y-3 pt-6 border-t border-white/5">
                <li className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> DNA da Marca 100% Protegido
                </li>
                <li className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Histórico de Posts Mantido
                </li>
                <li className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Sem custos de reativação
                </li>
             </ul>
          </div>

          <div className="flex flex-col gap-4">
             <button 
               onClick={onPause}
               className="w-full py-5 rounded-[24px] intel-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl"
             >
               Pausar por 30 dias
             </button>
             <button onClick={() => setStep(3)} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-red-400 transition-colors">Continuar cancelando</button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderFinalStep = () => (
    <div className="space-y-8 max-w-lg mx-auto py-12">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 mb-4 animate-pulse">
           <AlertTriangle size={24} />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Última confirmação.</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Você perderá o acesso aos seguintes recursos:</p>
      </div>

      <div className="space-y-3">
        <div className="p-5 rounded-[24px] bg-red-500/5 border border-red-500/10 flex items-center gap-4">
           <X size={18} className="text-red-500 shrink-0" />
           <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Você não poderá mais criar conteúdo com o PostDNA</p>
        </div>
        <div className="p-5 rounded-[24px] bg-red-500/5 border border-red-500/10 flex items-center gap-4">
           <X size={18} className="text-red-500 shrink-0" />
           <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Suas sugestões salvas do Sherlock serão removidas</p>
        </div>
        <div className="p-5 rounded-[24px] bg-red-500/5 border border-red-500/10 flex items-center gap-4">
           <X size={18} className="text-red-500 shrink-0" />
           <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">O histórico de inteligência de mercado será apagado</p>
        </div>
        <div className="p-5 rounded-[24px] bg-green-500/5 border border-green-500/10 flex items-center gap-4">
           <Check size={18} className="text-green-500 shrink-0" />
           <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Seus conteúdos aprovados ficam disponíveis por 30 dias</p>
        </div>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-[24px] p-6 text-center">
         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Seu plano permanece ativo até</p>
         <p className="text-sm font-black text-white uppercase italic tracking-tighter mt-1">
           {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
         </p>
         <p className="text-[8px] font-bold text-gray-600 uppercase mt-2">Você não será cobrado após essa data.</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={onClose}
          className="w-full py-5 rounded-[24px] intel-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl"
        >
          Ops, quero ficar →
        </button>
        <button 
          onClick={finalizeCancellation}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-400 transition-colors py-2"
        >
          Confirmar cancelamento
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-10 max-w-lg mx-auto py-12 text-center animate-in fade-in zoom-in-95 duration-700">
       <div className="relative">
          <div className="w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
             <Trash2 size={48} />
          </div>
          <div className="absolute inset-0 blur-3xl bg-red-500/20 -z-10 rounded-full" />
       </div>

       <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Cancelamento confirmado.</h2>
          <div className="space-y-2 max-w-xs mx-auto">
             <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
               Seu plano segue ativo até <span className="text-white">15/04</span>.
             </p>
             <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
               Seus conteúdos ficam disponíveis para download até <span className="text-white">15/05</span>.
             </p>
          </div>
       </div>

       <div className="space-y-4 pt-6">
          <button className="w-full py-5 rounded-[24px] bg-white border border-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/90 transition-all">
             <Download size={16} /> Exportar meus conteúdos agora
          </button>
          <button onClick={onClose} className="w-full py-5 rounded-[24px] bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-white transition-all">
             Voltar ao dashboard
          </button>
       </div>

       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
         Enviamos um e-mail com os detalhes do encerramento.
       </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#0b0b0f] flex items-start justify-center p-6 overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className="w-full"
        >
          {step === 1 && renderReasonStep()}
          {step === 2 && renderOfferStep()}
          {step === 3 && renderFinalStep()}
          {step === 4 && renderSuccessStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
