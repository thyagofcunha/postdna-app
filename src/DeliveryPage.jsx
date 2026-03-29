import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Copy, Check, Share2, Calendar, 
  RotateCw, ChevronLeft, Maximize2, FileText, 
  Camera, Settings, Package, Sliders, X
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const DeliveryPage = ({ item, brand, onBack, onCreateVariation, setGlobalAlert }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [editableCaption, setEditableCaption] = useState(item.caption || "");
  const [fullScreenSlide, setFullScreenSlide] = useState(null);
  const [downloadModal, setDownloadModal] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleDownloadZip = async (quality) => {
    setIsZipping(true);
    setGlobalAlert?.({ 
      title: "Padrão Opensquad Ativado", 
      message: "Convertendo HTML em JPG e organizando pastas... Aguarde.", 
      type: "info" 
    });
    
    try {
      const zip = new JSZip();
      const folderName = item.topic.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const rootFolder = zip.folder(folderName);
      
      // 1. Legenda
      rootFolder.file("legenda.txt", editableCaption);
      
      // Container temporário para renderizar
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-5000px';
      container.style.top = '0';
      document.body.appendChild(container);

      const isStory = item.type === 'STORIES' || item.type === 'REELS';

      for (let i = 0; i < item.slides.length; i++) {
        const slide = item.slides[i];
        
        const slideEl = document.createElement('div');
        slideEl.style.width = '1080px';
        slideEl.style.height = isStory ? '1920px' : '1080px';
        slideEl.style.position = 'relative';
        slideEl.style.overflow = 'hidden';
        slideEl.style.backgroundColor = slide.layout === 'editorial' ? (brand.colors?.[0] || '#F0EAD6') : (brand.colors?.[1] || '#1A2240');
        
        slideEl.innerHTML = `
          <div style="width: 100%; height: 100%; position: relative;">
            <img src="${slide.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.45" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);"></div>
            <div style="position: absolute; inset: 0; padding: 80px; display: flex; flex-direction: column; justify-content: flex-end; gap: 35px; font-family: 'Sora', 'Inter', sans-serif;">
               <div style="background-color: ${slide.layout === 'editorial' ? '#1A2240' : (brand.colors?.[0] || '#C4973B')}; color: ${slide.layout === 'editorial' ? '#F0EAD6' : '#1A2240'}; padding: 12px 36px; border-radius: 60px; font-size: 26px; font-weight: 900; width: fit-content; text-transform: uppercase; letter-spacing: 0.1em;">
                 ${isStory ? (slide.frameType || 'STORY') : 'ESPECIAL'}
               </div>
               <h1 style="font-size: ${isStory ? '90px' : '115px'}; font-weight: 900; text-transform: uppercase; font-style: italic; line-height: 0.95; color: ${slide.layout === 'editorial' ? '#1A2240' : '#ffffff'}; margin: 0; tracking: -0.05em;">
                 ${slide.headline}
               </h1>
               <p style="font-size: 34px; font-weight: 700; color: ${slide.layout === 'editorial' ? 'rgba(26, 34, 64, 0.9)' : 'rgba(255, 255, 255, 0.8)'}; line-height: 1.4; margin: 0; max-width: 90%;">
                 ${slide.body}
               </p>
            </div>
          </div>
        `;
        
        container.appendChild(slideEl);
        
        // Esperar carregar imagem se necessário (Picsum é rápido)
        await new Promise(r => setTimeout(r, 300));

        const canvas = await html2canvas(slideEl, { 
          useCORS: true, 
          scale: quality === 'high' ? 2 : 1.5,
          logging: false,
          width: 1080,
          height: isStory ? 1920 : 1080
        });
        
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const fileName = `${String(i + 1).padStart(2, '0')}.jpg`;
        const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, "");
        
        rootFolder.file(fileName, base64Data, {base64: true});
        container.removeChild(slideEl);
      }
      
      document.body.removeChild(container);
      
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `${folderName}.zip`);
      
      setGlobalAlert?.({
        title: "Download Concluído",
        message: `ZIP '${folderName}.zip' gerado com sucesso no Padrão Opensquad.`,
        type: "success"
      });
    } catch (err) {
       console.error(err);
       setGlobalAlert?.({ title: "Erro na Conversão", message: "Houve um erro ao renderizar os slides. Tente novamente.", type: "error" });
    } finally {
      setIsZipping(false);
      setDownloadModal(false);
    }
  };

  if (!item) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:gap-3 transition-all"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-tight">{item.topic}</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                {item.type}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                PRONTO PARA DOWNLOAD
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setDownloadModal(true)}
            disabled={isZipping}
            className={`intel-gradient px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2 transition-all shadow-xl shadow-accent/20 ${isZipping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {isZipping ? <RefreshCw size={18} className="animate-spin" /> : <Package size={18} />} 
            {isZipping ? 'Convertendo...' : 'Baixar ZIP Estruturado'}
          </button>
        </div>
      </header>

      {/* PREVIEW */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Slides Convertidos</h3>
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
          {(item.slides || []).map((slide, idx) => (
            <div key={idx} className="flex-none w-[320px] space-y-4">
              <div 
                className="group relative aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
                style={{ backgroundColor: slide.layout === 'editorial' ? (brand.colors?.[0] || '#c4973b') : (brand.colors?.[1] || '#1a2240') }}
              >
                <img src={slide.image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                   <h4 className={`text-sm font-black uppercase italic leading-tight ${slide.layout === 'editorial' ? 'text-navy' : 'text-white'}`}>{slide.headline}</h4>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">SLIDE {idx + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Legenda (arquivo legenda.txt)</h3>
            <button 
              onClick={() => handleCopy(editableCaption, setCopiedCaption)}
              className="text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              {copiedCaption ? <Check size={14} /> : <Copy size={14} />} 
              {copiedCaption ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <textarea 
            value={editableCaption}
            onChange={(e) => setEditableCaption(e.target.value)}
            className="w-full h-64 bg-white/10 border border-white/10 rounded-[32px] p-8 text-gray-300 text-sm leading-relaxed focus:outline-none focus:border-accent/30 transition-all font-medium resize-none shadow-inner"
          />
        </section>

        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Estrutura do Download</h3>
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 font-mono text-[10px] text-gray-400">
             <p className="text-white">📄 {item.topic.toLowerCase().replace(/\s/g, '-')}.zip</p>
             <p className="ml-4">📁 {item.topic.toLowerCase().replace(/\s/g, '-')}/</p>
             <p className="ml-8">🖼️ 01.jpg (Capa)</p>
             <p className="ml-8">🖼️ 02.jpg ...</p>
             <p className="ml-8">📄 legenda.txt</p>
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
                <h4 className="text-white text-xl font-black uppercase italic tracking-tighter text-glow">Qualidade Profissional</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Iniciando Padrão Opensquad</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleDownloadZip('standard')}
                  className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all text-left"
                >
                  <div>
                    <p className="text-white font-black text-[12px] uppercase">Padrão Instagram</p>
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Slides 1080px (Rápido)</p>
                  </div>
                  <Check className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => handleDownloadZip('high')}
                  className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all text-left"
                >
                  <div>
                    <p className="text-accent font-black text-[12px] uppercase">Alta Qualidade (4K)</p>
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Slides 2160px (Ultra HDR)</p>
                  </div>
                  <Check className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryPage;
