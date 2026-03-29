import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ChevronLeft, ChevronRight, 
  Copy, Layout, Type, Palette, Search, Zap, Maximize2, Bell, Globe, Loader2, Cloud,
  Download, Share2, Edit3, Trash2, Save, Sparkles, Image as ImageIcon, MessageSquare, Send
} from 'lucide-react';
import { saveContentToSupabase } from './aiAnalyzer';
import { searchUnsplashImages } from './unsplashService';
import { TweetCard } from "@/components/ui/tweet-card";

export default function ContentReviewModal({ item, brand, onApprove, onClose, setGlobalAlert, readOnly = false, showPushBanner = false, onRequestPush }) {
   const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'editor' | 'copy'
   const [isPublishing, setIsPublishing] = useState(false);
   const [activeSlide, setActiveSlide] = useState(0);
   
   // --- LÓGICA DE HIDRATAÇÃO CLOUD (FASE 1.3) ---
   // Se o item vem do Supabase, o design vive dentro do item.content parseado
   let savedDesign = null;
   let savedSlides = item.slides || [];

   if (typeof item.content === 'string' && item.content.startsWith('{')) {
      try {
        const parsed = JSON.parse(item.content);
        if (parsed.design) savedDesign = parsed.design;
        if (parsed.slides) savedSlides = parsed.slides;
      } catch (e) {
        console.error("Erro ao decodificar conteúdo cloud:", e);
      }
   }

   // --- ESTADOS DO EDITOR ---
   const [vibe, setVibe] = useState(savedDesign?.vibe || item.vibe || 'editorial');
   const [logoPos, setLogoPos] = useState(savedDesign?.logoPos || item.logoPos || 'top-right');
   const [logoOpacity, setLogoOpacity] = useState(savedDesign?.logoOpacity || 0.6);
   const [editedSlides, setEditedSlides] = useState(savedSlides);

   // 🚀 NOVAS FERRAMENTAS (FASE 3.0)
   const [unsplashQuery, setUnsplashQuery] = useState('');
   const [unsplashResults, setUnsplashResults] = useState([]);
   const [isSearching, setIsSearching] = useState(false);
   const [creativeCommand, setCreativeCommand] = useState('');
   const [chatHistory, setChatHistory] = useState([
     { role: 'agent', text: 'Saudações! Sou seu Diretor Criativo. O que deseja ajustar neste slide?' }
   ]);
   const [activeSubTab, setActiveSubTab] = useState('design'); // design, images, chat

   const handleUnsplashSearch = async () => {
     if (!unsplashQuery) return;
     setIsSearching(true);
     const results = await searchUnsplashImages(unsplashQuery);
     setUnsplashResults(results);
     setIsSearching(false);
   };

  const isStory = item.type?.includes('STORY');
  const slides = item.slides || [];
  const currentItem = slides[activeSlide] || {};

  const primaryColor = brand.colors?.[0] || '#00BFC6';
  const bgColor = brand.colors?.[1] || '#000000';
  const textColor = brand.colors?.[2] || '#ffffff';

  const FONT_OPTIONS = [
    { key: 'sora',     style: { fontFamily: "'Sora', sans-serif" } },
    { key: 'playfair', style: { fontFamily: "'Playfair Display', serif" } },
    { key: 'syne',     style: { fontFamily: "'Syne', sans-serif" } },
    { key: 'outfit',   style: { fontFamily: "'Outfit', sans-serif" } },
    { key: 'inter',    style: { fontFamily: "'Inter', sans-serif" } },
    { key: 'mono',     style: { fontFamily: "'JetBrains Mono', monospace" } },
  ];

  const currentFontFace = FONT_OPTIONS.find(f => f.key === brand.fontStyle)?.style || { fontFamily: "'Sora', sans-serif" };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8"
    >
      <div className="w-full max-w-6xl h-full max-h-[90vh] glass border border-white/10 rounded-[40px] flex flex-col overflow-hidden relative">
        
        <AnimatePresence>
          {showPushBanner && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-accent/10 border-b border-accent/20 overflow-hidden shrink-0"
            >
              <div className="px-8 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Bell size={14} className="text-accent animate-bounce" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Quer ser avisado quando seu conteúdo ficar pronto?</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onRequestPush}
                    className="px-4 py-1.5 rounded-lg bg-accent text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Ativar notificações
                  </button>
                  <button 
                    onClick={() => { /* Handled in parent */ }}
                    className="px-4 py-1.5 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
                  >
                    Agora não
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl intel-gradient flex items-center justify-center text-black">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Revisão de Conteúdo</p>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.topic}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 self-center">
                  {['preview', 'editor', 'copy'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {tab === 'preview' ? 'Visual' : tab === 'editor' ? '⚙️ Editor' : 'Legenda'}
                    </button>
                  ))}
                </div>
            </div>

            {/* TAB: PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center min-h-[500px]">
                {/* Visual Preview */}
                <div className="relative group shrink-0">
                  {/* --- PREVIEW DO SLIDE (MULTIMODAL) --- */}
                  <div className={`w-[320px] md:w-[400px] aspect-[3/4] relative overflow-hidden shadow-2xl transition-all duration-700 flex items-center justify-center rounded-[32px] ${vibe === 'editorial' ? 'bg-amber-50 text-black' : 'bg-zinc-950 text-white'}`}>
                    
                    {/* 🐦 LAYOUT: TWEET CARD */}
                    {editedSlides[activeSlide]?.layout === 'tweet' ? (
                      <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-6">
                        <TweetCard 
                          author={{
                            name: brand.businessName || "PostDNA User",
                            handle: `@${(brand.businessName || "user").toLowerCase().replace(/\s+/g, '')}`,
                            avatar: brand.logo || "https://api.dicebear.com/7.x/avataaars/svg?seed=brand"
                          }}
                          // Corrigindo erro #31: Garantindo que passamos strings, não objetos
                          text={String(editedSlides[activeSlide]?.headline || "Nova Ideia Editorial")}
                          subText={String(editedSlides[activeSlide]?.body || "Gerado pelo Squad PostDNA.")}
                          className="w-[90%] rotate-1 shadow-2xl border-none"
                        />
                        <div className="flex gap-4 opacity-10">
                          <div className={`w-12 h-1 rounded-full ${vibe === 'editorial' ? 'bg-black' : 'bg-white'}`} />
                          <div className={`w-12 h-1 rounded-full ${vibe === 'editorial' ? 'bg-black' : 'bg-white'}`} />
                        </div>
                      </div>
                    ) : editedSlides[activeSlide]?.layout === 'minimalist' ? (
                      /* 🌫️ LAYOUT: MINIMALIST */
                      <div className="p-16 flex flex-col justify-center items-center text-center space-y-12">
                         <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.85]" style={currentFontFace}>
                            {editedSlides[activeSlide]?.headline}
                         </h2>
                         <div className="w-20 h-2 bg-accent rounded-full" />
                         <p className="text-xl font-bold opacity-60 leading-relaxed max-w-sm">
                            {editedSlides[activeSlide]?.body}
                         </p>
                      </div>
                    ) : (
                      /* 🖼️ LAYOUT: EDITORIAL (CLASSIC) */
                      <>
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={item.slides?.[activeSlide]?.imageUrl || `https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1080&h=1440&auto=format&fit=crop`} 
                            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${vibe === 'editorial' ? 'mix-blend-multiply opacity-20' : 'opacity-20'}`} 
                            alt="Visual" 
                          />
                          {vibe === 'shadow' && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />}
                          
                          {/* 📸 ATRIBUIÇÃO UNSPLASH (ULTRA-DISCRETA PARA AUDITORIA) */}
                          {editedSlides[activeSlide]?.unsplashAuthor && (
                            <div className="absolute bottom-4 left-4 z-20 text-[6px] font-black uppercase tracking-widest text-white/10 hover:text-white/80 transition-all duration-700 opacity-20 hover:opacity-100">
                               Foto de <a href={editedSlides[activeSlide].unsplashLink} target="_blank" rel="noreferrer" className="underline">{editedSlides[activeSlide].unsplashAuthor}</a> no Unsplash
                            </div>
                          )}
                        </div>

                        <div className="absolute inset-0 z-10 p-16 flex flex-col justify-between">
                          <div className={`absolute p-10 flex flex-col gap-1 transition-all duration-700 ${
                            logoPos === 'top-left' ? 'top-0 left-0 text-left' :
                            logoPos === 'top-right' ? 'top-0 right-0 text-right' :
                            logoPos === 'bottom-left' ? 'bottom-0 left-0 text-left' :
                            'bottom-0 right-0 text-right'
                          }`} style={{ opacity: logoOpacity }}>
                             <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg ${vibe === 'editorial' ? 'bg-black font-black' : 'bg-accent'} flex items-center justify-center text-[8px] shadow-2xl`}>DNA</div>
                                <span className={`text-[10px] font-black tracking-tighter uppercase italic ${vibe === 'editorial' ? 'text-black' : 'text-white'}`}>
                                   {brand.businessName}
                                </span>
                             </div>
                          </div>

                          <div className="space-y-6 mt-12 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{item.slides?.[activeSlide]?.frameType || 'STORY SLIDE'}</span>
                            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-[0.9]" style={currentFontFace}>
                              {editedSlides[activeSlide]?.headline}
                            </h2>
                          </div>

                          <div className="space-y-6 relative z-10">
                             <p className={`text-lg font-bold leading-tight max-w-[80%] ${vibe === 'editorial' ? 'text-black/60' : 'text-white/60'}`}>
                               {editedSlides[activeSlide]?.body}
                             </p>
                             <div className="flex items-center gap-4">
                                <div className={`h-1 w-20 rounded-full ${vibe === 'editorial' ? 'bg-black font-black' : 'bg-accent'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Slide {activeSlide + 1} / {item.slides?.length}</span>
                             </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* INDICADOR DE PROGRESSO */}
                  {!isStory && slides.length > 1 && (
                    <div className="absolute inset-x-0 -bottom-8 flex justify-center gap-2">
                       {slides.map((_, i) => (
                         <div key={i} className={`h-1 rounded-full transition-all ${i === activeSlide ? 'w-6 bg-accent' : 'w-2 bg-white/20'}`} />
                       ))}
                    </div>
                  )}

                  {/* NAV CONTROLS */}
                  <button 
                    onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                    className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all backdrop-blur-md shadow-2xl"
                    disabled={activeSlide === 0}>
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all backdrop-blur-md shadow-2xl"
                    disabled={activeSlide === slides.length - 1}>
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Details side */}
                <div className="space-y-6 flex-1 w-full max-w-sm">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Especificações Técnicas</p>
                    <div className="flex items-center gap-3">
                      <Layout size={18} className="text-gray-300" />
                      <span className="text-xl font-bold text-white uppercase italic tracking-tighter">
                        {isStory ? '9:16 vertical' : '1:1 quadrado'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Paleta aplicada</p>
                    <div className="flex gap-2">
                      {brand.colors?.map((c, i) => (
                        <div key={i} className="flex-1 h-3 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-accent/5 border border-[#00BFC6]/10 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-accent" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Agente Designer</p>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      {isStory 
                        ? "Utilizei o Safe-Zone 250px e ampliei as fontes para garantir legibilidade máxima no formato vertical."
                        : "Apliquei contraste de alto impacto e hierarquia visual focada na retenção do scroll do feed."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDITOR COM SUB-ABAS */}
            {activeTab === 'editor' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 p-2 h-full flex flex-col">
                {/* SUB-NAV */}
                <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0">
                   {[
                     { id: 'design', label: 'Design', icon: <Palette size={12} /> },
                     { id: 'images', label: 'Imagens', icon: <ImageIcon size={12} /> },
                     { id: 'chat', label: 'Squad Chat', icon: <MessageSquare size={12} /> }
                   ].map(st => (
                     <button key={st.id}
                       onClick={() => setActiveSubTab(st.id)}
                       className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeSubTab === st.id ? 'bg-accent text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                       {st.icon} {st.label}
                     </button>
                   ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
                  {/* SUB-TAB: DESIGN */}
                  {activeSubTab === 'design' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest">Direção de Arte</p>
                      
                      {/* VIBE SWITCHER */}
                      <div className="bg-white/5 p-4 rounded-3xl border border-white/5 space-y-4">
                        <label className="text-[10px] font-black text-white uppercase opacity-50">Vibe & Layout</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => setVibe('editorial')} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${vibe === 'editorial' ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>Editorial (Light)</button>
                           <button onClick={() => setVibe('shadow')} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${vibe === 'shadow' ? 'bg-neutral-800 text-white border-neutral-700' : 'border-white/10 text-white/40 hover:border-white/30'}`}>Shadow (Dark)</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                           {['editorial', 'minimalist', 'tweet'].map(style => (
                             <button key={style} onClick={() => {
                               const newSlides = [...editedSlides];
                               newSlides[activeSlide].layout = style;
                               setEditedSlides(newSlides);
                             }} className={`py-2 rounded-lg border text-[9px] font-black uppercase transition-all ${editedSlides[activeSlide]?.layout === style ? 'bg-accent border-accent text-black' : 'border-white/5 bg-white/5 text-white/40'}`}>
                               {style}
                             </button>
                           ))}
                        </div>
                      </div>

                      {/* LOGO POS */}
                      <div className="bg-white/5 p-4 rounded-3xl border border-white/5 space-y-4">
                        <label className="text-[10px] font-black text-white uppercase opacity-50">Posição da Logo</label>
                        <div className="grid grid-cols-4 gap-2">
                           {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                             <button key={pos} onClick={() => setLogoPos(pos)} className={`aspect-square rounded-xl border flex items-center justify-center text-xl transition-all ${logoPos === pos ? 'bg-accent border-accent text-black' : 'border-white/5 bg-white/5 text-white/20'}`}>
                               {pos === 'top-left' ? '↖️' : pos === 'top-right' ? '↗️' : pos === 'bottom-left' ? '↙️' : '↘️'}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: IMAGES (UNSPLASH) */}
                  {activeSubTab === 'images' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex gap-2">
                        <input 
                          type="text" value={unsplashQuery} onChange={(e) => setUnsplashQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnsplashSearch()}
                          placeholder="Buscar no Unsplash..." 
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent outline-none"
                        />
                        <button onClick={handleUnsplashSearch} className="p-3 bg-accent text-black rounded-xl hover:scale-105 transition-all">
                          {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {unsplashResults.map(img => (
                          <div key={img.id} onClick={() => {
                            const newSlides = [...editedSlides];
                            newSlides[activeSlide].imageUrl = img.url;
                            newSlides[activeSlide].unsplashAuthor = img.author;
                            newSlides[activeSlide].unsplashLink = img.link;
                            setEditedSlides(newSlides);
                            setGlobalAlert({ type: 'success', title: 'Imagem Atualizada', text: 'O Designer aplicou a nova foto ao slide.' });
                          }} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative border border-white/5 hover:border-accent transition-all">
                             <img src={img.thumb || img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[8px] font-black uppercase bg-accent text-black px-2 py-1 rounded">Aplicar</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: SQUAD CHAT */}
                  {activeSubTab === 'chat' && (
                    <div className="space-y-4 animate-in fade-in duration-300 flex flex-col h-full">
                       <div className="flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto space-y-4 custom-scrollbar min-h-[250px]">
                          {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-[80%] p-3 rounded-2xl text-[10px] font-bold leading-relaxed ${msg.role === 'user' ? 'bg-accent text-black' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                                  {msg.text}
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="flex gap-2 shrink-0">
                          <input 
                            type="text" value={creativeCommand} onChange={(e) => setCreativeCommand(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && creativeCommand) {
                                setChatHistory([...chatHistory, { role: 'user', text: creativeCommand }]);
                                setTimeout(() => {
                                  setChatHistory(prev => [...prev, { role: 'agent', text: 'Entendido. Estou processando sua alteração no slide atual...' }]);
                                }, 1000);
                                setCreativeCommand('');
                              }
                            }}
                            placeholder="Comando para o Squad..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent outline-none"
                          />
                          <button className="p-3 bg-white/5 text-accent rounded-xl border border-white/10 hover:bg-accent hover:text-black transition-all">
                             <Send size={18} />
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: COPY */}
            {activeTab === 'copy' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Legenda Sugerida</p>
                    <button className="text-[9px] font-black uppercase tracking-widest text-accent hover:text-white flex items-center gap-2 transition-all">
                      <Copy size={14}/> Copiar
                    </button>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 font-medium text-sm text-gray-300 whitespace-pre-line leading-relaxed h-[400px] overflow-y-auto custom-scrollbar">
                    {item.caption || "Gerando legenda otimizada..."}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Roteiro dos Slides</p>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {slides.map((slide, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group">
                        <span className="w-8 h-8 rounded-xl bg-white/5 text-gray-300 text-[10px] font-black flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-black transition-all">
                          {i+1}
                        </span>
                        <div>
                          <p className="font-bold text-white text-[12px] uppercase mb-1">{slide.headline}</p>
                          <p className="text-[10px] text-gray-300 leading-relaxed line-clamp-2 italic">{slide.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ESTRATÉGIA */}
            {activeTab === 'estrutura' && (
              <div className="space-y-10">
                <div className="bg-accent/5 border border-accent/20 rounded-[32px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="text-accent" size={24} />
                    <h3 className="font-black uppercase italic text-xl tracking-tighter text-white">Investigação do Sherlock</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-6">
                    "Identificamos que seu público está em busca de autoridade imediata. Este formato de {item.type} foi escolhido para maximizar a retenção nos primeiros 2 segundos."
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Viralidade', 'Autoridade', 'Retenção', 'Instagram 2024'].map(kw => (
                      <span key={kw} className="px-4 py-1.5 bg-black/40 border border-white/5 rounded-xl text-[10px] font-black uppercase text-gray-300">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slides.map((step, i) => (
                    <div key={i} className="glass border border-white/5 rounded-2xl p-6 flex gap-4 items-start hover:bg-white/[0.02] transition-all">
                      <div className="p-2 rounded-xl bg-white/5 text-accent">
                        <Layout size={18} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-white">{isStory ? step.frameType : 'SLIDE'} {i+1}</h4>
                        <p className="text-[11px] text-gray-300 font-bold leading-relaxed">{step.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar - Actions */}
          <div className="w-full lg:w-96 border-l border-white/5 p-8 lg:p-10 bg-white/[0.01] flex flex-col overflow-y-auto scrollbar-hide max-h-full">
            <div className="space-y-10 pb-8 flex-1">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Controle Final</p>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="relative">
                     <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                     <div className="absolute inset-0 bg-blue-500 blur-md opacity-20" />
                  </div>
                  <span className="text-xs font-black uppercase italic tracking-tighter text-blue-400">Aguardando seu veredito</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-12 rounded-full bg-accent shadow-xl shadow-accent/20" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">Objetivo da Marca</p>
                    <p className="text-sm font-black text-white uppercase italic">{brand.objective || 'Vender mais'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-12 rounded-full bg-white/10" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">Público Alvo</p>
                    <p className="text-[10px] font-bold text-white leading-tight uppercase">
                      {brand.targetAudience?.substring(0, 50) || 'Proprietários de Negócio'}...
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-[#00BFC6]/10 to-transparent border border-[#00BFC6]/10 rounded-[28px] relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 blur-2xl group-hover:bg-accent/40 transition-all" />
                <p className="text-[9px] font-black uppercase text-accent mb-3 flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> Recomendação IA
                </p>
                <p className="text-[11px] text-gray-300 font-bold leading-relaxed italic">
                  "Este conteúdo utiliza o gatilho de autoridade focado na sua dor principal: {brand.persona?.mainPain || 'falta de automação'}."
                </p>
              </div>
            </div>

            {!readOnly && (
              <div className="space-y-4 pt-10 mt-auto border-t border-white/5">
                <button 
                  disabled={isPublishing}
                  onClick={async () => {
                    setIsPublishing(true);
                    try {
                      const updatedItem = {
                        ...item,
                        slides: editedSlides,
                        vibe,
                        logoPos,
                        logoOpacity
                      };
                      await saveContentToSupabase(updatedItem);
                      setGlobalAlert({
                        title: "Sucesso!",
                        message: `Conteúdo de ${item.type} salvo no seu Cloud/Supabase com sucesso.`,
                        type: "success"
                      });
                      onApprove();
                    } catch (err) {
                      setGlobalAlert({
                        title: "Erro de Salvamento",
                        message: err.message,
                        type: "error"
                      });
                    } finally {
                      setIsPublishing(false);
                    }
                  }}
                  className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 transition-all ${
                    isPublishing ? 'bg-white/10 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                  }`}
                >
                  {isPublishing ? <Loader2 size={20} className="animate-spin" /> : <Cloud size={20} />}
                  {isPublishing ? 'SALVANDO...' : `APROVAR E SALVAR NO CLOUD`}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                        setGlobalAlert({
                          title: "IA em Ação",
                          message: "Regerando texto...",
                          type: "info"
                        });
                        setTimeout(() => setGlobalAlert(null), 2000);
                    }}
                    className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-accent transition-colors bg-white/5 rounded-xl border border-white/5">
                    REGERAR TEXTO
                  </button>
                  <button 
                    onClick={() => {
                        setGlobalAlert({
                          title: "Novo Visual",
                          message: "Trocando design...",
                          type: "info"
                        });
                        setTimeout(() => setGlobalAlert(null), 2000);
                    }}
                    className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-accent transition-colors bg-white/5 rounded-xl border border-white/5">
                    TROCAR DESIGN
                  </button>
                </div>
              </div>
            )}
            
            {readOnly && (
               <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-[32px] text-center space-y-4 mt-auto">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto shadow-xl">
                    <Check size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-green-500">Conteúdo Finalizado</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                       O Squad concluiu esta tarefa e os arquivos já estão prontos.
                    </p>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
