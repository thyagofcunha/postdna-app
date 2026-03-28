import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, ChevronRight, Loader2 } from 'lucide-react';

const SignupView = ({ onSignup }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    setLoading(true);
    setTimeout(() => {
      onSignup(formData);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#c4973b]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#c4973b]/5 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-10 relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-2xl shadow-[#c4973b]/20">
              <Zap size={32} className="text-black" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Post<span className="text-[#c4973b]">DNA</span>
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white/90">Sua jornada começa aqui</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Crie sua conta gratuita e comece sua estratégia</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c4973b] transition-colors" />
              <input 
                type="text" 
                placeholder="Seu nome" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#c4973b]/50 focus:bg-[#c4973b]/3 transition-all outline-none font-bold text-sm"
              />
            </div>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c4973b] transition-colors" />
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#c4973b]/50 focus:bg-[#c4973b]/3 transition-all outline-none font-bold text-sm"
              />
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#c4973b] transition-colors" />
              <input 
                type="password" 
                placeholder="Crie uma senha forte" 
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-[#c4973b]/50 focus:bg-[#c4973b]/3 transition-all outline-none font-bold text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Criar minha conta agora <ChevronRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest">
          Ao clicar, você concorda com nossos termos de uso
        </p>
      </motion.div>
    </div>
  );
};

export default SignupView;
