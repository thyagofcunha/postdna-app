import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Layers, Camera, Globe, Lock, 
  Zap, ChevronRight, Clock, Plus, History, CheckCircle2,
  Search, MessageSquare
} from 'lucide-react';

const CreateContentPage = ({ brand, onRunPipeline, recentContent = [], onOpenItem, onRefreshSuggestions, initialType, initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [type, setType] = useState(initialType || 'CARROSSEL');
  const [objective, setObjective] = useState('EDUCAR');
  const [vibe, setVibe] = useState('editorial');
  
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  const plan = brand.plan || 'free';
  const balance = brand.credit_balance || 0;
  const extra = brand.extra_credits || 0;
  const totalCredits = balance + extra;
  
  const CREDIT_COSTS = {
    CAPTION: 2,
    STORY_SIMPLE: 3,
    POST: 4,
    STORY_CAROUSEL: 8,
    BLOG: 8,
    CARROSSEL: 10
  };

  const getCost = (t) => CREDIT_COSTS[t] || 10;
  const canGenerate = totalCredits >= getCost(type);
  
  const savedIdeasForType = (brand.saved_suggestions || []).filter(s => s.suggested_format === type).slice(0,3);

  const getPlaceholder = () => {
    const p = {
      CARROSSEL: "Sobre o que é esse carrossel? Digite o tema ou use o Sherlock...",
      POST: "Qual o tema desse post estático?",
      STORY_SIMPLE: "O que vamos anunciar nesse story?",
      STORY_CAROUSEL: "Qual a narrativa desse carrossel de stories?",
      BLOG: "Sobre qual assunto vamos escrever hoje?",
      CAPTION: "Para qual post você precisa de legenda?",
    };
    return p[type] || "Digite o tema do seu conteúdo...";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DINÂMICO */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#00BFC6] mb-2">
             Formato: {type}
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white font-sora">O que o Squad deve criar hoje?</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
            {totalCredits} créditos disponíveis — este {type.toLowerCase()} usa {getCost(type)}
          </p>
        </div>

        <div className="relative group p-[1px] rounded-[32px] bg-gradient-to-r from-[#00BFC6]/40 to-white/5">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-40 bg-[#060608]/90 border border-white/5 rounded-[32px] p-8 text-xl font-bold text-white placeholder:text-gray-800 focus:outline-none focus:border-[#00BFC6]/40 transition-all relative z-10 resize-none font-sora"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00BFC6]">
               {type === 'STORY_SIMPLE' && "3 frames · rápido e direto · ideal para dicas e anúncios"}
               {type === 'STORY_CAROUSEL' && "8 frames · narrativa sequencial · ideal para tutoriais e bastidores"}
               {type === 'CARROSSEL' && "8 slides · educativo e profundo · ideal para autoridade"}
               {type === 'POST' && "1 imagem · rápido e visual · ideal para memes e avisos"}
               {type === 'CAPTION' && "Só texto · persuasivo · ideal para fotos do dia a dia"}
               {type === 'BLOG' && "Artigo longo · SEO-driven · ideal para Google"}
             </p>
          </div>
          <button 
            onClick={onRefreshSuggestions}
            className="shrink-0 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] bg-[#00BFC6]/10 border border-[#00BFC6]/10 text-[#00BFC6] hover:bg-[#00BFC6]/20 transition-all flex items-center gap-2"
          >
            <Search size={14}/> Sherlock sugere — 1 crédito
          </button>
        </div>

        {savedIdeasForType.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Ideias que o Sherlock já investigou para você:</p>
            <div className="flex flex-col gap-2">
              {savedIdeasForType.map((idea, i) => (
                <button 
                  key={i} 
                  onClick={() => setTopic(idea.title)}
                  className="w-full text-left px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:border-[#00BFC6]/30 transition-all group flex items-center justify-between"
                >
                  <span>{idea.title}</span>
                  <ChevronRight size={14} className="text-gray-700 group-hover:text-[#00BFC6] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BLOCO 2: OBJETIVO */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 text-center italic">Qual o objetivo estratégico?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { id: 'ATRAIR', label: 'Atrair', desc: 'Topo de Funil' },
            { id: 'EDUCAR', label: 'Educar', desc: 'Meio de Funil' },
            { id: 'VENDER', label: 'Vender', desc: 'Conversão' },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setObjective(o.id)}
              className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                objective === o.id 
                  ? 'bg-[#00BFC6] text-black border-[#00BFC6] shadow-xl shadow-[#00BFC6]/20' 
                  : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest ${objective === o.id ? 'text-black' : 'text-white'}`}>
                {o.label}
              </span>
              <span className={`text-[7px] font-bold uppercase tracking-widest ${objective === o.id ? 'text-black/60' : 'text-gray-500'}`}>
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BLOCO 3: VIBE VISUAL (REVELAÇÃO DO SQUAD) */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 text-center italic">Qual a linha editorial (Vibe) do Designer?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { id: 'editorial', label: 'Editorial', desc: 'Cinematográfico', icon: <Camera size={14}/> },
            { id: 'tweet', label: 'Twitter', desc: 'Post Simples', icon: <MessageSquare size={14}/> },
            { id: 'minimalist', label: 'Minimal', desc: 'Tipografia', icon: <Layers size={14}/> },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id)}
              className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                vibe === v.id 
                  ? 'bg-[#00BFC6] text-black border-[#00BFC6] shadow-xl shadow-[#00BFC6]/20' 
                  : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {v.icon}
                <span className={`text-[10px] font-black uppercase tracking-widest ${vibe === v.id ? 'text-black' : 'text-white'}`}>
                  {v.label}
                </span>
              </div>
              <span className={`text-[7px] font-bold uppercase tracking-widest ${vibe === v.id ? 'text-black/60' : 'text-gray-500'}`}>
                {v.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BOTÃO FINAL DE DECOLAGEM */}
      <div className="pt-10 flex flex-col items-center gap-6">
        <button
          disabled={!topic || !canGenerate}
          onClick={() => onRunPipeline({ topic, type, objective, vibe })}
          className={`w-full max-w-sm py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm transition-all flex flex-col items-center justify-center gap-1 shadow-2xl ${
            !topic ? 'bg-white/5 text-gray-700 cursor-not-allowed' :
            !canGenerate ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-none' :
            'intel-gradient text-black hover:scale-[1.02] active:scale-95 group shadow-[#00BFC6]/20'
          }`}
        >
          <div className="flex items-center gap-3">
             {!canGenerate ? <Lock size={20}/> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
             <span>{!topic ? 'Digite um tema' : !canGenerate ? 'Créditos Insuficientes' : 'ATIVAR MEU SQUAD AGORA →'}</span>
          </div>
          {topic && canGenerate && (
            <span className="text-[8px] font-black opacity-60 uppercase tracking-widest">
              Usa {getCost(type)} créditos · {totalCredits} disponíveis
            </span>
          )}
        </button>

        {!canGenerate && topic && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase text-[#00BFC6] tracking-widest">
              Limite de créditos atingido para este formato.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CreateContentPage;
