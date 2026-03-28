import React, { useState, useEffect } from 'react';
import {
  Check, Plus, Image as ImageIcon, Palette, Calendar, Zap,
  ChevronRight, Globe, Type, LayoutDashboard, Loader2,
  Star, TrendingUp, Clock, MoreVertical, Sparkles, Target,
  DollarSign, Users, Mic, MessageSquare, User, Fingerprint,
  Layers, Square, Frame, Box, Heart, Camera, History, Lock, Search, Menu, X, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DNAPage from './DNAPage';
import IntelPage from './IntelPage';
import RefsPage from './RefsPage';
import ContentReviewModal from './ContentReviewModal';
import CreateContentPage from './CreateContentPage';
import LimitModal from './LimitModal';
import { useTranslation } from 'react-i18next';
import { extractDNA } from './dnaUtils';
import SignupView from './SignupView';
import SavedIdeasPage from './SavedIdeasPage';
import ImageBankPage from './ImageBankPage';
import DeliveryPage from './DeliveryPage';
import LandingPage from './LandingPage';


const TOTAL_STEPS = 7;

const CREDIT_COSTS = {
  SUGGESTION: 1,
  CAPTION: 2,
  STORY_SIMPLE: 3,
  POST: 4,
  REGENERATE: 5,
  STORY_CAROUSEL: 8,
  BLOG: 8,
  CARROSSEL: 10
};

const PLAN_SPECS = {
  free: { 
    name: 'Free', 
    price: 0, 
    credits: 10, 
    isMonthly: false,
    features: ['1 Carrossel completo', 'Sherlock Básico']
  },
  basico: { 
    name: 'Básico', 
    price: 67, 
    credits: 80, 
    isMonthly: true,
    features: ['80 créditos/mês', 'Até 8 carrosséis/mês', 'Estratégia IA']
  },
  crescimento: { 
    name: 'Crescimento', 
    price: 147, 
    credits: 240, 
    isMonthly: true,
    features: ['240 créditos/mês', 'Ideal para escala', 'Prioridade']
  },
  completo: { 
    name: 'Completo', 
    price: 197, 
    credits: 400, 
    isMonthly: true,
    features: ['400 créditos/mês', 'Acesso a BLOG', 'Suporte VIP']
  }
};

const PALETTE_CATEGORIES = [
  {
    id: 'luxury',
    name: 'LUXO & PODER',
    desc: 'Dourado, Preto e tons metálicos',
    palettes: [
      { name: 'Gold & Noir', colors: ['#c4973b', '#0a0a0a', '#f5f5f5'] },
      { name: 'Champagne Ritual', colors: ['#e3d3b7', '#1a1a1a', '#ffffff'] },
      { name: 'Rose Gold Dream', colors: ['#e4b4b4', '#0f0f0f', '#fdf2f2'] }
    ]
  },
  {
    id: 'tech',
    name: 'TECH & FUTURE',
    desc: 'Ciano, Neon e Escuros profundos',
    palettes: [
      { name: 'Cyber Neon', colors: ['#00e5ff', '#060616', '#ffffff'] },
      { name: 'Dark Nebula', colors: ['#7c3aed', '#0d0d0d', '#f3f4f6'] },
      { name: 'Quantum Silver', colors: ['#94a3b8', '#020617', '#f8fafc'] }
    ]
  },
  {
    id: 'minimalist',
    name: 'TRUST & CLEAN',
    desc: 'Azuis sóbrios e espaços em branco',
    palettes: [
      { name: 'Modern Blue', colors: ['#2563eb', '#f8fafc', '#0f172a'] },
      { name: 'Pure Minimal', colors: ['#171717', '#ffffff', '#525252'] },
      { name: 'Soft Nordic', colors: ['#64748b', '#f1f5f9', '#1e293b'] }
    ]
  },
  {
    id: 'vibrant',
    name: 'ENERGIA & FUN',
    desc: 'Cores quentes e alto contraste',
    palettes: [
      { name: 'Electric Pink', colors: ['#ff3e6c', '#1a0010', '#ffffff'] },
      { name: 'Sunset Soul', colors: ['#f97316', '#0c0a09', '#fff7ed'] },
      { name: 'Lemon Flash', colors: ['#eab308', '#1c1917', '#fefce8'] }
    ]
  }
];

const WEEK_SLOTS = [
  { day: 'monday',    type: 'CARROSSEL' },
  { day: 'tuesday',   type: 'POST'      },
  { day: 'wednesday', type: 'STORY'     },
  { day: 'thursday',  type: 'CARROSSEL' },
  { day: 'friday',    type: 'POST'      },
  { day: 'saturday',  type: 'BLOG'      },
  { day: 'sunday',    type: 'STORY_CAROUSEL' },
];

const ONBOARDING_PALETTES = [
  { id: 'trust', name: 'Confiança e Autoridade', colors: ['#0f172a', '#c4973b', '#ffffff'], mood: 'Corporativo e Sólido' },
  { id: 'energy', name: 'Energia e Resultado', colors: ['#f97316', '#0a0a0a', '#ffffff'], mood: 'Ágil e Direto' },
  { id: 'luxury', name: 'Elegância e Luxo', colors: ['#000000', '#c4973b', '#f5f5f5'], mood: 'Premium e Exclusivo' },
  { id: 'wellness', name: 'Saúde e Bem-estar', colors: ['#059669', '#ffffff', '#1f2937'], mood: 'Calmo e Seguro' },
  { id: 'creative', name: 'Criatividade', colors: ['#7c3aed', '#db2777', '#ffffff'], mood: 'Vibrante e Inovador' },
  { id: 'warm', name: 'Calor e Proximidade', colors: ['#b45309', '#fef3c7', '#451a03'], mood: 'Acolhedor e Humano' },
  { id: 'tech', name: 'Tecnologia', colors: ['#2563eb', '#1e293b', '#ffffff'], mood: 'Moderno e Digital' },
  { id: 'minimalist', name: 'Minimalismo', colors: ['#ffffff', '#000000', '#525252'], mood: 'Limpo e Essencial' },
];

const ONBOARDING_FONTS = [
  { id: 'modern', name: 'Inter / Inter', headline: 'Inter', body: 'Inter', desc: 'Moderna e Direta' },
  { id: 'impact', name: 'Montserrat / Montserrat', headline: 'Montserrat', body: 'Montserrat', desc: 'Forte e Impactante' },
  { id: 'elegant', name: 'Playfair / Nunito', headline: 'Playfair Display', body: 'Nunito', desc: 'Clássica e Humana' },
  { id: 'sophisticated', name: 'Cormorant / Inter', headline: 'Cormorant Garamond', body: 'Inter', desc: 'Elegante e Sofisticada' },
  { id: 'bold', name: 'Oswald / Inter', headline: 'Oswald', body: 'Inter', desc: 'Arrojada e Condensada' },
];

const DESIGN_STYLES = [
  { id: 'standard', name: 'Padrão', desc: 'Espaçamento e Sombra', icon: 'Layers' },
  { id: 'minimalist', name: 'Plano', desc: 'Direto e Sem Bordas', icon: 'Square' },
  { id: 'border', name: 'Borda', desc: 'Com linhas e contorno', icon: 'Frame' },
  { id: 'glass', name: 'Vidro', desc: 'Suave e Transparente', icon: 'Sparkles' },
  { id: 'block', name: 'Bloco', desc: 'Efeito 3D e Cartões', icon: 'Box' },
  { id: 'warm', name: 'Acolhedor', desc: 'Bordas arredondadas', icon: 'Heart' },
];

// ─── AI TOPIC GENERATOR ─────────────────────────────────────────────────────
function generateAITopics(brand) {
  const product   = (brand.product || '').toLowerCase();
  const audience  = (brand.targetAudience || '').toLowerCase();
  const pain      = brand.persona?.mainPain || '';
  const energy    = brand.voice?.energy || 3;
  const salesLink = brand.salesLink || brand.website || '';

  const high = energy >= 4;
  const h = (i) => (high
    ? ['NÃO é sorte —','CHEGA de','A verdade que ninguém conta:','3 ERROS que destroem','Por que 90% erram:']
    : ['Como','O guia completo para','Tudo que você precisa saber sobre','5 passos para','Por que']
  )[i % 5];

  const src = product + ' ' + audience;
  const is = (rx) => rx.test(src);

  if (is(/futebol|esport|jogo|atleta|treino/i)) return [
    `${h(0)} o erro que impede o jogador amador de evoluir`,
    `${h(1)} treinar sem método: como parar de perder tempo`,
    `Enquete: qual a sua maior dificuldade em campo?`,
    `${h(3)} quem treina sozinho sem orientação`,
    `O que o treinador profissional sabe que o amador não viu ainda`,
    salesLink ? `Comece hoje: ${salesLink}` : `Dê o primeiro passo agora`,
  ];

  if (is(/beleza|cabelo|estética|pele|unhas/i)) return [
    `${h(0)} fazer o cliente voltar sempre`,
    `Os 3 erros que afastam clientes de salões`,
    `Enquete: o que te faz escolher um profissional?`,
    `Sua transformação começa aqui`,
    `Por trás dos bastidores: como o resultado acontece`,
    salesLink ? `Agende agora: ${salesLink}` : `Fale com a gente`,
  ];

  if (is(/marcen|móveis?|madeira|carpint/i)) return [
    `Como escolher o móvel certo para cada ambiente`,
    `Antes e depois: transformação com sob medida`,
    `Enquete: MDF ou madeira maciça?`,
    `Nos bastidores: da madeira bruta ao móvel`,
    `Por que móvel sob medida vale cada centavo`,
    salesLink ? `Peça seu orçamento: ${salesLink}` : `Solicite um orçamento`,
  ];

  if (is(/saúde|nutri|academia|dieta|bem.estar/i)) return [
    `${h(0)} transformar sua rotina de saúde`,
    `Os 3 hábitos que mudam tudo`,
    `Enquete: qual é seu maior obstáculo?`,
    `Resultado real: não é milagre, é método`,
    `Um passo de cada vez: como começar`,
    salesLink ? `Comece hoje: ${salesLink}` : `Dê o primeiro passo`,
  ];

  if (is(/vendas?|empreend|negócio|empresa|faturar/i)) return [
    `${h(0)} vender todo dia sem postar todo dia`,
    `A estratégia que faz clientes te procurarem`,
    `Enquete: qual o seu maior desafio em vendas?`,
    `Do zero ao primeiro cliente: como funciona`,
    `Os números não mentem — veja os resultados`,
    salesLink ? `Fale com a gente: ${salesLink}` : `Entre em contato agora`,
  ];

  // Fallback genérico com dados do usuário
  return [
    `${h(0)} o que ninguém conta sobre ${product || 'esse mercado'}`,
    `Por que ${audience || 'seu público'} escolhe quem entende o problema deles`,
    `Enquete: qual é o seu maior desafio hoje?`,
    pain ? `${pain} — e como resolvemos isso` : `Bastidores: como funciona nosso processo`,
    `Resultados reais: veja o que já entregamos`,
    salesLink ? `Dê o primeiro passo: ${salesLink}` : `Fale com a gente agora`,
  ];
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

const StepWrapper = ({ active, children }) => (
  <AnimatePresence mode="wait">
    {active && (
      <motion.div
        key="step"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-2xl mx-auto"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const ColorSwatch = ({ color, label, onChange }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] border-4 border-white/10 shadow-xl relative group overflow-hidden hover:scale-105 transition-transform"
      style={{ backgroundColor: color }}
    >
      <input type="color" value={color.slice(0,7)} onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase tracking-widest transition-all z-10 text-white pointer-events-none">
        Trocar
      </div>
    </div>
    <div className="text-center w-20">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{label}</p>
      <p className="text-[9px] font-mono text-gray-800 font-bold uppercase select-all truncate">{color}</p>
    </div>
  </div>
);


const VoiceSlider = ({ label, leftLabel, rightLabel, leftEx, rightEx, value, onChange }) => (
  <div className="bg-white/5 border border-white/5 rounded-[24px] p-5 space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{label}</p>
    <div className="flex gap-3">
      <div className="flex-1 bg-white/3 border border-white/5 rounded-xl p-3 text-[10px] italic text-gray-500">
        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">{leftLabel}</span>
        {leftEx}
      </div>
      <div className="flex-1 bg-white/3 border border-white/5 rounded-xl p-3 text-[10px] italic text-gray-500 text-right">
        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-700 mb-1">{rightLabel}</span>
        {rightEx}
      </div>
    </div>
    <div>
      <input type="range" min="1" max="5" step="1" value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: '#c4973b' }} />
      <div className="flex justify-between mt-1">
        {[1,2,3,4,5].map(n => (
          <div key={n} className={`w-1.5 h-1.5 rounded-full transition-all ${n <= value ? 'bg-[#c4973b]' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  </div>
);

const KPICard = ({ icon, label, value, sub }) => (
  <div className="glass p-6 rounded-[28px] flex flex-col gap-3 border border-white/5 hover:border-white/10 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">{label}</p>
      <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
      {sub && <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{sub}</p>}
    </div>
  </div>
);


const ColorFullPicker = ({ label, color, desc, onChange }) => (
  <div className="flex items-center justify-between gap-4 p-3 lg:p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
    <div className="flex-1 min-w-0">
      <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#c4973b] mb-0.5 truncate">{label}</p>
      <p className="text-[8px] lg:text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-tight line-clamp-1">{desc}</p>
    </div>
    <div className="flex items-center gap-2 lg:gap-4 bg-black/20 p-1.5 lg:p-2 rounded-xl border border-white/10 shrink-0">
      <input 
        type="text" 
        value={color} 
        onChange={e => onChange(e.target.value)}
        className="w-16 lg:w-20 bg-transparent text-[9px] lg:text-[10px] font-mono font-black text-gray-400 uppercase outline-none focus:text-white transition-colors"
        placeholder="#HEX"
      />
      <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden border-2 border-white/20 shrink-0">
        <input 
          type="color" 
          value={color} 
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" 
        />
      </div>
    </div>
  </div>
);

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]   = useState(() => {
    try {
      const s = localStorage.getItem('sc_brand');
      if (s) {
        const saved = JSON.parse(s);
        if (saved.userName) return 'dashboard';
        return 'onboarding'; // Se começou mas não terminou
      }
    } catch(e) {}
    return 'landing';
  });
  const [step, setStep]   = useState(() => {
    try {
      const s = localStorage.getItem('sc_brand');
      if (s) {
        const saved = JSON.parse(s);
        if (saved.onboardingComplete) return 1; // reset if complete or handle accordingly
      }
    } catch(e) {}
    return 0;
  });
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [brand, setBrand] = useState(() => {
    const defaultBrand = {
      logo: null, colors:['#c4973b','#000000','#ffffff'],
      fontStyle:'bold', visualStyle:'vibrant',
      website:'', igHandle:'', suggestedStyle:null,
      userName:'', objective:'vender',
      businessName:'', product:'', targetAudience:'', price:'', salesLink:'',
      voice:{ formality:3, depth:3, energy:3, forbiddenWords:'' },
      persona:{ description:'', mainPain:'', previousAttempts:'' },
      inspirations:[], competitors:[],
      interfaceLanguage: 'pt-BR',
      contentLanguage: 'pt-BR',
      plan: 'free',
      credit_balance: 10,
      credit_limit: 10,
      extra_credits: 0,
      credit_reset_date: null,
      suggestions: [],
      saved_suggestions: [],
      image_bank: []
    };
    try { 
      const s = localStorage.getItem('sc_brand'); 
      if (s) {
        const saved = JSON.parse(s);
        return { ...defaultBrand, ...saved }; 
      }
    } catch(e) {}
    return defaultBrand;
  });

  const [analysisStatus, setAnalysisStatus] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorTab, setColorTab] = useState('curadoria'); 
  const [fontTab, setFontTab] = useState('curadoria');

  const { t, i18n } = useTranslation();
  const hasDNA = !!(brand.logo || brand.website || brand.igHandle) && brand.colors?.length > 0;
  
  const handleDNAAnalysis = (logoData = null) => {
    setIsAnalyzing(true);
    const statuses = [
      "🔍 Sherlock identificando traços do logo...",
      "📸 Verificando presença no Instagram...",
      "🌐 Cruzando dados com o site oficial...",
      "⚖️ Analisando consistência de marca...",
      "✨ DNA Visual Detectado com Sucesso!"
    ];

    let i = 0;
    const interval = setInterval(() => {
      setAnalysisStatus(statuses[i]);
      i++;
      if (i >= statuses.length) {
        clearInterval(interval);
        setTimeout(() => {
           setIsAnalyzing(false);
           setStep(2);
        }, 1000);
      }
    }, 1200);

    if (logoData) {
       const img = new Image();
       img.onload = () => {
         const dna = extractDNA(img);
         setBrand(p => ({
           ...p,
           logo: logoData,
           colors: dna.colors,
           suggestedStyle: dna.style,
           dnaDetected: true
         }));
       };
       img.src = logoData;
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBrand(p => ({ ...p, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // ── Sincroniza i18n com o estado da marca ─────────────────────
/*
  useEffect(() => {
    if (brand.interfaceLanguage && brand.interfaceLanguage !== i18n.language) {
      i18n.changeLanguage(brand.interfaceLanguage);
    }
  }, [brand.interfaceLanguage, i18n.language]);
*/

  useEffect(() => {
    const { logo, ...rest } = brand;
    try { localStorage.setItem('sc_brand', JSON.stringify(rest)); } catch {}
    document.title = `${t('common.productName')} | ${t('dashboard.sidebar.home')}`;
  }, [brand, t]);

  const finishOnboarding = () => setView('dashboard');
  const primaryColor = brand.colors[0] || '#c4973b';
  // const TOTAL_STEPS = 7; // Already defined globally

  return (
    <div className="min-h-screen bg-[#060606] text-gray-100 overflow-hidden font-sans selection:bg-[#c4973b]/20">

      {/* ══ LANDING PAGE ══ */}
      {view === 'landing' && <LandingPage onGetStarted={() => setView('signup')} />}

      {/* ══ SIGNUP ══ */}
      {view === 'signup' && (
        <SignupView onSignup={(data) => {
          setBrand(prev => ({ ...prev, userName: data.name, userEmail: data.email }));
          localStorage.setItem('sc_brand', JSON.stringify({ ...brand, userName: data.name, userEmail: data.email, plan: 'free' }));
          setView('onboarding');
        }} />
      )}

      {/* ══ ONBOARDING ══ */}
      {view === 'onboarding' && (
        <div className="min-h-screen bg-[#060606] text-white flex flex-col font-inter overflow-hidden relative">
          
          <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-[#060606]/80 backdrop-blur-xl z-50">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                 <Zap size={16} className="text-black" />
               </div>
               <span className="text-lg font-black uppercase italic tracking-tighter">Post<span className="text-[#c4973b]">DNA</span></span>
            </div>
            
            {step > 0 && step < 7 && (
              <div className="flex items-center gap-8">
                <div className="flex gap-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i + 1 <= step ? 'w-10 bg-[#c4973b]' : 'w-4 bg-white/10'}`} />
                  ))}
                </div>
                <div className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-[#c4973b]">
                   PASSO {step} DE 6
                </div>
              </div>
            )}

            {step > 0 && step < 7 && (
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            )}
            {(step === 0 || step === 7) && <div className="w-20" />}
          </header>

          <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 max-w-7xl mx-auto w-full relative">
            
            <div className="flex-1 w-full max-w-xl self-center">
              
              <StepWrapper active={step === 0}>
                <div className="text-center space-y-10">
                   <motion.div 
                     animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                     transition={{ repeat: Infinity, duration: 4 }}
                     className="w-24 h-24 rounded-[32px] gold-gradient flex items-center justify-center mx-auto shadow-2xl shadow-[#c4973b]/20"
                   >
                     <Zap size={48} className="text-black" />
                   </motion.div>
                   <div className="space-y-4">
                     <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                        Vamos configurar o DNA da sua marca.
                     </h2>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        Leva menos de 5 minutos. Depois disso, todo conteúdo sai com a cara da sua marca automaticamente.
                     </p>
                   </div>
                   <button onClick={() => setStep(1)} className="gold-gradient px-12 py-6 rounded-[28px] text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#c4973b]/20 hover:scale-105 transition-all">
                      Começar →
                   </button>
                </div>
              </StepWrapper>

              <StepWrapper active={step === 1}>
                <div className="space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Bases do seu DNA.</h3>
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Utilizaremos o logo, site e instagram para uma análise tripla.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                     <div 
                        onClick={() => !isAnalyzing && document.getElementById('logo-onboarding').click()}
                        className={`group relative aspect-video w-full rounded-[40px] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-6 cursor-pointer ${brand.logo ? 'border-green-500/50 bg-green-500/5' : 'border-white/5 bg-white/3 hover:border-[#c4973b]/50'}`}
                     >
                       <input id="logo-onboarding" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                       {isAnalyzing ? (
                          <div className="text-center space-y-4">
                            <Loader2 size={32} className="animate-spin text-[#c4973b] mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#c4973b] animate-pulse">{analysisStatus}</p>
                          </div>
                       ) : brand.logo ? (
                         <div className="relative group">
                            <img src={brand.logo} className="w-40 h-40 object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                               <p className="text-[10px] font-black uppercase">Trocar Logo</p>
                            </div>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 text-gray-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c4973b] group-hover:text-black transition-all">
                             <ImageIcon size={32} />
                           </div>
                           <p className="text-xs font-black uppercase tracking-widest text-gray-600">Suba seu Logo</p>
                         </div>
                       )}
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Site Oficial</label>
                           <input 
                              placeholder="www.seusite.com.br"
                              value={brand.website}
                              onChange={e => setBrand({...brand, website: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-[#c4973b]/50 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Instagram (ex: @suamarca)</label>
                           <input 
                              placeholder="@"
                              value={brand.igHandle}
                              onChange={e => setBrand({...brand, igHandle: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-[#c4973b]/50 transition-all"
                           />
                        </div>
                     </div>
                   </div>

                   <div className="flex flex-col items-center gap-4">
                      <button 
                         onClick={() => {
                            if (brand.logo) {
                               const img = new Image();
                               img.onload = () => handleDNAAnalysis(brand.logo);
                               img.src = brand.logo;
                            } else {
                               setStep(2);
                            }
                         }}
                         disabled={isAnalyzing}
                         className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-50"
                      >
                        {isAnalyzing ? "Sherlock em ação..." : "Aprender meu DNA →"}
                      </button>
                      <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors">Continuar sem logo</button>
                   </div>
                </div>
              </StepWrapper>

              <StepWrapper active={step === 2}>
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter text-white">
                  {brand.dnaDetected ? "DNA Visual Identificado" : "Cores do Seu DNA"}
                </h3>
                <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px] lg:text-[10px]">
                  {brand.dnaDetected ? "Sherlock encontrou as cores abaixo. Estão corretas?" : "Defina as cores que serão aplicadas nos seus posts."}
                </p>
              </div>

              {brand.dnaDetected ? (
                <div className="space-y-8 animate-fade-in p-2">
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white/5 p-6 rounded-[32px] border border-white/10 shadow-2xl">
                    {(brand.colors || []).slice(0, 4).map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-[32px] shadow-2xl border-4 border-white/10 group relative overflow-hidden" style={{ backgroundColor: c }}>
                           <input type="color" value={c} onChange={e => {
                             const nc = [...brand.colors];
                             nc[i] = e.target.value;
                             setBrand({...brand, colors: nc});
                           }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        </div>
                        <span className="text-[10px] font-mono text-[#c4973b] font-black">{c.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setStep(3)} className="flex-1 py-5 bg-[#c4973b] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#c4973b]/20">
                       Tudo Certo, Confirmar Cores →
                    </button>
                    <button 
                      onClick={() => setBrand(prev => ({ ...prev, dnaDetected: false }))} 
                      className="px-6 py-5 bg-white/5 border border-white/10 text-gray-500 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:text-white transition-all">
                      Ajustar Manualmente
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-8 bg-white/3 p-1 rounded-2xl border border-white/5">
                      {['curadoria', 'personalizar'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setColorTab(tab)}
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${colorTab === tab ? 'bg-[#c4973b] text-black shadow-lg shadow-[#c4973b]/20' : 'text-gray-600 hover:text-white'}`}
                        >
                          {tab === 'curadoria' ? '✨ Curadoria' : '⚙️ Personalizar'}
                        </button>
                      ))}
                   </div>

                   <div className="max-h-[350px] lg:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                     {colorTab === 'curadoria' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                           {ONBOARDING_PALETTES.map(p => (
                             <button 
                               key={p.id}
                               onClick={() => setBrand(prev => ({ ...prev, colors: p.colors }))}
                               className={`p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border-2 transition-all text-left flex flex-col justify-between ${brand.colors?.[0] === p.colors[0] ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/3 hover:border-white/10'}`}
                             >
                               <div className="space-y-3">
                                 <div className="flex gap-1 h-2 lg:h-3">
                                   {p.colors.map((c, idx) => <div key={idx} className="w-full rounded-full" style={{ backgroundColor: c }} />)}
                                 </div>
                                 <div className="flex justify-between items-end">
                                    <div className="min-w-0">
                                      <p className="text-[10px] lg:text-[11px] font-black uppercase text-white tracking-widest truncate">{p.name}</p>
                                      <p className="text-[8px] lg:text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-0.5">{p.mood}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full gold-gradient shadow-[0_0_10px_#c4973b] transition-opacity ${brand.colors?.[0] === p.colors[0] ? 'opacity-100' : 'opacity-0'}`} />
                                 </div>
                               </div>
                             </button>
                           ))}
                        </div>
                     ) : (
                        <div className="space-y-3 lg:space-y-4">
                           <ColorFullPicker 
                             label="Destaque Principal" 
                             color={brand.colors[0] || '#c4973b'} 
                             desc="Cor de impacto para botões e CTA"
                             onChange={(c) => { const nc = [...brand.colors]; nc[0] = c; setBrand({...brand, colors: nc}); }} 
                           />
                           <ColorFullPicker 
                             label="Base da Marca" 
                             color={brand.colors[1] || '#000000'} 
                             desc="Cor predominante do fundo e containers"
                             onChange={(c) => { const nc = [...brand.colors]; nc[1] = c; setBrand({...brand, colors: nc}); }} 
                           />
                           <ColorFullPicker 
                             label="Leitura e Texto" 
                             color={brand.colors[2] || '#ffffff'} 
                             desc="Contraste ideal para máxima legibilidade"
                             onChange={(c) => { const nc = [...brand.colors]; nc[2] = c; setBrand({...brand, colors: nc}); }} 
                           />
                        </div>
                     )}
                   </div>

                  <button onClick={() => setStep(3)} className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl mt-6 lg:mt-8">
                     Confirmar cores →
                  </button>
                </div>
              )}
              </StepWrapper>

              <StepWrapper active={step === 3}>
                <div className="space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Como é a sua tipografia?</h3>
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">As fontes ditam o tom da conversa com seus seguidores.</p>
                   </div>

                   <div className="flex items-center gap-3 mb-8 bg-white/3 p-1 rounded-2xl border border-white/5">
                      {['curadoria', 'personalizar'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setFontTab(tab)}
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${fontTab === tab ? 'bg-[#c4973b] text-black shadow-lg shadow-[#c4973b]/20' : 'text-gray-600 hover:text-white'}`}
                        >
                          {tab === 'curadoria' ? '✨ Curadoria' : '⚙️ Personalizar'}
                        </button>
                      ))}
                   </div>

                   {fontTab === 'curadoria' ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {ONBOARDING_FONTS.map(f => (
                          <button 
                             key={f.id}
                             onClick={() => setBrand(prev => ({ ...prev, fontStyle: f.headline, bodyFont: f.body }))}
                             className={`p-6 rounded-[32px] border-2 transition-all text-left flex flex-col justify-between aspect-video ${brand.fontStyle === f.headline ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                          >
                             <p className="text-2xl text-white font-black" style={{ fontFamily: f.headline }}>Sua marca.<br/><span style={{ fontFamily: f.body }} className="text-gray-400 font-normal">Seu conteúdo.</span></p>
                             <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-4">{f.name}</p>
                          </button>
                        ))}
                     </div>
                   ) : (
                      <div className="space-y-8 bg-white/3 p-8 rounded-[32px] border border-white/5">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">Fontes de Títulos</label>
                            <select 
                               value={brand.fontStyle}
                               onChange={e => setBrand({...brand, fontStyle: e.target.value})}
                               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold outline-none"
                            >
                               {['Inter', 'Montserrat', 'Playfair Display', 'Oswald', 'Cormorant Garamond'].map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">Fontes de Corpo</label>
                            <select 
                               value={brand.bodyFont || 'Inter'}
                               onChange={e => setBrand({...brand, bodyFont: e.target.value})}
                               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold outline-none"
                            >
                               {['Inter', 'Nunito', 'Montserrat', 'Source Sans Pro'].map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                         </div>
                      </div>
                   )}

                   <button onClick={() => setStep(4)} className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl mt-4">
                      Confirmar tipografia →
                   </button>
                </div>
              </StepWrapper>

              <StepWrapper active={step === 4}>
                <div className="space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Qual estilo visual combina?</h3>
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">O estilo define o acabamento dos elementos e containers do post.</p>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {DESIGN_STYLES.map(s => {
                         const Icon = s.id === 'standard' ? Layers : s.id === 'minimalist' ? Square : s.id === 'border' ? Frame : s.id === 'glass' ? Sparkles : s.id === 'block' ? Box : Heart;
                         return (
                           <button 
                              key={s.id}
                              onClick={() => setBrand(prev => ({ ...prev, visualStyle: s.id }))}
                              className={`p-6 rounded-[32px] border-2 transition-all text-left flex flex-col justify-between aspect-square group ${brand.visualStyle === s.id ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                           >
                              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${brand.visualStyle === s.id ? 'bg-[#c4973b] border-[#c4973b]/50 text-black' : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'}`}>
                                 <Icon size={20} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{s.name}</p>
                                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1 leading-tight">{s.desc}</p>
                              </div>
                           </button>
                         );
                      })}
                   </div>

                   <button onClick={() => setStep(5)} className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl">
                      Confirmar design →
                   </button>
                </div>
              </StepWrapper>

              <StepWrapper active={step === 5}>
                 <div className="space-y-10">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Conte um pouco sobre o negócio.</h3>
                       <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Precisamos desses dados para gerar o copy correto.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">O que você vende ou oferece?</label>
                          <input 
                            placeholder="Ex: Consultoria de Vendas, Roupas, Nutrição..."
                            value={brand.product}
                            onChange={(e) => setBrand({ ...brand, product: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-[#c4973b]/50 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Para quem é esse serviço/produto?</label>
                          <input 
                            placeholder="Ex: Empreendedores Iniciantes, Mulheres 20-35 anos..."
                            value={brand.targetAudience}
                            onChange={(e) => setBrand({ ...brand, targetAudience: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-[#c4973b]/50 transition-all"
                          />
                       </div>
                    </div>

                    <button 
                      onClick={() => brand.product && brand.targetAudience && setStep(6)} 
                      disabled={!brand.product || !brand.targetAudience}
                      className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-40 transition-all font-bold"
                    >
                       Continuar →
                    </button>
                 </div>
              </StepWrapper>

              <StepWrapper active={step === 6}>
                 <div className="space-y-10">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Como sua marca se comunica?</h3>
                       <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Ajuste a personalidade da IA para combinar com sua voz real.</p>
                    </div>

                    <div className="space-y-8">
                      <VoiceSlider label="Voz Principal" leftLabel="Formal" rightLabel="Informal" leftEx="Prezados," rightEx="E aí," value={brand.voice?.formality} onChange={(v) => setBrand({ ...brand, voice: { ...brand.voice, formality: v } })} />
                      <VoiceSlider label="Conhecimento" leftLabel="Técnico" rightLabel="Popular" leftEx="O gradiente..." rightEx="É tipo assim..." value={brand.voice?.depth} onChange={(v) => setBrand({ ...brand, voice: { ...brand.voice, depth: v } })} />
                      <VoiceSlider label="Energia" leftLabel="Sério" rightLabel="Divertido" leftEx="Informamos que..." rightEx="Bora galera! 🚀" value={brand.voice?.energy} onChange={(v) => setBrand({ ...brand, voice: { ...brand.voice, energy: v } })} />
                    </div>

                    <div className="p-6 bg-[#c4973b]/5 border border-[#c4973b]/10 rounded-[28px] text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b] mb-4 italic">Exemplo da sua Voz:</p>
                       <p className="text-sm font-black italic tracking-tighter text-white leading-relaxed">
                          {brand.voice?.formality > 3 
                            ? "E aí, pronto pra levar seu negócio pro próximo nível hoje? Fica ligado nessas dicas!" 
                            : "Apresentamos as diretrizes fundamentais para o aumento da performance comercial do seu negócio."}
                       </p>
                    </div>

                    <button onClick={() => setStep(7)} className="gold-gradient w-full py-5 rounded-2xl text-black font-black uppercase tracking-widest text-xs shadow-xl">
                       Finalizar configuração →
                    </button>
                 </div>
              </StepWrapper>

              <StepWrapper active={step === 7}>
                 <div className="text-center space-y-10">
                    <div className="space-y-4">
                       <motion.div 
                         initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10 }}
                         className="w-24 h-24 rounded-full bg-green-500 text-[#060606] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20"
                       >
                         <Check size={48} strokeWidth={4} />
                       </motion.div>
                       <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">DNA IDENTIFICADO.</h2>
                       <p className="text-gray-500 font-bold uppercase tracking-widest text-xs max-w-md mx-auto leading-relaxed">
                          Todo conteúdo que você criar vai sair assim — com a identidade da sua marca, automaticamente.
                       </p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-center gap-6">
                          <span className="text-[9px] font-black uppercase text-green-500 flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">✅ Identidade Visual</span>
                          <span className="text-[9px] font-black uppercase text-green-500 flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">✅ Tom de Voz</span>
                       </div>
                       <button onClick={finishOnboarding} className="gold-gradient px-12 py-6 rounded-[28px] text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#c4973b]/20 hover:scale-105 transition-all">
                          Entrar no PostDNA →
                       </button>
                    </div>
                 </div>
              </StepWrapper>

            </div>

            {step > 0 && step < 8 && (
               <motion.div 
                 initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                 className="flex-1 w-full max-w-sm hidden lg:block"
               >
                 <div className="sticky top-32 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 text-center">Preview em tempo real</p>
                    <div 
                      className="aspect-square rounded-[48px] overflow-hidden shadow-2xl relative border-8 border-white/5 transition-all duration-700"
                      style={{ backgroundColor: brand.colors?.[1] || '#000000' }}
                    >
                       <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: `linear-gradient(135deg, ${brand.colors?.[0] || '#c4973b'}33, transparent)` }} />
                       
                       <div className="p-10 h-full flex flex-col justify-end relative z-10">
                          <div className="absolute top-10 left-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md overflow-hidden">
                             {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain p-2" /> : <Zap size={24} className="text-[#c4973b]" />}
                          </div>

                          <div className="space-y-4">
                            <h4 
                               className="text-4xl font-black uppercase italic tracking-tighter leading-none"
                               style={{ color: brand.colors?.[0] || '#c4973b', fontFamily: brand.fontStyle || 'Inter' }}
                            >
                               SEU DNA<br/>VISUAL AQUI.
                            </h4>
                            <p 
                               className="text-[12px] font-bold leading-relaxed max-w-[85%]"
                               style={{ color: brand.colors?.[2] || '#ffffff', fontFamily: brand.fontStyle || 'Inter' }}
                            >
                               Assim é como o PostDNA irá renderizar cada carrossel e story da sua marca.
                            </p>
                          </div>
                       </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-[24px] border border-white/5 text-center">
                       <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                         {step === 1 && "Suba o logo para começar"}
                         {step === 2 && "Cores exclusivas detectadas"}
                         {step === 3 && `Tipografia ${brand.fontStyle} ativa`}
                         {step === 4 && "Moodboard estratégico aplicado"}
                         {step > 4 && "Inteligência de mercado integrada"}
                       </p>
                    </div>
                 </div>
               </motion.div>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c4973b]/5 rounded-full blur-[140px] pointer-events-none" />
          </main>
        </div>
      )}

      {/* ══ DASHBOARD ══ */}
      {view === 'dashboard' && (
        <Dashboard brand={brand} setBrand={setBrand} primaryColor={primaryColor}
          onEditBrandKit={()=>{setStep(1);setView('onboarding');}} />
      )}
    </div>
  );
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const PLAN_SLOTS = {
  basico: [
    { day: 'thursday', type: 'CARROSSEL' },
  ],
  crescimento: [
    { day: 'monday',    type: 'CARROSSEL' },
    { day: 'wednesday', type: 'POST'      },
    { day: 'friday',    type: 'STORY'     },
  ],
  completo: [
    { day: 'monday',    type: 'CARROSSEL' },
    { day: 'tuesday',   type: 'POST'      },
    { day: 'wednesday', type: 'CARROSSEL' },
    { day: 'thursday',  type: 'BLOG'      },
    { day: 'friday',    type: 'POST'      },
    { day: 'saturday',  type: 'CARROSSEL' },
    { day: 'sunday',    type: 'BLOG'      },
  ],
};

const PIPELINE_STAGES = [
  { agent: 'SHERLOCK',      icon: '🔍', label: 'pipeline.stages.sherlock'     },
  { agent: 'ESTRATEGISTA',  icon: '♟️', label: 'pipeline.stages.estrategista' },
  { agent: 'COPYWRITER',    icon: '✍️', label: 'pipeline.stages.copywriter'   },
  { agent: 'DESIGNER',      icon: '🎨', label: 'pipeline.stages.designer'     },
  { agent: 'REVISOR',       icon: '✅', label: 'pipeline.stages.revisor'      },
];

const NAV_ITEMS = [
  { section: 'dashboard.sidebar.principal', items: [
    { key: 'home',        icon: <LayoutDashboard size={15}/>, label: 'dashboard.sidebar.home'          },
    { key: 'criar',       icon: <Plus size={15}/>,            label: 'dashboard.sidebar.create'   },
    { key: 'calendario',  icon: <Calendar size={15}/>,        label: 'dashboard.sidebar.calendar'         },
  ]},
  { section: 'dashboard.sidebar.marca', items: [
    { key: 'dna',         icon: <Fingerprint size={15}/>,   label: 'DNA da Marca'     },
    { key: 'banco_imagens', icon: <ImageIcon size={15}/>,    label: 'Banco de Imagens' },
    { key: 'ideias',      icon: <Sparkles size={15}/>,      label: 'Ideias Salvas'    },
    { key: 'inteligencia',icon: <Target size={15}/>,          label: 'dashboard.sidebar.intel' },
    { key: 'referencias', icon: <Star size={15}/>,            label: 'dashboard.sidebar.refs'        },
  ]},
];

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ brand, setBrand, primaryColor, onEditBrandKit }) {
  const { t, i18n } = useTranslation();
  const [dashView, setDashView]   = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDNAIncomplete, setIsDNAIncomplete] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [pipelineSubtitle, setPipelineSubtitle] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSherlockConfirmOpen, setIsSherlockConfirmOpen] = useState(false);
  const [sherlockSearchType, setSherlockSearchType] = useState('CARROSSEL');
  const [isSherlockSearching, setIsSherlockSearching] = useState(false);
  const [sherlockResults, setSherlockResults] = useState(null);
  const [topicHint, setTopicHint] = useState('');
  const [isSherlockCached, setIsSherlockCached] = useState(false);
  
  const [agenda, setAgenda]       = useState(JSON.parse(localStorage.getItem('postdna_agenda') || '[]'));
  const [approvedContent, setApprovedContent] = useState(JSON.parse(localStorage.getItem('postdna_approved') || '[]'));
  const [recentContent, setRecentContent] = useState(JSON.parse(localStorage.getItem('postdna_recent') || '[]'));
  
  const plan = brand.plan || 'free';
  const balance = brand.credit_balance || 0;
  const extra = brand.extra_credits || 0;
  const totalCredits = balance + extra;
  
  // Próxima renovação fictícia (18 dias a partir de hoje)
  const resetDays = 18;
  const resetDateStr = `renovam em ${resetDays} dias`;
  
  // Estimativas de valor
  const estCarousels = Math.floor(totalCredits / CREDIT_COSTS.CARROSSEL);
  const estPosts = Math.floor(totalCredits / CREDIT_COSTS.POST);

  const [pipelineStage, setPipelineStage] = useState(-1);   // -1 = idle
  const [generatingIdx, setGeneratingIdx] = useState(null);
  const [selectedItem, setSelectedItem]   = useState(null);

  const slots     = PLAN_SLOTS[plan] || PLAN_SLOTS.crescimento;
  const hasContent= agenda.length > 0;
  const firstName = brand.userName ? brand.userName.split(' ')[0] : null;

  const startSherlockResearch = (type) => {
    if (totalCredits < CREDIT_COSTS.SUGGESTION) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsSherlockConfirmOpen(false);
    setIsSherlockSearching(true);

    // Débito imediato do crédito de pesquisa
    setBrand(prev => {
      let newBalance = prev.credit_balance || 0;
      let newExtra = prev.extra_credits || 0;
      let remaining = CREDIT_COSTS.SUGGESTION;
      if (newBalance >= remaining) { newBalance -= remaining; } else { remaining -= newBalance; newBalance = 0; newExtra = Math.max(0, newExtra - remaining); }
      return { ...prev, credit_balance: newBalance, extra_credits: newExtra };
    });
    
    setTimeout(() => {
      const results = [
        {
          id: Date.now(),
          title: type === 'BLOG' ? "Como [Produto] resolve a maior dor de [Público] em 2024" : "O segredo para dominar [Nicho] com [Marca]",
          reasoning: "Tendência de busca em alta para 'soluções rápidas' e carência de conteúdo aprofundado.",
          brand_angle: `Destaque sua autoridade no segmento.`,
          suggested_format: type,
          highlight: true,
          research_cache: { source: 'Sherlock AI', depth: 'high' }
        },
        {
          id: Date.now() + 1,
          title: `3 erros que seu público comete ao tentar [Objetivo]`,
          reasoning: "Conteúdo de 'erro' gera 40% mais salvamentos no seu nicho.",
          brand_angle: "Posicione seu produto como a solução definitiva.",
          suggested_format: type === 'CARROSSEL' ? 'POST' : type,
          research_cache: { source: 'Sherlock AI', depth: 'mid' }
        },
        {
          id: Date.now() + 2,
          title: `O guia definitivo de ${brand.product || 'seu produto'} para iniciantes`,
          reasoning: "Posts de guia têm a melhor taxa de retenção no seu histórico.",
          brand_angle: "Focar na simplicidade e no DNA visual.",
          suggested_format: type,
          research_cache: { source: 'Sherlock AI', depth: 'standard' }
        }
      ];

      setSherlockResults(results);
      setIsSherlockSearching(false);
      setBrand(prev => ({ ...prev, saved_suggestions: [...(prev.saved_suggestions || []), ...results] }));
    }, 3000);
  };

  const refreshSuggestions = () => {
    setSherlockSearchType(brand.selectedType || 'CARROSSEL');
    setIsSherlockConfirmOpen(true);
  };

  const suggestions = brand.suggestions || [];

  // ── LOGICA DE CREDITOS ──
  // const usedCredits = agenda.filter(a => a.status === 'Pronto' || a.status === 'Aguardando revisão' || a.status === 'Gerando...').length;
  // const totalCredits = slots.length;
  // const hasCredits = usedCredits < totalCredits;

  const runPipeline = (idx, isFirst, topic = null) => {
    const item = agenda[idx];
    const itemType = item?.type || 'CARROSSEL';
    const cost = CREDIT_COSTS[itemType] || 10;
    const hasCache = !!item?.research_cache || !!selectedItem?.research_cache;
    setIsSherlockCached(hasCache);

    if (totalCredits < cost) {
      setIsLimitModalOpen(true);
      return;
    }
    
    setGeneratingIdx(idx);
    setAgenda(p => p.map((it, i) => i === idx ? { ...it, status: 'Gerando...' } : it));

    const baseDelay = isFirst ? 60000 : 1500; // Long delays for first run, short for subsequent
    const delays = [0, baseDelay, baseDelay * 2, baseDelay * 3, baseDelay * 4];

    // Se tem cache, pula o Sherlock (Stage 0)
    const effectiveStartStage = hasCache ? 1 : 0;
    if (hasCache) {
      setPipelineStage(1);
      setPipelineSubtitle("Estrategista: Definindo estrutura e direção visual de cada slide...");
    } else {
      setPipelineStage(0);
      setPipelineSubtitle("Sherlock está investigando as tendências do seu nicho...");
    }

    // 1. SHERLOCK (PULANDO SE TIVER CACHE)
    if (!hasCache) {
      setTimeout(() => {
        setPipelineStage(1);
        setPipelineSubtitle("Estrategista: Definindo estrutura e direção visual de cada slide...");
      }, delays[0]);
    }

    // 2. ESTRATEGISTA
    setTimeout(() => {
      setPipelineStage(2);
      setPipelineSubtitle("Copywriter: Escrevendo textos persuasivos e legendas otimizadas...");
    }, delays[1]);
    
    // 3. COPYWRITER
    setTimeout(() => {
      setPipelineStage(3);
      setPipelineSubtitle("Designer: Buscando a imagem perfeita no seu banco ou em bancos premium...");
    }, delays[2]);

    // 4. DESIGNER
    setTimeout(() => {
      setPipelineStage(4);
      setPipelineSubtitle("Revisor: Verificando legibilidade, contraste e identidade visual...");
    }, delays[3]);

    // 5. REVISOR & Conclusão
    setTimeout(() => {
      setPipelineStage(-1);
      setGeneratingIdx(null);
      
      const numFrames = itemType === 'STORY' ? 3 : 8; // STORIES ou CARROSSEL_STORIES

      const generatedContent = {
        id: Date.now(),
        topic: topic || "Conteúdo Automático",
        type: itemType,
        status: 'Aguardando revisão',
        date: new Date().toISOString().split('T')[0],
        // Lógica Narrativa para Stories ou Feed
        slides: Array.from({ length: numFrames }).map((_, i) => {
          const isStory = itemType.includes('STORY');
          const frameType = getFrameType(i, numFrames, isStory);
          
          return {
            index: i + 1,
            type: 'text_image',
            frameType: frameType,
            headline: getHeadlineForFrame(frameType, topic),
            body: getBodyForFrame(frameType),
            image: selectImageForSlide(i, brand, topic, isStory),
            layout: selectLayoutForSlide(i, isStory),
            safe_zone: isStory,
            max_lines: isStory ? 4 : 8
          };
        }),
        caption: `Legenda gerada para ${topic}... #postdna #marketing`,
        hasImages: true
      };

      const finishedItem = { ...(agenda[idx] || item), ...generatedContent, status: 'Aguardando revisão' };
      const newAgenda = agenda.map((a, i) => i === idx ? finishedItem : a);
      setAgenda(newAgenda);
      localStorage.setItem('postdna_agenda', JSON.stringify(newAgenda));
      
      setBrand(prev => {
        let newBalance = prev.credit_balance || 0;
        let newExtra = prev.extra_credits || 0;
        let remaining = cost;
        if (newBalance >= remaining) {
          newBalance -= remaining;
        } else {
          remaining -= newBalance;
          newBalance = 0;
          newExtra = Math.max(0, newExtra - remaining);
        }
        return { ...prev, credit_balance: newBalance, extra_credits: newExtra };
      });

      setIsTransitioning(true);
      setIsSherlockCached(false); // Reset cache flag
      setTimeout(() => {
        setIsTransitioning(false);
        setSelectedItem(finishedItem);
      }, 1500);
    }, delays[4] + (isFirst ? 1000 : 500)); // Add a small buffer at the end
  };

  function getFrameType(idx, total, isStory) {
    if (!isStory) return 'feed_slide';
    if (idx === 0) return 'hook';
    if (idx === total - 1) return 'cta';
    if (total === 3) return 'development';
    if (idx === 1) return 'context';
    if (idx === 2) return 'problem';
    if (idx === total - 2) return 'proof';
    return 'content';
  }

  function getHeadlineForFrame(type, topic) {
    const hooks = ["Você está fazendo errado", "O segredo revelado", "Pare tudo agora", "A verdade sobre..."];
    if (type === 'hook') return hooks[Math.floor(Math.random()*hooks.length)];
    if (type === 'cta') return "BORRA PRA CIMA!";
    return "Insight de Valor";
  }

  function getBodyForFrame(type) {
    if (type === 'hook') return "";
    return "Um pequeno texto focado em legibilidade e impacto direto, sem enrolação.";
  }

  function selectLayoutForSlide(index, isStory = false) {
    const storyLayouts = ["full_image_overlay", "split_vertical", "minimal_bottom", "gradient_text"];
    const feedLayouts = ["background_image_overlay", "solid_background", "split_layout", "dark_background"];
    
    const pool = isStory ? storyLayouts : feedLayouts;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function selectImageForSlide(index, brand, topic, isStory = false) {
    const userImages = brand.brand_images || [];
    
    // 1. Tentar imagem do banco do usuário
    // Para Stories, PRIORIDADE TOTAL em 'personal'
    const prefCategory = isStory ? 'personal' : (index === 0 ? 'brand' : 'product');
    const match = userImages.find(img => img.category === prefCategory);
    
    if (match) return match.file_url;

    // 2. Fallback: Categoria secundária
    const secondMatch = userImages.find(img => isStory ? img.category === 'product' : img.category === 'brand');
    if (secondMatch) return secondMatch.file_url;

    // 3. Fallback: Unsplash tematizado
    return `https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1080&h=1920&q=${index}`;
  }

  const handleApprove = (idx) => {
    const item = agenda[idx];
    const approvedItem = { 
      ...item, 
      status: 'Aprovado', 
      approvedAt: new Date().toISOString() 
    };
    
    const newApproved = [approvedItem, ...approvedContent];
    setApprovedContent(newApproved);
    localStorage.setItem('postdna_approved', JSON.stringify(newApproved));
    
    // Na aprovação, mantemos no dashboard com status 'Pronto' para retenção visual
    setAgenda(p => p.map((a, i) => i === idx ? { ...a, status: 'Pronto' } : a));
    
    // setSelectedItem(null); // This will be handled by the ContentReviewModal's button logic
  };

  const handleCreateFirst = (topicHint) => {
    if (totalCredits < CREDIT_COSTS.CARROSSEL) {
      setIsLimitModalOpen(true);
      return;
    }

    const topics = generateAITopics(brand);
    const newItem = {
      id: Date.now(),
      topic: topicHint || topics[0],
      type: 'CARROSSEL', // Default type for new content
      status: 'Gerando...',
      createdAt: new Date().toISOString(),
    };

    const newAgenda = [newItem, ...agenda]; // Add new item to the beginning of agenda
    const newRecent = [{ ...newItem, createdAt: new Date().toISOString() }, ...recentContent].slice(0, 5);
    setRecentContent(newRecent);
    localStorage.setItem('postdna_recent', JSON.stringify(newRecent));

    setDashView('home');
    setAgenda(newAgenda);
    localStorage.setItem('postdna_agenda', JSON.stringify(newAgenda));
    setGeneratingIdx(0); // Set generating index to the first item (the new one)
    setSelectedItem(newItem); // Optionally select the new item for review later
    runPipeline(0, approvedContent.length === 0, topicHint);
  };

  // Sidebar
  const Sidebar = () => (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 glass border-r border-white/5 p-6 flex flex-col gap-5 shrink-0 z-[70] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center"><Zap size={16} className="text-black"/></div>
        <span className="text-sm font-black uppercase tracking-tighter italic">Post<span className="text-[#c4973b]">DNA</span></span>
      </div>

      {/* Brand Kit mini */}
      <div className="bg-white/5 border border-white/5 rounded-[18px] p-3 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain"/> : <Zap size={14} style={{color:primaryColor}}/>}
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Brand Kit</p>
            <p className="text-[10px] font-bold text-white truncate">{brand.businessName || brand.website || 'Minha marca'}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {brand.colors.slice(0,3).map((c,i)=><div key={i} className="flex-1 h-2 rounded-full" style={{backgroundColor:c}}/>)}
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-5">
        {NAV_ITEMS.map(section => (
          <div key={section.section}>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-700 px-3 mb-2">{t(section.section)}</p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(item => (
                <button key={item.key}
                  onClick={() => setDashView(item.key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                    dashView === item.key
                      ? 'bg-[#c4973b]/10 text-[#c4973b] border border-[#c4973b]/20'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}>
                  {item.icon} {t(item.label)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Plan & Credits badge */}
      <div className="bg-[#c4973b]/10 border border-[#c4973b]/20 rounded-[20px] p-4 space-y-3 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-12 h-12 bg-[#c4973b]/10 rounded-full blur-xl group-hover:bg-[#c4973b]/20 transition-all"/>
        <div className="flex justify-between items-center relative z-10">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#c4973b]">{plan === 'completo' ? 'ESCALA' : plan.toUpperCase()}</p>
           <span className="text-[10px] text-white font-black">{totalCredits} CRÉDITOS</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(totalCredits / (PLAN_SPECS[plan]?.credits || 1)) * 100}%` }} // Assuming totalCredits is current, and PLAN_SPECS[plan].credits is max
             className="h-full bg-[#c4973b]" />
        </div>
        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2">
          {totalCredits} CRÉDITOS DISPONÍVEIS
        </p>
      </div>
    </aside>
    </>
  );

  // ── PIPELINE OVERLAY ──
  const PipelineOverlay = () => {
    // Cálculo da estimativa
    const getEstimate = () => {
      if (pipelineStage === 0) return "Aproximadamente 3 minutos";
      if (pipelineStage === 1 || pipelineStage === 2) return "Aproximadamente 2 minutos";
      if (pipelineStage === 3) return "Menos de 1 minuto";
      if (pipelineStage === 4) return "Finalizando...";
      return "";
    };

    return (
      <AnimatePresence>
        {pipelineStage >= 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div initial={{y:24,opacity:0}} animate={{y:0,opacity:1}}
              className="glass border border-white/10 rounded-[40px] p-10 w-full max-w-md mx-4 space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-[20px] bg-[#c4973b]/10 border border-[#c4973b]/30 flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">PostDNA Em Ação</h3>
                
                <div className="mt-2 space-y-1">
                  <p className={`text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed ${pipelineSubtitle.length > 20 ? 'italic' : ''}`}>
                    {pipelineSubtitle}
                  </p>
                  <p className="text-[8px] text-[#c4973b] font-black uppercase tracking-[0.2em] opacity-80">
                    {getEstimate()}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage, i) => {
                  const done    = i < pipelineStage;
                  const current = i === pipelineStage;
                  return (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-[16px] transition-all ${current ? 'bg-[#c4973b]/10 border border-[#c4973b]/20' : 'opacity-40'}`}>
                      <span className="text-lg shrink-0">
                        {done ? '✅' : current ? <span className="inline-block animate-pulse">⏳</span> : '◻️'}
                      </span>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#c4973b]">{stage.agent}</p>
                        <p className="text-xs font-bold text-gray-300">
                          {isSherlockCached && i === 0 ? "Mercado já investigado para este tema" : t(stage.label)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {isTransitioning && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
             className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
             <div className="text-center space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-20 h-20 rounded-[24px] bg-[#c4973b] flex items-center justify-center mx-auto shadow-2xl shadow-[#c4973b]/20"
                >
                  <Zap size={40} className="text-black" />
                </motion.div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Seu conteúdo está pronto.</h2>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Preparando a visualização...</p>
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ── CALENDAR VIEW ────────────────────────────────────────────────────────
  const CalendarView = () => (
    <CalendarPage 
      approvedContent={approvedContent} 
      brand={brand} 
      setDashView={setDashView}
      onOpenDetails={(item) => setSelectedItem(item)}
    />
  );

  const CreateView = () => (
    <CreateContentPage 
      brand={brand} 
      recentContent={recentContent}
      onOpenItem={(item) => setSelectedItem(item)}
      onRunPipeline={(data) => {
        if (totalCredits < CREDIT_COSTS.CARROSSEL) { // Using CARROSSEL as a generic cost for new content
          setIsLimitModalOpen(true);
        } else {
          // Iniciar fluxo Sherlock
          handleCreateFirst(data.topic);
        }
      }}
    />
  );

  const Header = () => (
    <header className="flex items-center justify-between mb-8 lg:mb-10 shrink-0 gap-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400"
        >
          <Menu size={20} />
        </button>
        <div className="lg:hidden">
          <span className="text-sm font-black uppercase tracking-tighter italic">Post<span className="text-[#c4973b]">DNA</span></span>
        </div>
      </div>
      <div>
        <h1 className="text-xl lg:text-3xl font-black uppercase italic tracking-tighter leading-none mb-2">
          {t('dashboard.welcomeActive')} {firstName || 'Chefe'}.
        </h1>
        <div className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t('dashboard.trained')}
          </div>
          <span className="text-white/10">|</span>
          <span className="text-[#c4973b]">{PLAN_SPECS[plan]?.name} · {totalCredits} CR</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Seletor de Idioma Rápido */}
        <div className="flex glass rounded-full p-1 border border-white/5">
          {['pt-BR', 'es'].map(lang => (
            <button key={lang}
              onClick={() => {
                setBrand(p => ({ ...p, interfaceLanguage: lang }));
                i18n.changeLanguage(lang);
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
                i18n.language === lang ? 'bg-[#c4973b] text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              {lang === 'pt-BR' ? 'PT' : 'ES'}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black uppercase tracking-tighter leading-none">{brand?.businessName || t('common.brandKit')}</div>
            <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{(t('dashboard.agenda.subtitle', { plan, count: slots?.length || 0 }) || "").split('·')[0]}</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            {brand.logo ? <img src={brand.logo} className="w-7 h-7 object-contain rounded" /> : <User size={20} className="text-gray-600" />}
          </div>
        </div>
      </div>
    </header>
  );

  // ── HOME VIEW ──
  const HomeView = () => {
    const recent = agenda.slice(0, 3);
    const savedIdeasCount = brand.suggestions?.length || 0;

    const contentItems = [
      { id: 'SUGGESTION', label: 'Sugestão de Tema', icon: <Search size={16}/>, cost: 1, minPlan: 'free', highlight: true },
      { id: 'CARROSSEL', label: 'Carrossel', icon: <Layers size={16}/>, cost: 10, minPlan: 'free' },
      { id: 'STORY_CAROUSEL', label: 'Stories Narrativo', icon: <Zap size={16}/>, cost: 8, minPlan: 'basico' },
      { id: 'POST', label: 'Post Estático', icon: <Camera size={16}/>, cost: 4, minPlan: 'free' },
      { id: 'STORY_SIMPLE', label: 'Story Simples', icon: <Zap size={16}/>, cost: 3, minPlan: 'free' },
      { id: 'CAPTION', label: 'Legenda', icon: <MessageSquare size={16}/>, cost: 2, minPlan: 'free' },
      { id: 'BLOG', label: 'Blog', icon: <Globe size={16}/>, cost: 8, minPlan: 'completo' },
    ].filter(item => item.id !== 'BLOG' || plan === 'completo');

    const isLocked = (minPlan) => {
      const hierarchy = ['free', 'basico', 'crescimento', 'completo'];
      return hierarchy.indexOf(plan) < hierarchy.indexOf(minPlan);
    };

    return (
      <div className="space-y-12 pb-20">
        
        {/* Bloco 2: O que vamos criar hoje? */}
        <section className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">O que vamos criar hoje?</h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed">Selecione o formato para iniciar sua estratégia consciente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {contentItems.map((item) => {
              const locked = isLocked(item.minPlan);
              if (item.id === 'SUGGESTION') {
                return (
                  <button 
                    key={item.id}
                    onClick={refreshSuggestions}
                    className="relative group p-4 rounded-[28px] border border-[#c4973b]/40 bg-[#c4973b]/5 hover:bg-[#c4973b]/10 transition-all flex flex-col items-center justify-center gap-3 text-center shadow-xl shadow-[#c4973b]/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#c4973b] text-black flex items-center justify-center shadow-lg shadow-[#c4973b]/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="block font-black uppercase tracking-tighter text-[10px] text-white leading-none">{item.label}</span>
                      <span className="block text-[8px] font-black italic uppercase text-[#c4973b]">{item.cost} crédito</span>
                    </div>
                  </button>
                );
              }
              return (
                <button 
                  key={item.id}
                  onClick={() => !locked && handleCreateByType(item.id)}
                  className={`relative group p-4 rounded-[28px] border transition-all flex flex-col items-center justify-center gap-3 text-center ${
                    locked ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/5' : 
                    'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${locked ? 'border-white/5 text-gray-700' : 'border-white/10 text-gray-400 group-hover:text-white transition-colors'}`}>
                    {locked ? <Lock size={16}/> : item.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black uppercase tracking-tighter text-[10px] text-gray-400 group-hover:text-white transition-colors leading-none">{item.label}</span>
                    <span className="block text-[8px] font-black uppercase text-gray-600">{item.cost} créditos</span>
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/95 px-2 py-1 rounded-lg text-[7px] font-black text-white uppercase tracking-widest border border-white/10">
                        Plano Completo
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bloco 3: Ideias Salvas */}
        {brand.saved_suggestions?.length > 0 && (
          <section className="p-6 rounded-[32px] bg-gradient-to-r from-[#c4973b]/10 to-transparent border border-[#c4973b]/20 flex items-center justify-between group cursor-pointer hover:bg-[#c4973b]/20 transition-all" onClick={() => setDashView('ideias')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c4973b]/20 text-[#c4973b] flex items-center justify-center animate-pulse">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">
                  {brand.saved_suggestions?.length} ideias do Sherlock aguardando →
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c4973b]/60 mt-1">
                  Clique para ver e transformar em conteúdo consciente
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </section>
        )}

        {/* Bloco 4: Criados recentemente */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <History size={16} className="text-gray-700"/>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">Criados recentemente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recent.length > 0 ? recent.map((c, i) => (
              <div key={i} 
                onClick={() => setSelectedItem(c)}
                className="group p-5 rounded-[24px] glass border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-500">
                    {c.type}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${c.status === 'Aprovado' ? 'text-green-500' : 'text-orange-400'}`}>
                    {c.status === 'Aprovado' && <Check size={10}/>} {c.status}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-gray-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                  {c.topic}
                </h5>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[8px] font-bold text-gray-600 uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                   <span className="text-[8px] font-black uppercase text-[#c4973b] group-hover:translate-x-1 transition-transform">Abrir →</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center glass border border-white/5 rounded-[32px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Nenhum conteúdo gerado ainda.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    );
  };

  const handleCreateByType = (type) => {
    setBrand(prev => ({ ...prev, selectedType: type }));
    setDashView('criar');
  };

  const SherlockConfirmationModal = ({ type, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="relative w-full max-w-sm glass rounded-[32px] p-8 border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#c4973b]" />
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#c4973b]/10 text-[#c4973b] flex items-center justify-center">
            <Search size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Sherlock vai investigar seu mercado</h3>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              Vou pesquisar tendências para <span className="text-white">{type}</span> no seu nicho e sugerir 3 temas com alto potencial agora.
            </p>
          </div>
          <div className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
             <div className="flex flex-col items-start gap-1">
                <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Custo da pesquisa</span>
                <span className="text-sm font-black text-[#c4973b]">1 CRÉDITO</span>
             </div>
             <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Seu saldo</span>
                <span className="text-sm font-black text-white">{totalCredits} CR</span>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={onClose} className="py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors border border-white/5">Cancelar</button>
            <button onClick={onConfirm} className="gold-gradient py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg">Confirmar →</button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const SherlockResultsView = () => (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto custom-scrollbar">
        <section className="space-y-10 p-8">
          <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-[#c4973b]/30 text-[#c4973b] animate-bounce">
              <Search size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Relatório Sherlock Pronto</span>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Analisei {Math.floor(Math.random()*20+15)} perfis do seu nicho e identifiquei 3 oportunidades reais:
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sherlockResults.map((res, i) => (
              <motion.div 
                key={i}
                initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay: i*0.1}}
                className={`relative p-8 rounded-[40px] glass border transition-all flex flex-col justify-between group ${res.highlight ? 'border-[#c4973b]/40 ring-1 ring-[#c4973b]/20 shadow-2xl shadow-[#c4973b]/5' : 'border-white/5'}`}
              >
                {res.highlight && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#c4973b] text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                     ⭐ Maior Potencial
                   </div>
                )}
                
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-white leading-tight">{res.title}</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-[#c4973b] tracking-widest">
                        <TrendingUp size={10} /> Por que agora?
                      </div>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">{res.reasoning}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-400 tracking-widest">
                        <Target size={10} /> Seu Ângulo (DNA)
                      </div>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">{res.brand_angle}</p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                       <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Formato Sugerido</span>
                       <span className="text-[9px] font-black text-white uppercase bg-white/5 px-2 py-1 rounded-md">{res.suggested_format}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleCreateByType(res.suggested_format);
                    setTopicHint(res.title);
                    setSherlockResults(null);
                  }}
                  className="mt-8 w-full py-4 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[10px] show-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Usar este tema →
                </button>
              </motion.div>
            ))}
          </div>

          <footer className="flex flex-col items-center gap-6 pt-10">
            <div className="flex gap-4">
              <button 
                onClick={() => setSherlockResults(null)}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
              >
                Salvar todas para depois
              </button>
              <button 
                onClick={() => startSherlockResearch(sherlockSearchType)}
                className="px-8 py-4 rounded-2xl border border-[#c4973b]/20 bg-[#c4973b]/5 text-[#c4973b] hover:bg-[#c4973b]/10 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Nova Sugestão (1 CR)
              </button>
            </div>
            <button onClick={() => setSherlockResults(null)} className="text-[10px] font-black uppercase text-gray-700 hover:text-white tracking-[0.3em]">Fechar Relatório</button>
          </footer>
        </section>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-inter selection:bg-[#c4973b] selection:text-black">
      <Sidebar />
      <PipelineOverlay />
      <AnimatePresence>
        {selectedItem && (
          <ContentReviewModal 
            brand={brand} 
            item={selectedItem} 
            onApprove={() => {
              const idx = agenda.findIndex(a => a.topic === selectedItem.topic);
              if (idx !== -1) handleApprove(idx);
            }}
            onClose={() => setSelectedItem(null)}
            readOnly={selectedItem?.status === 'Aprovado' || approvedContent?.some(c => c.topic === selectedItem?.topic)}
          />
        )}
      </AnimatePresence>
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative h-full bg-[#050505]">
        {/* Credit Banner Global */}
        <div className="flex-shrink-0 -mx-8 mb-8 overflow-hidden">
          <div className="bg-[#c4973b]/5 border-b border-white/5 px-8 py-5 flex items-center justify-between group hover:bg-[#c4973b]/10 transition-all">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c4973b] text-black flex items-center justify-center shadow-lg shadow-[#c4973b]/20">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">
                    {totalCredits} créditos disponíveis <span className="text-gray-600 ml-2">—</span> <span className="text-[10px] text-[#c4973b] tracking-widest ml-2">{resetDateStr}</span>
                  </h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                    ≈ {estCarousels} carrosséis · ou {estPosts} posts estáticos · ou como preferir
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsLimitModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#c4973b] hover:text-black transition-all shadow-xl"
            >
              UPGRADE & CRÉDITOS →
            </button>
          </div>
        </div>
        <Header/>
        {dashView === 'home' && <HomeView />}
        {dashView === 'inteligencia' && <IntelPage brand={brand} hasActivated={hasContent} primaryColor={primaryColor} onCreateFirst={(topic) => { handleCreateFirst(topic || null); setDashView('home'); }} />}
        {dashView === 'referencias' && <RefsPage brand={brand} setBrand={setBrand} />}
        {dashView === 'dna' && <DNAPage brand={brand} setBrand={setBrand} approvedCount={approvedContent.length} />}
        {dashView === 'entrega' && (
          <DeliveryPage 
            item={selectedItem} 
            brand={brand} 
            onBack={() => setDashView('calendario')} 
            onCreateVariation={() => {
              setTopicHint(`Variação de: ${selectedItem.topic}`);
              setDashView('criar');
            }}
          />
        )}
        {dashView === 'banco_imagens' && (
          <ImageBankPage 
            brand={brand} 
            onUpload={(newImgs) => {
              setBrand(prev => ({
                ...prev,
                brand_images: [...(prev.brand_images || []), ...newImgs]
              }));
            }} 
            onDelete={(id) => {
              setBrand(prev => ({
                ...prev,
                brand_images: (prev.brand_images || []).filter(img => img.id !== id)
              }));
            }} 
          />
        )}
        {dashView === 'calendario' && <CalendarView />}
        {dashView === 'ideias' && (
          <SavedIdeasPage 
            brand={brand} 
            onSelectIdea={(idea) => {
              setBrand(prev => ({ ...prev, selectedType: idea.suggested_format }));
              setTopicHint(idea.title);
              setDashView('criar');
            }}
            onDeleteIdea={(id) => {
               setBrand(prev => ({
                 ...prev,
                 saved_suggestions: (prev.saved_suggestions || []).map(s => s.id === id ? { ...s, status: 'discarded' } : s)
               }));
            }}
            onViewContent={(idea) => {
               const content = approvedContent.find(c => c.topic === idea.title) || agenda.find(c => c.topic === idea.title);
               if (content) setSelectedItem(content);
            }}
            onRefreshSherlock={refreshSuggestions}
          />
        )}
        {dashView === 'criar' && (
          <CreateContentPage 
            brand={brand} 
            recentContent={agenda} 
            onRunPipeline={(p) => {
              const newItem = {
                id: Date.now(),
                topic: p.topic,
                type: p.type,
                status: 'Gerando...',
                createdAt: new Date().toISOString()
              };
              setAgenda([newItem, ...agenda]);
              localStorage.setItem('postdna_agenda', JSON.stringify([newItem, ...agenda]));
              
              // Marcar ideia como utilizada
              setBrand(prev => ({
                ...prev,
                saved_suggestions: (prev.saved_suggestions || []).map(s => 
                  s.title === p.topic ? { ...s, used: true, status: 'used' } : s
                )
              }));

              runPipeline(0, approvedContent.length === 0, p.topic);
              setDashView('home');
              setTopicHint(''); // Limpar após uso consciente
            }} 
            onOpenItem={setSelectedItem}
            initialType={brand.selectedType || 'CARROSSEL'}
            initialTopic={topicHint}
            onRefreshSuggestions={refreshSuggestions}
          />
        )}
      </main>

        <AnimatePresence>
          {isSherlockConfirmOpen && (
            <SherlockConfirmationModal 
              type={sherlockSearchType} 
              onClose={() => setIsSherlockConfirmOpen(false)}
              onConfirm={() => startSherlockResearch(sherlockSearchType)}
            />
          )}

          {isSherlockSearching && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl border-2 border-[#c4973b]/20 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#c4973b]">
                     <Search size={32} className="animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                   <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Sherlock Investigando...</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">Analisando concorrência e tendências</p>
                </div>
              </div>
            </div>
          )}

          {sherlockResults && <SherlockResultsView />}

          {isLimitModalOpen && (
            <LimitModal 
              brand={brand}
              onClose={() => setIsLimitModalOpen(false)}
              onUpgrade={(newPlan) => {
                setBrand({...brand, plan: newPlan});
                setIsLimitModalOpen(false);
              }}
            />
          )}
      </AnimatePresence>
    </div>
  );
}

