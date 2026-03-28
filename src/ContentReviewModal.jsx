import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, ChevronLeft, ChevronRight, 
  Copy, Layout, Type, Palette, Search, Zap, Maximize2
} from 'lucide-react';

export default function ContentReviewModal({ item, brand, onApprove, onClose, readOnly = false }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'estrutura' | 'copy'
  const [currentSlide, setCurrentSlide] = useState(0);

  const isStory = item.type?.includes('STORY');
  const slides = item.slides || [];
  const currentItem = slides[currentSlide] || {};

  const primaryColor = brand.colors?.[0] || '#c4973b';
  const bgColor = brand.colors?.[1] || '#000000';
  const textColor = brand.colors?.[2] || '#ffffff';

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-8"
    >
      <div className="w-full max-w-6xl h-full max-h-[90vh] glass border border-white/10 rounded-[40px] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">Revisão de Conteúdo</p>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.topic}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
              {[
                { id: 'preview', label: 'Design Preview', icon: <Palette size={14}/> },
                { id: 'copy', label: 'Legenda & Texto', icon: <Type size={14}/> },
                { id: 'estrutura', label: 'Estratégia Sherlock', icon: <Search size={14}/> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id ? 'bg-[#c4973b] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
                {/* Visual Preview */}
                <div className="relative group">
                  <div className={`${isStory ? 'w-[280px] aspect-[9/16]' : 'w-[360px] aspect-square'} rounded-[32px] overflow-hidden border-8 border-white/5 shadow-2xl relative shadow-[#c4973b]/5 bg-black transition-all duration-500`}>
                    
                    {/* INDICADOR DE PROGRESSO (Story) */}
                    {isStory && (
                      <div className="absolute top-6 left-0 right-0 px-6 flex gap-1 z-20">
                        {slides.map((_, dotIdx) => (
                          <div key={dotIdx} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${dotIdx === currentSlide ? 'bg-white' : 'bg-white/20'}`} />
                        ))}
                      </div>
                    )}

                    <div className="absolute inset-0">
                      <img src={currentItem.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      {/* Brand Logo Mini - Safe Zone check for stories */}
                      <div className={`absolute ${isStory ? 'top-12 right-6' : 'top-8 left-8'} w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-md`}>
                        {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain p-1" /> : <span className="text-[10px] font-black">DNA</span>}
                      </div>

                      <div className="z-10 space-y-4">
                        <div className="px-3 py-1 rounded-full bg-[#c4973b] text-black text-[9px] font-black uppercase tracking-widest w-fit">
                          {isStory ? currentItem.frameType || 'STORY' : 'FEED'} {currentSlide + 1}
                        </div>
                        <h3 
                          className={`${isStory ? 'text-3xl' : 'text-4xl'} font-black uppercase italic tracking-tighter leading-tight text-white`}
                        >
                          {currentItem.headline}
                        </h3>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed line-clamp-4">
                          {currentItem.body}
                        </p>
                      </div>

                      {/* Controls Overlay para Feed */}
                      {!isStory && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                          {slides.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-[#c4973b]' : 'w-2 bg-white/20'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Nav Buttons */}
                  <button 
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#c4973b] hover:text-black transition-all backdrop-blur-md shadow-2xl"
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#c4973b] hover:text-black transition-all backdrop-blur-md shadow-2xl"
                    disabled={currentSlide === slides.length - 1}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Details side */}
                <div className="space-y-6 flex-1 w-full max-w-sm">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">Especificações Técnicas</p>
                    <div className="flex items-center gap-3">
                      <Layout size={18} className="text-gray-400" />
                      <span className="text-xl font-bold text-white uppercase italic tracking-tighter">
                        {isStory ? '9:16 vertical' : '1:1 quadrado'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Paleta aplicada</p>
                    <div className="flex gap-2">
                      {brand.colors?.map((c, i) => (
                        <div key={i} className="flex-1 h-3 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#c4973b]/5 border border-[#c4973b]/10 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-[#c4973b]" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c4973b]">Agente Designer</p>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      {isStory 
                        ? "Utilizei o Safe-Zone 250px e ampliei as fontes para garantir legibilidade máxima no formato vertical."
                        : "Apliquei contraste de alto impacto e hierarquia visual focada na retenção do scroll do feed."
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COPY */}
            {activeTab === 'copy' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">Legenda Sugerida</p>
                    <button className="text-[9px] font-black uppercase tracking-widest text-[#c4973b] hover:text-white flex items-center gap-2 transition-all">
                      <Copy size={14}/> Copiar
                    </button>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 font-medium text-sm text-gray-300 whitespace-pre-line leading-relaxed h-[400px] overflow-y-auto custom-scrollbar">
                    {item.caption || "Gerando legenda otimizada..."}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">Roteiro dos Slides</p>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {slides.map((slide, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group">
                        <span className="w-8 h-8 rounded-xl bg-white/5 text-gray-500 text-[10px] font-black flex items-center justify-center shrink-0 group-hover:bg-[#c4973b] group-hover:text-black transition-all">
                          {i+1}
                        </span>
                        <div>
                          <p className="font-bold text-white text-[12px] uppercase mb-1">{slide.headline}</p>
                          <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2 italic">{slide.body}</p>
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
                <div className="bg-[#c4973b]/5 border border-[#c4973b]/20 rounded-[32px] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="text-[#c4973b]" size={24} />
                    <h3 className="font-black uppercase italic text-xl tracking-tighter text-white">Investigação do Sherlock</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-6">
                    "Identificamos que seu público está em busca de autoridade imediata. Este formato de {item.type} foi escolhido para maximizar a retenção nos primeiros 2 segundos."
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Viralidade', 'Autoridade', 'Retenção', 'Instagram 2024'].map(kw => (
                      <span key={kw} className="px-4 py-1.5 bg-black/40 border border-white/5 rounded-xl text-[10px] font-black uppercase text-gray-500">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slides.map((step, i) => (
                    <div key={i} className="glass border border-white/5 rounded-2xl p-6 flex gap-4 items-start hover:bg-white/[0.02] transition-all">
                      <div className="p-2 rounded-xl bg-white/5 text-[#c4973b]">
                        <Layout size={18} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-white">{isStory ? step.frameType : 'SLIDE'} {i+1}</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{step.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar - Actions */}
          <div className="w-full lg:w-96 border-l border-white/5 p-10 bg-white/[0.01] flex flex-col justify-between">
            <div className="space-y-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Controle Final</p>
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
                  <div className="w-1.5 h-12 rounded-full bg-[#c4973b] shadow-xl shadow-[#c4973b]/20" />
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

              <div className="p-6 bg-gradient-to-br from-[#c4973b]/10 to-transparent border border-[#c4973b]/10 rounded-[28px] relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#c4973b]/20 blur-2xl group-hover:bg-[#c4973b]/40 transition-all" />
                <p className="text-[9px] font-black uppercase text-[#c4973b] mb-3 flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> Recomendação IA
                </p>
                <p className="text-[11px] text-gray-300 font-bold leading-relaxed italic">
                  "Este conteúdo utiliza o gatilho de autoridade focado na sua dor rincipal: {brand.persona?.mainPain || 'falta de automação'}."
                </p>
              </div>
            </div>

            {!readOnly && (
              <div className="space-y-4 pt-10">
                <button 
                  onClick={onApprove}
                  className="w-full gold-gradient text-black py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all shadow-[#c4973b]/20"
                >
                  <Check size={20} /> APROVAR E AGENDAR
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                        const btn = document.activeElement;
                        const originalText = btn.innerText;
                        btn.innerText = "REGERANDO...";
                        btn.disabled = true;
                        setTimeout(() => {
                           // Mock change
                           item.caption = "✨ Versão Regerada: " + (item.caption || "");
                           if(item.slides?.[currentSlide]) {
                              item.slides[currentSlide].headline = "NOVO: " + item.slides[currentSlide].headline;
                           }
                           btn.innerText = originalText;
                           btn.disabled = false;
                           setActiveTab('copy');
                        }, 1500);
                    }}
                    className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-[#c4973b] transition-colors bg-white/5 rounded-xl border border-white/5 disabled:opacity-50">
                    REGERAR TEXTO
                  </button>
                  <button 
                    onClick={() => {
                        const btn = document.activeElement;
                        const originalText = btn.innerText;
                        btn.innerText = "TROCANDO...";
                        btn.disabled = true;
                        setTimeout(() => {
                           // Mock change
                           if(item.slides?.[currentSlide]) {
                              item.slides[currentSlide].image = "https://picsum.photos/seed/" + Date.now() + "/800/1000";
                           }
                           btn.innerText = originalText;
                           btn.disabled = false;
                           setActiveTab('preview');
                        }, 1500);
                    }}
                    className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-[#c4973b] transition-colors bg-white/5 rounded-xl border border-white/5 disabled:opacity-50">
                    TROCAR DESIGN
                  </button>
                </div>
              </div>
            )}
            
            {readOnly && (
               <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-[32px] text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto shadow-xl">
                    <Check size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-green-500">Conteúdo Finalizado</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                       O Squad concluiu esta tarefa e os arquivos já estão prontos para entrega.
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
