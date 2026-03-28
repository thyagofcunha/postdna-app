import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Globe, Instagram, Upload, ArrowRight, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { analyzeWebsiteDNA } from './aiAnalyzer';
import { extractDNA } from './dnaUtils';
import DNAPage from './DNAPage';

export default function OnboardingWizard({ brand, setBrand, onComplete }) {
  const [step, setStep] = useState(0); 
  // 0: Coleta de Dados, 1: Analisando, 2: Review (DNAPage)
  
  const [localUrl, setLocalUrl] = useState(brand.salesLink || '');
  const [localIg, setLocalIg] = useState(brand.igHandle || '');
  const [localLogo, setLocalLogo] = useState(brand.logo || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const fileRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLocalLogo(event.target.result);
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    setStep(1);
    setIsAnalyzing(true);
    setStatusMsg("🔍 Iniciando Sherlock AI...");
    
    let updatedBrand = { 
      ...brand, 
      salesLink: localUrl, 
      igHandle: localIg, 
      logo: localLogo 
    };

    // Extrair cores primárias do Logo (se fornecido)
    if (localLogo) {
      setStatusMsg("📸 Extraindo paleta de cores primária do seu Logo...");
      await new Promise(r => setTimeout(r, 1500));
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = () => {
           const dna = extractDNA(img);
           if(dna && dna.colors) {
              updatedBrand.colors = dna.colors;
              updatedBrand.suggestedStyle = dna.style;
           }
           resolve();
        };
        img.src = localLogo;
      });
    }

    // Tentar IA no site se fornecido
    if (localUrl && localUrl.includes('.')) {
      setStatusMsg("🌐 Infiltrando no site oficial para extrair Tom de Voz e Posicionamento...");
      try {
         const dna = await analyzeWebsiteDNA(localUrl);
         updatedBrand = {
            ...updatedBrand,
            colors: dna.colors || updatedBrand.colors,
            voice: { ...(updatedBrand.voice || {}), ...(dna.voice || {}) },
            visualStyle: dna.visualStyle || updatedBrand.visualStyle,
            businessName: dna.businessName || updatedBrand.businessName,
            product: dna.product || updatedBrand.product,
            targetAudience: dna.targetAudience || updatedBrand.targetAudience,
            persona: {
               ...(updatedBrand.persona || {}),
               mainPain: dna.mainPain || updatedBrand.persona?.mainPain
            }
         };
         setStatusMsg("✨ DNA Comportamental mapeado com sucesso!");
         await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
         setStatusMsg("⚠️ Não foi possível varrer o site via IA, mas os dados base foram salvos.");
         await new Promise(r => setTimeout(r, 1500));
      }
    } else {
       setStatusMsg("✅ Dados salvos. Carregando central de refinamento...");
       await new Promise(r => setTimeout(r, 1000));
    }

    setBrand(updatedBrand);
    setIsAnalyzing(false);
    setStep(2);
  };

  if (step === 2) {
    // Tela de Confirmação Final encapsulada
    return (
      <div className="flex h-screen overflow-hidden bg-[#060608] font-sans selection:bg-accent/30 text-white flex-col">
         {/* Top Header Fake for Context */}
         <div className="bg-[#123C4A] border-b border-[#00BFC6]/30 px-8 py-3 flex items-center justify-between text-[#00BFC6] z-20 shrink-0">
             <div className="flex items-center gap-3">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">DNA Mapeado! Revise suas configurações antes de ir para o Dashboard.</span>
             </div>
         </div>
         <div className="flex-1 overflow-y-auto p-8 relative">
            <DNAPage brand={brand} setBrand={setBrand} onDone={() => {
                setBrand(prev => ({ ...prev, onboardingComplete: true }));
                onComplete();
            }} />
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#c4973b]/10 to-transparent blur-[120px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl space-y-8 relative z-10"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c4973b]/10 border border-[#c4973b]/30 flex items-center justify-center shadow-2xl shadow-[#c4973b]/20 text-[#c4973b]">
                <Sparkles size={32} />
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                Descoberta do <span className="text-[#c4973b]">DNA</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                Forneça o máximo de informações possível.<br/> 
                O Sherlock (nossa IA) fará o trabalho pesado para montar sua identidade.
              </p>
            </div>

            <div className="bg-[#14141a]/80 backdrop-blur-xl rounded-[31px] p-8 border border-white/5 space-y-6">
              
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">Logo da Marca (Opcional, porém recomendado)</label>
                <div 
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-white/10 rounded-[20px] bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#c4973b]/50 hover:bg-[#c4973b]/5 transition-all group"
                >
                  <input type="file" ref={fileRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  {localLogo ? (
                    <img src={localLogo} className="h-16 w-16 object-contain" alt="Logo" />
                  ) : (
                    <>
                      <ImageIcon size={20} className="text-gray-500 group-hover:text-[#c4973b] transition-colors" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Toque para anexar logo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Website e Instagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <div className="flex gap-2 items-center text-[#c4973b] mb-1">
                      <Globe size={14} />
                      <label className="text-[10px] font-black uppercase tracking-widest">Site Oficial</label>
                   </div>
                   <input 
                     type="text" 
                     placeholder="ex: seunegocio.com.br"
                     value={localUrl}
                     onChange={e => setLocalUrl(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:border-[#c4973b]/50 focus:bg-[#c4973b]/5 transition-all outline-none font-bold text-sm text-white"
                   />
                </div>
                <div className="space-y-2">
                   <div className="flex gap-2 items-center text-pink-500 mb-1">
                      <Instagram size={14} />
                      <label className="text-[10px] font-black uppercase tracking-widest">Instagram</label>
                   </div>
                   <input 
                     type="text" 
                     placeholder="@seunegocio"
                     value={localIg}
                     onChange={e => setLocalIg(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:border-pink-500/50 focus:bg-pink-500/5 transition-all outline-none font-bold text-sm text-white"
                   />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={startAnalysis}
                  className="w-full py-5 rounded-2xl bg-[#c4973b] text-black font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(196,151,59,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Mapear DNA com Inteligência Artificial <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-6 relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#c4973b]/20 blur-xl rounded-full animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-[#14141a] border border-[#c4973b]/50 flex items-center justify-center relative z-10 shadow-2xl">
                <Loader2 size={40} className="text-[#c4973b] animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-black uppercase italic tracking-widest text-[#c4973b] max-w-sm text-center">
              {statusMsg}
            </h2>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="h-full bg-[#c4973b]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
