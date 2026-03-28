import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Zap, CreditCard, ChevronRight, CheckCircle2, 
  TrendingUp, Sparkles, Star, Globe, Clock, BookOpen
} from 'lucide-react';

const LimitModal = ({ brand, onClose, onUpgrade }) => {
  const balance = brand.credit_balance || 0;
  const extra = brand.extra_credits || 0;
  const total = balance + extra;

  const PLAN_SPECS = {
    free: { name: 'Free', price: 0, credits: 10, isMonthly: false },
    basico: { name: 'Básico', price: 67, credits: 80, isMonthly: true },
    crescimento: { name: 'Crescimento', price: 147, credits: 240, isMonthly: true },
    completo: { name: 'Completo', price: 197, credits: 400, isMonthly: true }
  };

  const nextPlanKey = {
    free: 'basico',
    basico: 'crescimento',
    crescimento: 'completo',
    completo: null
  }[brand.plan || 'free'];

  const nextPlan = nextPlanKey ? PLAN_SPECS[nextPlanKey] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 font-inter"
    >
      <div className="w-full max-w-5xl glass border border-white/10 rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#c4973b]/20 to-transparent blur-[100px] pointer-events-none" />
        
        <div className="p-10 text-center space-y-4 relative z-10 flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-[#c4973b]/10 text-[#c4973b] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(196,151,59,0.1)]">
            <Zap size={32} />
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
            Potencialize sua Marca com Créditos.
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
            Seu saldo atual é de <span className="text-white">{total} créditos</span>. 
            No PostDNA, cada ação consome créditos de forma inteligente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10 pt-0 relative z-10 overflow-auto">
          
          {/* PLANO BÁSICO */}
          <div className={`p-8 rounded-[32px] border transition-all flex flex-col justify-between ${brand.plan === 'basico' ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/[0.03] hover:border-white/10'}`}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-400">Básico</h3>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-black text-white">R$67</span>
                  <span className="text-[10px] uppercase font-black text-gray-600">/mês</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> 80 créditos mensais
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> Estratégia Sherlock
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> Postagens Ilimitadas
                </li>
              </ul>
            </div>
            <button 
              onClick={() => onUpgrade('basico')}
              className="w-full py-4 rounded-xl bg-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all mt-8">
              {brand.plan === 'basico' ? 'Seu Plano Atual' : 'Migrar para Básico'}
            </button>
          </div>

          {/* PLANO CRESCIMENTO (POPULAR) */}
          <div className={`p-8 rounded-[32px] border relative overflow-hidden transition-all flex flex-col justify-between ${brand.plan === 'crescimento' ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-[#c4973b]/30 bg-[#c4973b]/5 hover:border-[#c4973b]/50'}`}>
            <div className="absolute top-0 right-0 p-4">
               <div className="bg-[#c4973b] px-3 py-1 rounded-full text-[8px] font-black italic uppercase tracking-widest text-black shadow-lg shadow-[#c4973b]/20">Popular</div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#c4973b]">Crescimento</h3>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-black text-white">R$147</span>
                  <span className="text-[10px] uppercase font-black text-gray-600">/mês</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> 240 créditos mensais
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> Prioridade na Fila IA
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> Análise de Concorrência
                </li>
              </ul>
            </div>
            <button 
              onClick={() => onUpgrade('crescimento')}
              className="w-full py-5 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all mt-8 shadow-xl">
              {brand.plan === 'crescimento' ? 'Seu Plano Atual' : 'Escolher Crescimento'}
            </button>
          </div>

          {/* PLANO COMPLETO */}
          <div className={`p-8 rounded-[32px] border transition-all flex flex-col justify-between ${brand.plan === 'completo' ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/[0.03] hover:border-white/10'}`}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-400">Completo</h3>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-black text-white">R$197</span>
                  <span className="text-[10px] uppercase font-black text-gray-600">/mês</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#c4973b] font-black text-[10px] uppercase tracking-wider">
                  <BookOpen size={14}/> Inclui ARTIGOS DE BLOG
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> 400 créditos mensais
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                  <CheckCircle2 size={14} className="text-[#c4973b]"/> Suporte VIP 24/7
                </li>
              </ul>
            </div>
            <button 
              onClick={() => onUpgrade('completo')}
              className="w-full py-4 rounded-xl bg-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all mt-8">
              {brand.plan === 'completo' ? 'Seu Plano Atual' : 'Quero ser Completo'}
            </button>
          </div>

        </div>

        <div className="p-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/40 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Custo por Ação:</p>
              <div className="flex gap-4">
                <span className="text-[8px] font-bold text-gray-400 uppercase">Post Estático: 4 cr</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Carrossel: 10 cr</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Blog: 8 cr</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-white font-black uppercase tracking-widest text-[9px] transition-colors"
          >
            Voltar para o Dashboard
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default LimitModal;
