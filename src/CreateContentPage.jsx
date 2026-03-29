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
  const [objective, setObjective] = useState(null);
  
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
  
  // Mostrar ideias que o Sherlock já pesquisou para este formato
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

  const hierarchy = ['free', 'basico', 'crescimento', 'completo'];
  const isLocked = (minPlan) => hierarchy.indexOf(plan) < hierarchy.indexOf(minPlan);

  // Se o tipo atual for BLOG e o plano não permitir, voltamos para Carrossel
  useEffect(() => {
    if (type === 'BLOG' && plan !== 'completo') {
      setType('CARROSSEL');
    }
  }, [type, plan]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DINÂMICO */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-accent mb-2">
             Formato: {type}
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Sobre o que é esse {type.toLowerCase()}?</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
            {totalCredits} créditos disponíveis — este {type.toLowerCase()} usa {getCost(type)}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#c4973b] to-cyan-600/40" />
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-40 bg-black/40 border border-white/10 rounded-[32px] p-8 text-xl font-bold text-white placeholder:text-gray-800 focus:outline-none focus:border-accent/50 transition-all relative z-10 resize-none"
          />
        </div>

        {/* HINT CONTEXTUAL */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
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
            className="shrink-0 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] bg-accent/10 border border-accent/10 text-accent hover:bg-accent/20 transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/20"
          >
            <Search size={14}/> Sherlock sugere — 1 crédito
          </button>
        </div>

        {/* Ideias Salvas do Sherlock para este tipo */}
        {savedIdeasForType.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Ideias que o Sherlock já investigou para você:</p>
            <div className="flex flex-col gap-2">
              {savedIdeasForType.map((idea, i) => (
                <button 
                  key={i} 
                  onClick={() => setTopic(idea.title)}
                  className="w-full text-left px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:border-[#c4973b]/30 hover:bg-accent/5 transition-all group flex items-center justify-between"
                >
                  <span>{idea.title}</span>
                  <ChevronRight size={14} className="text-gray-700 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BLOCO 2: OBJETIVO */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 text-center italic">Qual o objetivo desse conteúdo?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { id: 'ATRAIR', label: 'Atrair seguidores', desc: 'Foco em topo de funil' },
            { id: 'EDUCAR', label: 'Educar', desc: 'Foco em autoridade' },
            { id: 'VENDER', label: 'Vender', desc: 'Foco em conversão' },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setObjective(objective === o.id ? null : o.id)}
              className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                objective === o.id 
                  ? 'bg-accent text-black border-accent shadow-xl shadow-accent/20' 
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

      {/* BOTÃO FINAL */}
      <div className="pt-10 flex flex-col items-center gap-6">
        <button
          disabled={!topic || !canGenerate}
          onClick={() => onRunPipeline({ topic, type, objective })}
          className={`w-full max-w-sm py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm transition-all flex flex-col items-center justify-center gap-1 shadow-2xl ${
            !topic ? 'bg-white/5 text-gray-700 cursor-not-allowed' :
            !canGenerate ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            'intel-gradient text-black hover:scale-[1.02] active:scale-95 group'
          }`}
        >
          <div className="flex items-center gap-3">
             {!canGenerate ? <Lock size={20}/> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
             <span>{!topic ? 'Digite um tema' : !canGenerate ? 'Créditos Insuficientes' : 'GERAR COM MEU DNA →'}</span>
          </div>
          {topic && canGenerate && (
            <span className="text-[8px] font-black opacity-60 uppercase tracking-widest">
              Usa {getCost(type)} créditos · {totalCredits} disponíveis
            </span>
          )}
        </button>

        {!canGenerate && topic && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase text-accent tracking-widest">
              Este {type} custa {getCost(type)} créditos. Você tem {totalCredits}.
            </p>
            <button className="text-[8px] font-black uppercase tracking-[0.2em] text-white hover:text-accent underline">Comprar créditos extras →</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default CreateContentPage;
