import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Copy, Check, Share2, Calendar, 
  RotateCw, ChevronLeft, Maximize2, FileText, 
  Camera, Settings, Package, Sliders, X
} from 'lucide-react';

const DeliveryPage = ({ item, brand, onBack, onCreateVariation }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [editableCaption, setEditableCaption] = useState(item.caption || "");
  const [fullScreenSlide, setFullScreenSlide] = useState(null);
  const [downloadModal, setDownloadModal] = useState(false);

  const handleCopy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleDownloadZip = (quality) => {
    // Simulação de geração de ZIP com nomenclatura correta
    const res = quality === 'high' ? '2160' : '1080';
    const date = new Date().toISOString().split('T')[0];
    const filename = `${brand.businessName.toLowerCase().replace(/\s/g, '-')}_${item.type.toLowerCase()}_all_slides_${date}_${res}px.zip`;
    
    alert(`Iniciando download: ${filename}\nQualidade: ${quality === 'high' ? 'Alta Resolução (2160px)' : 'Padrão Instagram (1080px)'}`);
    setDownloadModal(false);
  };

  if (!item) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#c4973b] hover:gap-3 transition-all"
          >
            <ChevronLeft size={16} /> Voltar ao Calendário
          </button>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-tight">{item.topic}</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#c4973b] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                {item.type}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                GERADO EM {new Date(item.date).toLocaleDateString()} · <span className="text-green-500">AGENDADO</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setDownloadModal(true)}
            className="gold-gradient px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#c4973b]/20"
          >
            <Package size={18} /> Baixar todos os slides
          </button>
          <button 
             onClick={() => handleCopy(editableCaption, setCopiedCaption)}
             className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <FileText size={18} /> Baixar Legenda (.txt)
          </button>
        </div>
      </header>

      {/* SECTION 1: SLIDE PREVIEW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Preview dos Slides</h3>
          <p className="text-[10px] font-bold text-gray-700 uppercase italic">Formato {item.type === 'STORIES' ? '9:16' : '1:1'}</p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
          {(item.slides || []).map((slide, idx) => (
            <div key={idx} className="flex-none w-[320px] space-y-4">
              <div className="group relative aspect-square rounded-[32px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
                <img 
                  src={slide.image} 
                  alt={`Slide ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                   <h4 className="text-white text-lg font-black uppercase italic leading-tight mb-2">{slide.headline}</h4>
                   <div 
                    className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white hover:bg-black/60"
                    onClick={() => setFullScreenSlide(slide)}
                   >
                     <Maximize2 size={18} />
                   </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">SLIDE {idx + 1}</span>
                <button 
                  className="p-2 hover:text-[#c4973b] transition-colors text-gray-600"
                  title="Baixar este slide"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CAPTION & SCHEDULING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Legenda Otimizada</h3>
            <button 
              onClick={() => handleCopy(editableCaption, setCopiedCaption)}
              className="text-[#c4973b] text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              {copiedCaption ? <Check size={14} /> : <Copy size={14} />} 
              {copiedCaption ? 'Copiado!' : 'Copiar Legenda'}
            </button>
          </div>
          <textarea 
            value={editableCaption}
            onChange={(e) => setEditableCaption(e.target.value)}
            className="w-full h-64 bg-white/5 border border-white/10 rounded-[32px] p-8 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-[#c4973b]/30 transition-all font-medium resize-none shadow-inner"
          />
        </section>

        <section className="space-y-12">
          {/* SCHEDULING */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Agendamento Automático</h3>
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white shadow-lg">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Instagram Business</p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">@{brand.userName.toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">Publicar em</p>
                  <p className="text-white text-sm font-black uppercase italic">{new Date(item.date).toLocaleDateString('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> Alterar data e hora
              </button>
            </div>
          </div>

          {/* ADDITIONAL ACTIONS */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onCreateVariation}
                className="p-6 rounded-[24px] bg-white/5 border border-white/10 text-center space-y-3 group hover:border-[#c4973b]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RotateCw size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Criar Variação</p>
              </button>
              
              <button 
                className="p-6 rounded-[24px] bg-white/5 border border-white/10 text-center space-y-3 group hover:border-blue-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Compartilhar</p>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* DOWNLOAD MODAL */}
      <AnimatePresence>
        {downloadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDownloadModal(false)} />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="relative w-full max-w-sm glass rounded-[32px] p-8 border border-white/10 space-y-8">
              <div className="text-center space-y-2">
                <h4 className="text-white text-xl font-black uppercase italic tracking-tighter">Escolha a Qualidade</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resolução final do arquivo ZIP</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleDownloadZip('standard')}
                  className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all"
                >
                  <div className="text-left">
                    <p className="text-white font-black text-[12px] uppercase">Padrão Instagram</p>
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">1080px · PNG Alta fidelidade</p>
                  </div>
                  <Check className="text-[#c4973b] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => handleDownloadZip('high')}
                  className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all"
                >
                  <div className="text-left">
                    <p className="text-[#c4973b] font-black text-[12px] uppercase">Super Resolução</p>
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">2160px · Uso Editorial</p>
                  </div>
                  <Check className="text-[#c4973b] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN PREVIEW */}
      <AnimatePresence>
        {fullScreenSlide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setFullScreenSlide(null)} />
            <motion.div initial={{scale:0.9,opacity:0, y: 20}} animate={{scale:1,opacity:1, y: 0}} exit={{scale:0.9,opacity:0, y: 20}} className="relative h-full aspect-square md:aspect-auto md:max-h-[90vh]">
              <img src={fullScreenSlide.image} className="h-full object-contain rounded-2xl shadow-2xl border border-white/10" />
              <button 
                onClick={() => setFullScreenSlide(null)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DeliveryPage;
