import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Sparkles, Users, Target, Zap } from 'lucide-react';

// ─── PROMPT CONTEXT PREVIEW ──────────────────────────────────────────────────
// Gera exatamente o que vai para o prompt do Sherlock e Copywriter
function buildPromptContext(inspirations, competitors) {
  if (!inspirations.length && !competitors.length) return null;
  const lines = [];
  if (inspirations.length) {
    lines.push(`→ Analise o estilo editorial de contas como ${inspirations.map(h => h.startsWith('@') ? h : '@'+h).join(', ')} — tom, linguagem, estrutura de carrossel e abordagem de hook.`);
  }
  if (competitors.length) {
    lines.push(`→ Os concorrentes diretos incluem ${competitors.map(h => h.startsWith('@') ? h : '@'+h).join(', ')} — diferencie a abordagem e garanta posicionamento único.`);
  }
  return lines;
}

// ─── HANDLE INPUT ─────────────────────────────────────────────────────────────
function HandleInput({ value, onChange, onAdd, placeholder, disabled }) {
  const handleKey = (e) => { if (e.key === 'Enter') onAdd(); };
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-sm">@</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value.replace('@','').replace(/\s/g,''))}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-12 bg-white/5 border border-white/10 rounded-[16px] pl-9 pr-4 font-bold text-sm outline-none focus:border-[#c4973b]/60 transition-all placeholder:text-gray-700 disabled:opacity-40"
        />
      </div>
      <button
        onClick={onAdd}
        disabled={!value.trim() || disabled}
        className="h-12 px-5 rounded-[16px] gold-gradient text-black font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
      >
        <Plus size={16}/>
      </button>
    </div>
  );
}

// ─── HANDLE CHIP ─────────────────────────────────────────────────────────────
function HandleChip({ handle, onRemove, color = '#c4973b' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border font-black text-xs uppercase tracking-widest"
      style={{ borderColor: color+'40', background: color+'15', color }}
    >
      @{handle}
      <button onClick={onRemove} className="hover:opacity-60 transition-opacity ml-1">
        <X size={12}/>
      </button>
    </motion.div>
  );
}

