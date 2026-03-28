import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Layers, Camera, Globe, Trash2, 
  ChevronRight, Calendar, CheckCircle2, Search,
  Zap, Clock, ArrowRight, ExternalLink
} from 'lucide-react';

const SavedIdeasPage = ({ brand, onSelectIdea, onDeleteIdea, onViewContent, onRefreshSherlock }) => {
  const [filter, setFilter] = useState('Todas');
  const [selectedIdeaForDelete, setSelectedIdeaForDelete] = useState(null);

  const ideas = brand.saved_suggestions || [];
  const unusedIdeas = ideas.filter(i => !i.used && i.status !== 'discarded');
  const usedIdeas = ideas.filter(i => i.used && i.status !== 'discarded');

  const types = ['Todas', 'CARROSSEL', 'STORY', 'POST', 'BLOG'];
  
  const getDisplayType = (t) => {
    const map = {
      'CARROSSEL': 'Carrossel',
      'STORY': 'Stories',
      'POST': 'Post Estático',
      'BLOG': 'Blog'
    };
    return map[t] || t;
  };

  const getFilteredCount = (type) => {
    if (type === 'Todas') return unusedIdeas.length;
    return unusedIdeas.filter(i => i.suggested_format === type).length;
  };

  const filteredUnused = filter === 'Todas' 
    ? unusedIdeas 
    : unusedIdeas.filter(i => i.suggested_format === filter);

  const filteredUsed = filter === 'Todas' 
    ? usedIdeas 
    : usedIdeas.filter(i => i.suggested_format === filter);

  const isEmpty = ideas.length === 0;

  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center text-gray-700">
          <Sparkles size={48} />
        </div>
        <div className="space-y-3 max-w-sm">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">Nenhuma ideia salva ainda.</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
            Use o Sherlock para pesquisar temas estratégicos — suas sugestões ficam guardadas aqui para você usar no momento certo.
          </p>
        </div>
        <button 
          onClick={onRefreshSherlock}
          className="gold-gradient px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          Pedir sugestão ao Sherlock — 1 crédito <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Ideias Salvas</h2>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <span className="text-[#c4973b]">{unusedIdeas.length} ideias aguardando</span>
             <span className="opacity-20">|</span>
             <span>{usedIdeas.length} já utilizadas</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === t 
                  ? 'bg-[#c4973b] text-black border-[#c4973b]' 
                  : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
              }`}
            >
              {t === 'Todas' ? 'Todas' : getDisplayType(t)} 
              <span className={`ml-2 opacity-60 ${filter === t ? 'text-black' : 'text-[#c4973b]'}`}>
                ({getFilteredCount(t)})
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* LISTA DE CARDS - AGUARDANDO */}
      <section className="space-y-6">
        {filteredUnused.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnused.map((idea, i) => (
              <IdeaCard 
                key={idea.id || i}
                idea={idea} 
                onSelect={() => onSelectIdea(idea)}
                onDelete={() => setSelectedIdeaForDelete(idea)}
              />
            ))}
          </div>
        )}
      </section>

      {/* LISTA DE CARDS - UTILIZADAS */}
      {filteredUsed.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-gray-700" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">Histórico de utilização</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {filteredUsed.map((idea, i) => (
              <IdeaCard 
                key={idea.id || i}
                idea={idea} 
                used 
                onViewContent={() => onViewContent(idea)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE DESCARTE */}
      <AnimatePresence>
        {selectedIdeaForDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedIdeaForDelete(null)} />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="relative w-full max-w-sm glass rounded-[32px] p-8 border border-white/10 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Descartar esta ideia?</h3>
                <p className="text-xs text-gray-500 font-bold leading-relaxed tracking-wider">Ela não poderá ser recuperada. Você tem certeza?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSelectedIdeaForDelete(null)} className="py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all border border-white/5">Cancelar</button>
                <button 
                  onClick={() => {
                    onDeleteIdea(selectedIdeaForDelete.id);
                    setSelectedIdeaForDelete(null);
                  }}
                  className="bg-red-500/80 hover:bg-red-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg"
                >
                  Descartar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IdeaCard = ({ idea, onSelect, onDelete, used, onViewContent }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getRelativeDate = (date) => {
    if (!date) return 'Sugerido recentemente';
    const d = new Date(date);
    const diff = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Sugerido hoje';
    if (diff === 1) return 'Sugerido ontem';
    return `Sugerido há ${diff} dias`;
  };

  return (
    <motion.div 
      initial={{y:20,opacity:0}} animate={{y:0,opacity:1}}
      className={`relative p-6 rounded-[32px] glass border transition-all flex flex-col justify-between group h-full ${
        used ? 'border-white/5 bg-white/[0.02]' : 'border-white/5 hover:border-[#c4973b]/30 bg-white/[0.04]'
      }`}
    >
      <div className="space-y-4">
        {/* HEADER DO CARD */}
        <div className="flex items-start justify-between">
          <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 ${used ? 'text-gray-600' : 'text-[#c4973b]'}`}>
            {idea.suggested_format}
          </span>
          {used ? (
            <div className="flex items-center gap-1 text-[7px] font-black uppercase text-green-500 tracking-widest">
              <CheckCircle2 size={10} /> Utilizado
            </div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* TÍTULO E RESUMO */}
        <div className="space-y-2">
          <h4 className={`text-sm font-black text-white leading-tight ${used ? 'opacity-70' : ''}`}>{idea.title}</h4>
          <div className="space-y-1">
            <p className={`text-[10px] font-bold text-gray-500 leading-relaxed cursor-pointer hover:text-gray-400 transition-colors ${expanded ? '' : 'line-clamp-1'}`} onClick={() => setExpanded(!expanded)}>
              {idea.reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER DO CARD */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-700 tracking-widest">
           <Clock size={10} /> {getRelativeDate(idea.createdAt)}
        </div>
        
        {used ? (
          <button 
            onClick={onViewContent}
            className="flex items-center gap-1.5 text-[8px] font-black uppercase text-[#c4973b] hover:underline"
          >
            Ver conteúdo <ExternalLink size={10} />
          </button>
        ) : (
          <button 
            onClick={onSelect}
            className="px-4 py-2 rounded-xl gold-gradient text-black text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Criar <ArrowRight size={10} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SavedIdeasPage;