// ─── REFS PAGE ──────────────────────────────────────────────────────────────
export default function RefsPage({ brand, setBrand }) {
  const [inspInput, setInspInput]   = useState('');
  const [compInput, setCompInput]   = useState('');
  const [saved, setSaved]           = useState(false);

  const inspirations = brand.inspirations || [];
  const competitors  = brand.competitors  || [];

  const addInspiration = () => {
    const h = inspInput.trim();
    if (!h || inspirations.includes(h)) return;
    if (inspirations.length >= 5) return;
    setBrand(p => ({ ...p, inspirations: [...(p.inspirations||[]), h] }));
    setInspInput('');
  };

  const removeInspiration = (h) =>
    setBrand(p => ({ ...p, inspirations: (p.inspirations||[]).filter(x=>x!==h) }));

  const addCompetitor = () => {
    const h = compInput.trim();
    if (!h || competitors.includes(h)) return;
    if (competitors.length >= 3) return;
    setBrand(p => ({ ...p, competitors: [...(p.competitors||[]), h] }));
    setCompInput('');
  };

  const removeCompetitor = (h) =>
    setBrand(p => ({ ...p, competitors: (p.competitors||[]).filter(x=>x!==h) }));

  const promptLines = buildPromptContext(inspirations, competitors);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-10 max-w-3xl">

      {/* VITAL BANNER */}
      <div className="bg-gradient-to-r from-red-500/10 via-[#c4973b]/10 to-transparent border-l-4 border-red-500 rounded-r-[24px] p-6 space-y-2">
         <div className="flex items-center gap-3">
            <Zap size={20} className="text-red-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-red-500">Passo mais importante da estratégia</span>
         </div>
         <p className="text-[11px] text-gray-400 font-bold leading-relaxed max-w-2xl">
            Sem referências, o Sherlock e seus agentes de copy não sabem "quem eles são". 
            Um perfil sem referências gera <strong className="text-white">conteúdo comum e robótico</strong>. 
            Adicione pelo menos uma conta para dar vida ao seu conteúdo.
         </p>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
          Referências <span className="text-[#c4973b]">da Marca.</span>
        </h2>
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
          Contas que moldam o estilo do seu conteúdo gerado — sem precisar de API
        </p>
      </div>

      {/* Como funciona */}
      <div className="flex items-start gap-4 bg-[#c4973b]/5 border border-[#c4973b]/20 rounded-[22px] p-5">
        <div className="w-10 h-10 rounded-xl bg-[#c4973b]/10 border border-[#c4973b]/20 flex items-center justify-center text-xl shrink-0">🔍</div>
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-[#c4973b]">Como isso afeta o seu conteúdo</p>
          <p className="text-[11px] text-gray-400 leading-relaxed font-bold">
            Os agentes <strong className="text-white">Sherlock</strong> e <strong className="text-white">Copywriter</strong> usam essas contas como contexto direto no prompt.
            Um carrossel gerado "para o nicho de negócios" é genérico.
            Um gerado "com o estilo direto e provocador de <span className="text-[#c4973b]">@vendarketing</span>" é específico, relevante e parece feito por alguém que conhece o mercado.
          </p>
        </div>
      </div>

      {/* SUBSEÇÃO 1 — Inspirações */}
      <section className="glass border border-white/5 rounded-[28px] p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c4973b]/10 border border-[#c4973b]/20 flex items-center justify-center">
              <Sparkles size={16} className="text-[#c4973b]"/>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Contas que me inspiram</h3>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">até 5 perfis · modelam o tom e o estilo do conteúdo</p>
            </div>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${inspirations.length >= 5 ? 'text-[#c4973b]' : 'text-gray-700'}`}>
            {inspirations.length}/5
          </span>
        </div>

        <HandleInput
          value={inspInput}
          onChange={setInspInput}
          onAdd={addInspiration}
          placeholder="vendarketing"
          disabled={inspirations.length >= 5}
        />

        <AnimatePresence>
          {inspirations.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2">
              {inspirations.map(h => (
                <HandleChip key={h} handle={h} onRemove={() => removeInspiration(h)} color="#c4973b"/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {inspirations.length === 0 && (
          <div className="text-center py-6 text-gray-700">
            <Users size={28} className="mx-auto mb-2 opacity-20"/>
            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma referência adicionada ainda</p>
          </div>
        )}

        <p className="text-[10px] text-gray-600 leading-relaxed border-t border-white/5 pt-4">
          <span className="text-gray-500 font-black">Por que isso importa: </span>
          Quanto mais referências você adicionar, mais preciso fica o estilo do conteúdo gerado.
          Nosso agente usa essas contas como referência de linguagem, formato e abordagem editorial.
        </p>
      </section>

      {/* SUBSEÇÃO 2 — Concorrentes */}
      <section className="glass border border-white/5 rounded-[28px] p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Target size={16} className="text-red-400"/>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Meus concorrentes</h3>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">até 3 perfis · o Sherlock garante diferenciação</p>
            </div>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${competitors.length >= 3 ? 'text-red-400' : 'text-gray-700'}`}>
            {competitors.length}/3
          </span>
        </div>

        <HandleInput
          value={compInput}
          onChange={setCompInput}
          onAdd={addCompetitor}
          placeholder="concorrentedireto"
          disabled={competitors.length >= 3}
        />

        <AnimatePresence>
          {competitors.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2">
              {competitors.map(h => (
                <HandleChip key={h} handle={h} onRemove={() => removeCompetitor(h)} color="#ef4444"/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {competitors.length === 0 && (
          <div className="text-center py-6 text-gray-700">
            <Target size={28} className="mx-auto mb-2 opacity-20"/>
            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhum concorrente mapeado ainda</p>
          </div>
        )}

        <p className="text-[10px] text-gray-600 leading-relaxed border-t border-white/5 pt-4">
          <span className="text-gray-500 font-black">Por que isso importa: </span>
          O Sherlock usa esses perfis para identificar o que o mercado já está fazendo,
          garantindo que o seu conteúdo se posicione de forma diferente e não repita o que todos já fazem.
        </p>
      </section>

      {/* PROMPT CONTEXT PREVIEW */}
      <AnimatePresence>
        {promptLines && (
          <motion.section
            key="prompt-preview"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Zap size={16} className="text-[#c4973b]"/>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Contexto injetado nos agentes</h3>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">o que Sherlock e Copywriter recebem nas próximas gerações</p>
              </div>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-[20px] p-5 font-mono space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c4973b] mb-3">
                Contexto de referências · {brand.businessName || brand.product || 'sua marca'}
              </p>
              {promptLines.map((line, i) => (
                <p key={i} className="text-[11px] text-gray-400 leading-relaxed">
                  <span className="text-[#c4973b] font-black">{i === 0 ? '# REFERÊNCIAS' : '# CONCORRENTES'}</span><br/>
                  {line}
                </p>
              ))}
            </div>
            <p className="text-[9px] text-gray-700 italic pl-1">
              Este contexto é adicionado automaticamente ao início do prompt do Sherlock e do Copywriter em cada geração.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Save confirmation */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-[16px] font-black text-xs uppercase tracking-widest transition-all ${
            saved
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[#c4973b]/40 hover:text-white'
          }`}>
          {saved ? <><Check size={14}/> Referências salvas</> : 'Confirmar referências'}
        </button>
        {(inspirations.length + competitors.length) > 0 && (
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
            {inspirations.length + competitors.length} conta{inspirations.length + competitors.length !== 1 ? 's' : ''} cadastrada{inspirations.length + competitors.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

    </div>
  );
}
