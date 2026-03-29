import React, { useState, useEffect } from 'react';
import {
  Check, Plus, Image as ImageIcon, Palette, Calendar, Zap, Cpu, Shield,
  ChevronRight, ChevronLeft, Globe, Type, LayoutDashboard, Loader2,
  Star, TrendingUp, Clock, MoreVertical, Sparkles, Target,
  DollarSign, Users, Mic, MessageSquare, User, Fingerprint,
  Layers, Square, Frame, Box, Heart, Camera, History, Lock, Search, Menu, X, ArrowLeft, ExternalLink, Bell, RefreshCw, Package, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import DNAPage from './DNAPage';
import IntelPage from './IntelPage';
import RefsPage from './RefsPage';
import ContentReviewModal from './ContentReviewModal';
import CreateContentPage from './CreateContentPage';
import LimitModal from './LimitModal';
import { useTranslation } from 'react-i18next';
import { analyzeWebsiteDNA, generateContent } from './aiAnalyzer';
import SignupView from './SignupView';
import SavedIdeasPage from './SavedIdeasPage';
import ImageBankPage from './ImageBankPage';
import DeliveryPage from './DeliveryPage';
import LandingPage from './LandingPage';
import SettingsPage from './SettingsPage';
import CancellationFlow from './CancellationFlow';
import OnboardingWizard from './OnboardingWizard';
import CustomAlert from './CustomAlert';


const sanitizeColor = (c, fallback = '#000000') => 
  (typeof c === 'string' && c.startsWith('#') && (c.length === 4 || c.length === 7 || c.length === 9)) ? c : fallback;

// ── CALENDAR PAGE COMPONENT (GLOBAL TO FIX BUNDLING & PERFORMANCE) ──────────
const CalendarPage = ({ approvedContent = [], brand, setDashView, onOpenDetails }) => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const isEs = (i18n?.language === 'es' || i18n?.language?.startsWith('es'));
  const monthName = currentDate.toLocaleString(isEs ? 'es-ES' : 'pt-BR', { month: 'long', year: 'numeric' });
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  
  const weekdays = isEs 
    ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const monthlyContent = (approvedContent || []).filter(c => {
    if (!c?.approvedAt) return false;
    const d = new Date(c.approvedAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const contentByDay = {};
  monthlyContent.forEach(c => {
    const d = new Date(c.approvedAt).getDate();
    if (!contentByDay[d]) contentByDay[d] = [];
    contentByDay[d].push(c);
  });

  const stats = {
    total: monthlyContent.length,
    published: monthlyContent.filter(c => c?.status === 'Publicado').length,
    scheduled: monthlyContent.filter(c => c?.status !== 'Publicado').length
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDay(null);
  };

  const getTypeIcon = (type) => {
    const tStr = (type || '').toUpperCase();
    if (tStr.includes('CARROSSEL')) return <Layers size={10} />;
    if (tStr.includes('BLOG')) return <Globe size={10} />;
    return <Camera size={10} />;
  };

  // Sanitize brand colors
  const primaryColor = sanitizeColor(brand?.colors?.[0], '#c4973b');
  const baseColor = sanitizeColor(brand?.colors?.[1], '#000000');

  if ((approvedContent || []).length === 0) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex items-start gap-4 bg-accent/5 border border-[#c4973b]/20 rounded-[28px] p-6 shadow-xl shadow-[#c4973b]/5">
           <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl shrink-0">📅</div>
           <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">O que é o Calendário de Marca?</h4>
              <p className="text-[11px] text-gray-300 font-bold leading-relaxed">
                 O Calendário é o <strong className="text-white">histórico de execução</strong> do seu Squad. 
                 Assim que você aprova um conteúdo (Copy + Design), ele é registrado aqui automaticamente para controle de consistência e frequência.
              </p>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in duration-700">
          <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
             <Calendar size={40} className="text-accent relative z-10" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-widest text-white">Seu calendário ainda está virgem</p>
            <p className="text-[11px] text-gray-300 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
              Aprove conteúdos para vê-los organizados por data e horário.
            </p>
          </div>
          <button onClick={() => setDashView('criar')}
            className="intel-gradient text-black px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.05] transition-transform shadow-xl">
            <Sparkles size={14} /> + Criar primeiro conteúdo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full relative overflow-hidden">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-10">
        <div className="flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-30 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={18} className="text-gray-400"/></button>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter capitalize min-w-[140px] text-center">{monthName}</h3>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={18} className="text-gray-400"/></button>
            </div>
            
            {stats.total > 0 && (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                   <strong className="text-accent">{stats.total}</strong> APROVADOS
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                   <strong className="text-green-500">{stats.published}</strong> PUBLICADOS
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                   <strong className="text-blue-400">{stats.scheduled}</strong> AGENDADOS
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekdays.map(d=>(
            <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-gray-700 py-3">{d}</div>
          ))}
          {days.map((d, i) => {
            const dayContent = d && contentByDay[d];
            const isSelected = selectedDay === d;
            return (
              <div key={i} 
                onClick={() => d && dayContent && setSelectedDay(d)}
                className={`aspect-square rounded-[24px] p-3 flex flex-col items-center justify-between transition-all relative overflow-hidden group border ${
                  d ? 'bg-white/3 border-white/5 cursor-pointer hover:border-white/10' : 'opacity-0 pointer-events-none'
                } ${dayContent ? 'bg-white/5 border-white/10' : ''} ${isSelected ? 'border-[#c4973b]/60 bg-accent/10' : ''}`}>
                
                {d && <span className={`text-xs font-black ${dayContent ? 'text-accent' : 'text-gray-800'}`}>{d}</span>}
                
                <div className="flex flex-col gap-1 w-full mt-auto">
                  {dayContent?.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-accent opacity-60">{getTypeIcon(c?.type)}</div>
                      <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-accent w-full" />
                      </div>
                    </div>
                  ))}
                  {(dayContent?.length > 3) && (
                    <p className="text-[7px] font-black text-gray-400 text-center">+{dayContent.length - 3} MAIS</p>
                  )}
                </div>

                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#c4973b]" />}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && contentByDay[selectedDay] && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
            className="w-80 glass border-l border-white/10 p-6 flex flex-col gap-6 overflow-y-auto sticky top-0 h-[calc(100vh-140px)] z-40"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase italic tracking-tighter">Conteúdo do Dia {selectedDay}</h4>
              <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400"><X size={16}/></button>
            </div>

            <div className="space-y-6">
              {contentByDay[selectedDay].map((item, idx) => (
                <div key={idx} className="space-y-4 pb-6 border-b border-white/5 last:border-0">
                   <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 bg-white/5 relative group cursor-pointer"
                        style={{ background: `linear-gradient(145deg, ${baseColor}, ${primaryColor}22)` }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                         <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-4 overflow-hidden">
                            {brand?.logo ? <img src={brand.logo} className="w-full h-full object-contain" /> : <p className="font-black text-xs">{(brand?.businessName || 'P').substring(0,1)}</p>}
                         </div>
                         <h5 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{item?.topic || 'Untitled'}</h5>
                         <p className="text-[7px] text-gray-300 font-bold uppercase tracking-[0.2em]">{item?.type || 'Post'}</p>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => onOpenDetails?.(item)} className="px-4 py-2 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest">Ver Completo</button>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${item?.status === 'Publicado' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-400'}`}>
                            {item?.status === 'Publicado' ? 'Publicado' : 'Agendado'}
                         </span>
                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item?.approvedAt ? new Date(item.approvedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</p>
                      </div>
                      <p className="text-xs font-black uppercase italic tracking-tighter text-white">{item?.topic || 'Untitled'}</p>
                      <p className="text-[10px] text-gray-300 font-bold leading-relaxed line-clamp-3 italic">"{item?.caption || 'Sem legenda disponível...'}"</p>
                      
                      <button onClick={() => onOpenDetails?.(item)}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[#c4973b]/40 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        Detalhes Completos <ExternalLink size={10}/>
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
// CalendarPage definition moved here

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
    name: 'GRATUITO', 
    price: 0, 
    credits: 10, 
    isMonthly: false,
    features: ['1 Carrossel completo', 'Sherlock Básico']
  },
  basico: { 
    name: 'BÁSICO', 
    price: 67, 
    credits: 80, 
    isMonthly: true,
    features: ['80 créditos/mês', 'Carrossel, Posts & Stories', 'Estratégia IA']
  },
  crescimento: { 
    name: 'CRESCIMENTO', 
    price: 147, 
    credits: 240, 
    isMonthly: true,
    features: ['240 créditos/mês', 'Carrossel, Post Estático, Stories, Story Carrossel', 'Análise de Nicho']
  },
  completo: { 
    name: 'COMPLETO', 
    price: 197, 
    credits: 400, 
    isMonthly: true,
    features: ['400 créditos/mês', 'Todos os tipos de conteúdo', 'Blog incluso (8 créditos/artigo)']
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
  { id: 'inter_inter', name: 'Inter', sub: 'Inter', headline: 'Inter', body: 'Inter', category: 'Sans' },
  { id: 'montser_montser', name: 'Montserrat', sub: 'Montserrat', headline: 'Montserrat', body: 'Montserrat', category: 'Sans' },
  { id: 'playfair_nunito', name: 'Playfair Display', sub: 'Nunito', headline: 'Playfair Display', body: 'Nunito', category: 'Serif' },
  { id: 'cormorant_inter', name: 'Cormorant', sub: 'Inter', headline: 'Cormorant Garamond', body: 'Inter', category: 'Serif' },
  { id: 'oswald_inter', name: 'Oswald', sub: 'Inter', headline: 'Oswald', body: 'Inter', category: 'Sans' },
  { id: 'dm_sans_dm_sans', name: 'DM Sans', sub: 'DM Sans', headline: 'DM Sans', body: 'DM Sans', category: 'Sans' },
  { id: 'overpass_overpass', name: 'Overpass', sub: 'Overpass', headline: 'Overpass', body: 'Overpass', category: 'Sans' },
  { id: 'barlow_barlow', name: 'Barlow', sub: 'Barlow', headline: 'Barlow', body: 'Barlow', category: 'Sans' },
  { id: 'nunito_pt_sans', name: 'Nunito', sub: 'PT Sans', headline: 'Nunito', body: 'PT Sans', category: 'Sans' },
  { id: 'lora_source', name: 'Lora', sub: 'Source Sans 3', headline: 'Lora', body: 'Source Sans 3', category: 'Serif' },
  { id: 'instrument_sans', name: 'Instrument Sans', sub: 'Instrument Sans', headline: 'Instrument Sans', body: 'Instrument Sans', category: 'Sans' },
  { id: 'roboto_slab', name: 'Roboto Slab', sub: 'Roboto', headline: 'Roboto Slab', body: 'Roboto', category: 'Serif' },
  { id: 'barlow_monts', name: 'Barlow', sub: 'Montserrat', headline: 'Barlow Condensed', body: 'Montserrat', category: 'Sans' },
  { id: 'libre_dm', name: 'Libre Baskerville', sub: 'DM Sans', headline: 'Libre Baskerville', body: 'DM Sans', category: 'Serif' },
  { id: 'monts_heebo', name: 'Montserrat', sub: 'Heebo', headline: 'Montserrat', body: 'Heebo', category: 'Sans' },
  { id: 'prompt_mukta', name: 'Prompt', sub: 'Mukta', headline: 'Prompt', body: 'Mukta', category: 'Sans' },
  { id: 'inconsolata', name: 'Inconsolata', sub: 'Inconsolata', headline: 'Inconsolata', body: 'Inconsolata', category: 'Mono' },
  { id: 'fraunces', name: 'Fraunces', sub: 'Fraunces', headline: 'Fraunces', body: 'Fraunces', category: 'Serif' },
  { id: 'gelasio', name: 'Gelasio', sub: 'Gelasio', headline: 'Gelasio', body: 'Gelasio', category: 'Serif' },
  { id: 'kanit_kanit', name: 'Kanit', sub: 'Kanit', headline: 'Kanit', body: 'Kanit', category: 'Sans' },
  { id: 'archivo', name: 'Archivo', sub: 'Archivo Narrow', headline: 'Archivo Black', body: 'Archivo Narrow', category: 'Sans' },
];

const ONBOARDING_FONTS_CATEGORIES = ['Todos', 'Sans', 'Serif', 'Mono'];

const DESIGN_STYLES = [
  { id: 'standard', name: 'Standard', desc: 'Sombra leve e layouts limpos', icon: 'Layers' },
  { id: 'minimalist', name: 'Minimalista', desc: 'Zero bordas, foco total no texto', icon: 'Square' },
  { id: 'border', name: 'Borda', desc: 'Contornos nítidos e estrutura visível', icon: 'Frame' },
  { id: 'glass', name: 'Vidro', desc: 'Desfoque de fundo e transparência criativa', icon: 'Sparkles' },
  { id: 'block', name: 'Bloco', desc: 'Cards destacados e profundidade 3D', icon: 'Box' },
  { id: 'warm', name: 'Acolhedor', desc: 'Cantos arredondados e tons orgânicos', icon: 'Heart' },
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
    `Enquete: qual é seu maior desafio hoje?`,
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
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-0.5">{label}</p>
      <p className="text-[9px] font-mono text-gray-800 font-bold uppercase select-all truncate">{color}</p>
    </div>
  </div>
);


const VoiceSlider = ({ label, leftLabel, rightLabel, leftEx, rightEx, value, onChange }) => (
  <div className="bg-white/5 border border-white/5 rounded-[24px] p-5 space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">{label}</p>
    <div className="flex gap-3">
      <div className="flex-1 bg-white/3 border border-white/5 rounded-xl p-3 text-[10px] italic text-gray-300">
        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-300 mb-1">{leftLabel}</span>
        {leftEx}
      </div>
      <div className="flex-1 bg-white/3 border border-white/5 rounded-xl p-3 text-[10px] italic text-gray-300 text-right">
        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-300 mb-1">{rightLabel}</span>
        {rightEx}
      </div>
    </div>
    <div>
      <input type="range" min="1" max="5" step="1" value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: '#c4973b' }} />
      <div className="flex justify-between mt-1">
        {[1,2,3,4,5].map(n => (
          <div key={n} className={`w-1.5 h-1.5 rounded-full transition-all ${n <= value ? 'bg-accent' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  </div>
);

const KPICard = ({ icon, label, value, sub }) => (
  <div className="glass p-6 rounded-[28px] flex flex-col gap-3 border border-white/5 hover:border-white/10 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-1">{label}</p>
      <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
      {sub && <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-1">{sub}</p>}
    </div>
  </div>
);


const ColorFullPicker = ({ label, color, desc, onChange }) => (
  <div className="flex items-center justify-between gap-4 p-3 lg:p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
    <div className="flex-1 min-w-0">
      <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-accent mb-0.5 truncate">{label}</p>
      <p className="text-[8px] lg:text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-tight line-clamp-1">{desc}</p>
    </div>
    <div className="flex items-center gap-2 lg:gap-4 bg-black/20 p-1.5 lg:p-2 rounded-xl border border-white/10 shrink-0">
      <input 
        type="text" 
        value={color} 
        onChange={e => onChange(e.target.value)}
        className="w-16 lg:w-20 bg-transparent text-[9px] lg:text-[10px] font-mono font-black text-gray-300 uppercase outline-none focus:text-white transition-colors"
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
  const navigate = useNavigate();
  const location = useLocation();

  const [brand, setBrand] = useState(() => {
    const defaultBrand = {
      logo: null, colors:['#c4973b','#000000','#ffffff'],
      fontStyle:'Inter', bodyFont:'Inter',
      headlineWeight: '900', bodyWeight: '400',
      visualStyle:'standard',
      website:'', igHandle:'', suggestedStyle:null,
      userName:'', objective:'vender',
      businessName:'', product:'', targetAudience:'', price:'', extraContext: '', salesLink:'',
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
      brand_images: [],
      onboardingComplete: false
    };
    try {
      const s = localStorage.getItem('sc_brand'); 
      if (s) {
        const saved = JSON.parse(s);
        const final = { ...defaultBrand, ...saved };
        if (final.colors) {
           final.colors = final.colors.map(c => sanitizeColor(c, '#c4973b'));
        }
        return final; 
      }
    } catch(e) {}
    return defaultBrand;
  });

  const [dashView, setDashView] = useState('home');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorTab, setColorTab] = useState('curadoria'); 
  const [fontTab, setFontTab] = useState('curadoria');
  const [fontCategory, setFontCategory] = useState('Todos');
  const [step, setStep] = useState(0); 

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

  const primaryColor = sanitizeColor(brand.colors?.[0], "#c4973b");

  const DashboardWrapper = () => (
    <Dashboard brand={brand} setBrand={setBrand} primaryColor={primaryColor} onEditBrandKit={() => navigate("/onboarding")} />
  );

  const isLoggedIn = !!brand.userName;
  const isSetup = !!brand.onboardingComplete;  

  return (
    <Routes>
      <Route path="/" element={
        isLoggedIn ? (
          isSetup ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
        ) : (
          <LandingPage onGetStarted={() => navigate("/login")} onLogin={() => navigate("/login")} />
        )
      } />
      
      <Route path="/login" element={
        isLoggedIn ? <Navigate to={isSetup ? "/dashboard" : "/onboarding"} replace /> :
        <SignupView brand={brand} setBrand={setBrand} onComplete={() => navigate("/onboarding")} onBack={() => navigate("/")} />
      } />
      
      <Route path="/onboarding" element={
        !isLoggedIn ? <Navigate to="/login" replace /> :
        isSetup ? <Navigate to="/dashboard" replace /> :
        <OnboardingWizard brand={brand} setBrand={setBrand} onComplete={() => navigate("/dashboard")} />
      } />
      
      <Route path="/dashboard/*" element={
        !isLoggedIn ? <Navigate to="/login" replace /> :
        !isSetup ? <Navigate to="/onboarding" replace /> :
        <Dashboard initialView="home" forceOnboarding={false} brand={brand} setBrand={setBrand} primaryColor={primaryColor} onEditBrandKit={() => navigate("/onboarding")} />
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
    { key: 'entrega',     icon: <Package size={15}/>,         label: 'Meus Downloads'         },
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
function Dashboard({ brand, setBrand, primaryColor, onEditBrandKit, initialView = 'home', forceOnboarding = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [dashView, setDashView]   = useState(initialView);
  const [globalAlert, setGlobalAlert] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
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
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  
  const [agenda, setAgenda]       = useState(JSON.parse(localStorage.getItem('postdna_agenda') || '[]'));
  const [approvedContent, setApprovedContent] = useState(JSON.parse(localStorage.getItem('postdna_approved') || '[]'));
  const [recentContent, setRecentContent] = useState(JSON.parse(localStorage.getItem('postdna_recent') || '[]'));
  const [notifications, setNotifications] = useState(brand.notifications || []);
  
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
  const [isCancellationFlowOpen, setIsCancellationFlowOpen] = useState(false);

  // ── NOTIFICAÇÕES LOGIC ──────────────────────────────────────────────────

  // ── NOTIFICAÇÕES LOGIC ──────────────────────────────────────────────────
  
  const addNotification = (type, title, body, action_url = null) => {
    // Check toggle preference
    const prefKey = type === 'content_ready' ? 'notify_ready' : type === 'credits_low' ? 'notify_credits' : 'notify_renewal';
    if (brand[prefKey] === false) return;

    const newNotif = {
      id: Date.now(),
      type,
      title,
      body,
      read: false,
      action_url,
      created_at: new Date().toISOString()
    };
    
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 20);
      setBrand(b => ({ ...b, notifications: updated }));
      return updated;
    });

    // Browser Push
    if (type === 'content_ready' && Notification.permission === 'granted') {
      new Notification("PostDNA — Conteúdo pronto", { body });
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      setBrand(b => ({ ...b, notifications: updated }));
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      setBrand(b => ({ ...b, notifications: updated }));
      return updated;
    });
  };

  // Check Credits for threshold notification
  useEffect(() => {
    const limit = PLAN_SPECS[plan]?.credits || 10;
    const threshold = limit * 0.2;
    if (totalCredits <= threshold && totalCredits > 0 && !brand.hasNotifiedCredits) {
      addNotification(
        'credits_low', 
        'Seus créditos estão acabando', 
        `Você tem ${totalCredits} créditos restantes este mês. Renova em ${resetDays} dias. Precisa de mais agora?`,
        'configuracoes#plano'
      );
      setBrand(b => ({ ...b, hasNotifiedCredits: true }));
    }
  }, [totalCredits, plan]);

  // Check Renewal reminder
  useEffect(() => {
    if (resetDays === 3 && !brand.hasNotifiedRenewal) {
      addNotification(
        'renewal_reminder',
        'Seu plano renova em 3 dias',
        `Em ${new Date().toLocaleDateString()}, seu plano ${PLAN_SPECS[plan]?.name} renova automaticamente Seus créditos também serão renovados.`,
        'configuracoes#plano'
      );
      setBrand(b => ({ ...b, hasNotifiedRenewal: true }));
    }
  }, [resetDays]);

  // Request Push Permission logically
  useEffect(() => {
    if (approvedContent.length > 0 && !brand.hasRequestedPush) {
      setShowPushBanner(true);
    }
  }, [approvedContent, brand.hasRequestedPush]);

  const requestPush = async () => {
    const permission = await Notification.requestPermission();
    setBrand(b => ({ ...b, hasRequestedPush: true }));
    setShowPushBanner(false);
  };

  const handleCancelAccount = (data) => {
    setBrand(p => ({
      ...p,
      cancellation_scheduled: true,
      cancellation_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      cancellation_reason: data.reason,
      cancellation_reason_text: data.reasonText
    }));
  };

  const handleDowngrade = (newPlan) => {
    setBrand(p => ({
      ...p,
      plan: newPlan,
      credit_limit: PLAN_SPECS[newPlan]?.credits || 10,
      billing_history: [
        { 
          id: Date.now(), 
          date: new Date().toLocaleDateString(), 
          amount: `R$ ${PLAN_SPECS[newPlan]?.price}`, 
          plan: PLAN_SPECS[newPlan]?.name, 
          status: 'Pago',
          type: 'Downgrade'
        },
        ...(p.billing_history || [])
      ]
    }));
    setIsCancellationFlowOpen(false);
    setDashView('configuracoes');
  };

  const handlePause = () => {
    setBrand(p => ({
      ...p,
      paused_until: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
    }));
    setIsCancellationFlowOpen(false);
    setDashView('configuracoes');
  };

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

    // NOVO: Check de Referências
    if ((brand.inspirations?.length || 0) === 0 && (brand.competitors?.length || 0) === 0) {
      setGlobalAlert({ 
          title: "Faltam Referências", 
          message: "Para um conteúdo de alta conversão, o Sherlock precisa de pelo menos uma referência (Inspiração ou Concorrente) na aba Referências.", 
          type: "warning", 
          onConfirm: () => { setGlobalAlert(null); setDashView('referencias'); } 
      });
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

    // 5. REVISOR & Conclusão (CHAMADA REAL PARA OPENAI)
    setTimeout(async () => {
      try {
        const objective = item?.objective || 'EDUCAR'; // Fallback se não definido
        
        // Chamada Assíncrona para o Squad de Agentes no OpenAI
        const realGeneratedContent = await generateContent(brand, topic, itemType, objective);

        setPipelineStage(-1);
        setGeneratingIdx(null);
        
        const finishedItem = { 
          ...(agenda[idx] || item), 
          ...realGeneratedContent, 
          status: 'Aguardando revisão' 
        };

        const newAgenda = agenda.map((a, i) => i === idx ? finishedItem : a);
        setAgenda(newAgenda);
        localStorage.setItem('postdna_agenda', JSON.stringify(newAgenda));
        
        addNotification(
          'content_ready', 
          'Seu conteúdo está pronto ✅', 
          `${itemType} sobre '${topic}' está pronto para revisão.`,
          '#'
        );

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
        setIsSherlockCached(false);
        setTimeout(() => {
          setIsTransitioning(false);
          setSelectedItem(finishedItem);
        }, 1500);

      } catch (err) {
        console.error("Erro no Pipeline:", err);
        setPipelineStage(-1);
        setGeneratingIdx(null);
        setGlobalAlert({
          title: "Erro na Geração",
          message: "O motor de IA falhou. Verifique sua chave da OpenAI ou tente novamente.",
          type: "error",
          onConfirm: () => setGlobalAlert(null)
        });
      }
    }, delays[3] + (isFirst ? 1000 : 500)); 
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
    const type = brand.selectedType || 'CARROSSEL';
    const cost = CREDIT_COSTS[type] || 10;

    if (totalCredits < cost) {
      setIsLimitModalOpen(true);
      return;
    }

    // Check de Referências
    if ((brand.inspirations?.length || 0) === 0 && (brand.competitors?.length || 0) === 0) {
      setGlobalAlert({ 
          title: "Sherlock Travado", 
          message: "O Sherlock precisa de referências para começar a investigar. Adicione pelo menos uma conta em Referências.", 
          type: "warning", 
          onConfirm: () => { setGlobalAlert(null); setDashView('referencias'); } 
      });
      return;
    }

    const topics = generateAITopics(brand);
    const newItem = {
      id: Date.now(),
      topic: topicHint || topics[0],
      type: type, 
      status: 'Gerando...',
      createdAt: new Date().toISOString(),
    };

    const newAgenda = [newItem, ...agenda];
    const newRecent = [{ ...newItem, createdAt: new Date().toISOString() }, ...recentContent].slice(0, 5);
    setRecentContent(newRecent);
    localStorage.setItem('postdna_recent', JSON.stringify(newRecent));

    setDashView('home');
    setAgenda(newAgenda);
    localStorage.setItem('postdna_agenda', JSON.stringify(newAgenda));
    setGeneratingIdx(0);
    setSelectedItem(newItem);
    runPipeline(0, approvedContent.length === 0, topicHint);
  };

  // Sidebar
  const Sidebar = () => {
    const isCollapsed = !isSidebarPinned && !isSidebarHovered;
    
    return (
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
  
        <aside 
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className={`fixed lg:static inset-y-0 left-0 glass border border-white/5 p-6 flex flex-col gap-5 shrink-0 z-[70] transform transition-all duration-500 ease-in-out lg:translate-x-0 my-2 ml-2 rounded-[40px] 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-2'}
            ${isCollapsed ? 'lg:w-[100px] items-center lg:px-4' : 'lg:w-72'}
          `}
        >
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg intel-gradient flex items-center justify-center shrink-0"><Zap size={16} className="text-black"/></div>
             {!isCollapsed && (
               <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-sm font-black uppercase tracking-tighter italic whitespace-nowrap">Post<span className="text-accent">DNA</span></motion.span>
             )}
          </div>
          
          {/* BOTÃO PIN */}
          {!isCollapsed && (
            <button 
               onClick={() => setIsSidebarPinned(!isSidebarPinned)}
               className={`hidden lg:flex w-6 h-6 rounded-full border items-center justify-center transition-all ${isSidebarPinned ? 'bg-accent border-[#c4973b] text-black' : 'bg-white/5 border-white/10 text-gray-300'}`}
            >
               <div className={`w-2 h-2 rounded-full ${isSidebarPinned ? 'bg-black' : 'bg-current'}`} />
            </button>
          )}
        </div>
  
        {/* Brand Kit mini */}
        {!isCollapsed ? (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white/5 border border-white/5 rounded-[18px] p-3 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain"/> : <Zap size={14} style={{color:primaryColor}}/>}
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-accent">Brand Kit</p>
                <p className="text-[10px] font-bold text-white truncate">{brand.businessName || brand.website || 'Minha marca'}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {brand.colors.slice(0,3).map((c,i)=><div key={i} className="flex-1 h-2 rounded-full" style={{backgroundColor:c}}/>)}
            </div>
          </motion.div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
             {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain p-2"/> : <Zap size={14} style={{color:primaryColor}}/>}
          </div>
        )}
  
        <nav className="flex-1 flex flex-col gap-6 mt-8">
          {NAV_ITEMS.map(section => (
            <div key={section.section}>
              {!isCollapsed && (
                <p className="text-[10px] label-mono text-accent/60 px-3 mb-3 font-black tracking-[0.2em]">{t(section.section)}</p>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map(item => (
                  <button key={item.key}
                    onClick={() => { setDashView(item.key); setIsSidebarOpen(false); }}
                    title={isCollapsed ? t(item.label) : ''}
                    className={`group flex items-center gap-4 p-3 rounded-lg text-[12px] font-bold tracking-tight transition-all relative ${
                      dashView === item.key
                        ? 'bg-white/5 text-accent border-r-2 border-accent'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.02]'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}>
                    <span className={dashView === item.key ? 'text-accent drop-shadow-[0_0_8px_rgba(0,191,198,0.4)]' : 'text-gray-400 group-hover:text-white'}>{item.icon}</span> 
                    {!isCollapsed && <span className="whitespace-nowrap font-sora">{t(item.label)}</span>}
                    
                    {dashView === item.key && (
                       <div className="absolute left-0 w-1 h-4 bg-accent rounded-full blur-[4px] opacity-50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Seletor de Idioma na Sidebar */}
        {!isCollapsed && (
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-2">
            {[
              { code: 'pt-BR', label: 'PT', flag: '🇧🇷' },
              { code: 'es', label: 'ES', flag: '🇪🇸' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setBrand(p => ({ ...p, interfaceLanguage: lang.code }));
                  i18n.changeLanguage(lang.code);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all ${
                  i18n.language === lang.code ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* PODER DO SQUAD (FASE 2.2) */}
        {!isCollapsed && (
          <div className="px-2 mb-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                   <Zap size={12} className="text-accent" />
                   <p className="text-[9px] font-black uppercase text-accent tracking-widest">Poder do Squad</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                   Operado por Sherlock e Designer Editorial.
                </p>
             </div>
          </div>
        )}

        <div className={`intel-gradient border border-white/10 rounded-[20px] relative overflow-hidden group transition-all shadow-[0_0_20px_rgba(0,191,198,0.1)] ${isCollapsed ? 'p-2' : 'p-4 space-y-3'}`}>
          {!isCollapsed ? (
            <>
              <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all"/>
              <div className="flex justify-between items-center relative z-10">
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white">{plan === 'completo' ? 'ESCALA' : plan.toUpperCase()}</p>
                 <span className="text-[10px] text-white font-black">{totalCredits} CR</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(totalCredits / (PLAN_SPECS[plan]?.credits || 1)) * 100}%` }}
                   className="h-full bg-accent" />
              </div>
              <div className="pt-4 mt-2 border-t border-white/5 flex flex-col items-center gap-1 opacity-20">
                 <span className="text-[7px] font-black uppercase tracking-widest text-[#0b0b0f]">Versão 28.03-V9</span>
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-accent">{totalCredits}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
             </div>
          )}
        </div>
      </aside>
      </>
    );
  };

  // ── PIPELINE OVERLAY: A EXPERIÊNCIA DO SQUAD (FASE 2.2) ──
  const PipelineOverlay = () => {
    if (!isGenerating && pipelineStage < 0) return null;
    
    return (
      <AnimatePresence>
        {pipelineStage >= 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div initial={{y:24,opacity:0}} animate={{y:0,opacity:1}}
              className="glass border border-white/10 rounded-[40px] p-10 w-full max-w-md mx-4 space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-[20px] bg-accent/10 border border-[#c4973b]/30 flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">PostDNA Em Ação</h3>
                
                <div className="mt-2 space-y-1">
                  <p className={`text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed ${pipelineSubtitle.length > 20 ? 'italic' : ''}`}>
                    {pipelineSubtitle}
                  </p>
                  <p className="text-[8px] text-accent font-black uppercase tracking-[0.2em] opacity-80">
                    {getEstimate()}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage, i) => {
                  const done    = i < pipelineStage;
                  const current = i === pipelineStage;
                  return (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-[16px] transition-all ${current ? 'bg-accent/10 border border-[#c4973b]/20' : 'opacity-40'}`}>
                      <span className="text-lg shrink-0">
                        {done ? '✅' : current ? <span className="inline-block animate-pulse">⏳</span> : '◻️'}
                      </span>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-accent">{stage.agent}</p>
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
                  className="w-20 h-20 rounded-[24px] bg-accent flex items-center justify-center mx-auto shadow-2xl shadow-[#c4973b]/20"
                >
                  <Zap size={40} className="text-black" />
                </motion.div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Seu conteúdo está pronto.</h2>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Preparando a visualização...</p>
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
      initialType={brand.selectedType}
      initialTopic={topicHint}
      onOpenItem={(item) => setSelectedItem(item)}
      onRefreshSuggestions={() => setIsSherlockConfirmOpen(true)}
      onRunPipeline={(data) => {
        const type = brand.selectedType || 'CARROSSEL';
        const cost = CREDIT_COSTS[type] || 10;

        if (totalCredits < cost) {
          setIsLimitModalOpen(true);
        } else {
          // Iniciar fluxo Sherlock
          handleCreateFirst(data.topic);
        }
      }}
    />
  );

  const Header = () => (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl lg:text-4xl font-extrabold font-sora text-white leading-tight uppercase tracking-tighter">
          {t('dashboard.welcomeActive')} <span className="text-accent">{firstName || 'System User'}</span>_
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="led-active animate-pulse shadow-[0_0_10px_#00BFC6]" />
            <span className="text-[9px] label-mono opacity-70 italic font-black uppercase">SISTEMA ONLINE</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[9px] label-mono text-accent/80 font-black">PLANO {PLAN_SPECS[plan]?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Sino de Notificações */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            className="w-10 h-10 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center transition-all hover:border-accent/50 text-gray-400 hover:text-white"
          >
            <Bell size={18} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-[#0b0b0f]">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {isNotificationPanelOpen && (
              <NotificationPanel 
                notifications={notifications} 
                onClose={() => setIsNotificationPanelOpen(false)}
                onRead={(id) => markNotificationAsRead(id)}
                onReadAll={markAllNotificationsAsRead}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
          <div className="text-right hidden lg:block">
            <div className="text-[10px] font-black font-sora text-white opacity-40 uppercase tracking-widest">{brand?.businessName || 'DNA_RECORDS'}</div>
            <div className="text-[9px] label-mono text-accent">{totalCredits} CR</div>
          </div>
          <button 
            onClick={() => setDashView('configuracoes')}
            className="w-10 h-10 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center transition-all hover:border-accent/50 cursor-pointer overflow-hidden"
          >
            {brand.logo ? <img src={brand.logo} className="w-full h-full object-cover opacity-80" /> : <Shield size={18} className="text-accent" />}
          </button>
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
            <p className="text-gray-300 text-sm font-bold uppercase tracking-widest leading-relaxed">Selecione o formato para iniciar sua estratégia consciente.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {contentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                   if (item.id === 'SUGGESTION') {
                      setIsSherlockConfirmOpen(true);
                      setSherlockSearchType('temas');
                   } else {
                      if (totalCredits < item.cost) {
                        setIsLimitModalOpen(true);
                        return;
                      }
                      handleCreateByType(item.id);
                   }
                }}
                className={`flex flex-col items-center justify-center p-6 glass-card rounded-xl aspect-square text-center relative overflow-hidden group border-white/5 bg-white/[0.01] hover:bg-accent/5 transition-all ${item.highlight ? 'border-accent/20' : ''}`}
              >
                <div className={`mb-3 transition-all duration-300 group-hover:scale-110 ${item.highlight ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}>
                   {React.cloneElement(item.icon, { size: 24, strokeWidth: item.highlight ? 2 : 1.5 })}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 leading-tight group-hover:text-white transition-colors font-sora">{t(item.label)}</p>
                  <p className="text-[8px] label-mono opacity-40">{item.cost} CR</p>
                </div>
                
                {item.highlight && (
                   <div className="absolute top-0 right-0 w-8 h-8 bg-accent/10 blur-xl pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Bloco 3: Ideias Salvas */}
        {brand.saved_suggestions?.length > 0 && (
          <section className="p-6 rounded-[32px] bg-gradient-to-r from-[#c4973b]/10 to-transparent border border-[#c4973b]/20 flex items-center justify-between group cursor-pointer hover:bg-accent/20 transition-all" onClick={() => setDashView('ideias')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center animate-pulse">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white leading-none">
                  {brand.saved_suggestions?.filter(s => s.status !== 'used' && s.status !== 'discarded').length} ideias do Sherlock aguardando →
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent/60 mt-1">
                  Clique para ver e transformar em conteúdo consciente
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </section>
        )}

        {/* Bloco 4: Criados recentemente */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <History size={16} className="text-gray-300"/>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">Criados recentemente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recent.length > 0 ? recent.map((c, i) => (
              <div key={i} 
                onClick={() => setSelectedItem(c)}
                className="group p-5 rounded-[24px] glass border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-gray-300">
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
                   <span className="text-[8px] font-bold text-gray-300 uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                   <span className="text-[8px] font-black uppercase text-accent group-hover:translate-x-1 transition-transform">Abrir →</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center glass border border-white/5 rounded-[32px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Nenhum conteúdo gerado ainda.</p>
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
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <Search size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Sherlock vai investigar seu mercado</h3>
            <p className="text-xs text-gray-300 font-bold leading-relaxed">
              Vou pesquisar tendências para <span className="text-white">{type}</span> no seu nicho e sugerir 3 temas com alto potencial agora.
            </p>
          </div>
          <div className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
             <div className="flex flex-col items-start gap-1">
                <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest">Custo da pesquisa</span>
                <span className="text-sm font-black text-accent">1 CRÉDITO</span>
             </div>
             <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest">Seu saldo</span>
                <span className="text-sm font-black text-white">{totalCredits} CR</span>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={onClose} className="py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition-colors border border-white/5">Cancelar</button>
            <button onClick={onConfirm} className="intel-gradient py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg">Confirmar →</button>
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
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-[#c4973b]/30 text-accent animate-bounce">
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
                className={`relative p-8 rounded-[40px] glass border transition-all flex flex-col justify-between group ${res.highlight ? 'border-accent/20 ring-1 ring-accent/20 shadow-2xl shadow-accent/5' : 'border-white/5'}`}
              >
                {res.highlight && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                     ⭐ Maior Potencial
                   </div>
                )}
                
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-white leading-tight">{res.title}</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-accent tracking-widest">
                        <TrendingUp size={10} /> Por que agora?
                      </div>
                      <p className="text-xs text-gray-300 font-bold leading-relaxed">{res.reasoning}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-300 tracking-widest">
                        <Target size={10} /> Seu Ângulo (DNA)
                      </div>
                      <p className="text-xs text-gray-300 font-bold leading-relaxed">{res.brand_angle}</p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                       <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest">Formato Sugerido</span>
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
                  className="mt-8 w-full py-4 rounded-2xl intel-gradient text-black font-black uppercase tracking-widest text-[10px] show-xl hover:scale-105 active:scale-95 transition-all"
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
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition-all"
              >
                Salvar todas para depois
              </button>
              <button 
                onClick={() => startSherlockResearch(sherlockSearchType)}
                className="px-8 py-4 rounded-2xl border border-[#c4973b]/20 bg-accent/5 text-accent hover:bg-accent/10 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Nova Sugestão (1 CR)
              </button>
            </div>
            <button onClick={() => setSherlockResults(null)} className="text-[10px] font-black uppercase text-gray-300 hover:text-white tracking-[0.3em]">Fechar Relatório</button>
          </footer>
        </section>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#060608] font-sans selection:bg-accent/30">
      {!forceOnboarding && Sidebar()}
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {forceOnboarding && (
          <div className="bg-accent/10 border-b border-accent/20 px-8 py-3 flex items-center justify-between text-accent z-20 relative">
             <div className="flex items-center gap-3">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Bem-vindo ao PostDNA. Por favor, conclua o setup da sua marca para continuar.</span>
             </div>
          </div>
        )}
        {/* Top Header */}
        <div className="p-8 lg:p-12 overflow-y-auto custom-scrollbar flex-1 relative z-10">
          {!forceOnboarding && Header()}

          <AnimatePresence mode="wait">
            <motion.div
              key={dashView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {dashView === 'home' && HomeView()}
              {dashView === 'criar' && CreateView()}
              {dashView === 'calendario' && CalendarView()}
              {dashView === 'vibe' && <IntelPage brand={brand} setBrand={setBrand} onRefreshSuggestions={refreshSuggestions} />}
              {dashView === 'referencias' && <RefsPage brand={brand} setBrand={setBrand} />}
              {dashView === 'dna' && <DNAPage brand={brand} setBrand={setBrand} onDone={() => {
                 setBrand(prev => ({ ...prev, onboardingComplete: true }));
                 navigate("/dashboard");
              }} />}
              {dashView === 'ideias' && <SavedIdeasPage brand={brand} setBrand={setBrand} onUseIdea={(idea) => { handleCreateByType(idea.suggested_format); setTopicHint(idea.title); }} />}
              {dashView === 'banco_imagens' && <ImageBankPage brand={brand} setBrand={setBrand} />}
              {dashView === 'entrega' && <DeliveryPage brand={brand} setBrand={setBrand} />}
              {dashView === 'configuracoes' && <SettingsPage brand={brand} setBrand={setBrand} onCancelAccount={() => setIsCancellationFlowOpen(true)} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {PipelineOverlay()}
      
      {isSherlockConfirmOpen && SherlockConfirmationModal({
          type: sherlockSearchType,
          onClose: () => setIsSherlockConfirmOpen(false),
          onConfirm: () => startSherlockResearch(sherlockSearchType)
      })}
      
      {sherlockResults && SherlockResultsView()}
      
      {selectedItem && (
        <ContentReviewModal 
          item={selectedItem} 
          brand={brand}
          onClose={() => setSelectedItem(null)} 
          onApprove={() => {
            const idx = agenda.findIndex(a => a.id === selectedItem.id);
            if (idx !== -1) handleApprove(idx);
            setSelectedItem(null);
          }}
        />
      )}

      {isLimitModalOpen && (
        <LimitModal 
          brand={brand} 
          isOpen={isLimitModalOpen} 
          onClose={() => setIsLimitModalOpen(false)} 
          onUpgrade={() => { setIsLimitModalOpen(false); setDashView('configuracoes'); }}
        />
      )}

      {isCancellationFlowOpen && (
        <CancellationFlow 
           isOpen={isCancellationFlowOpen} 
           onClose={() => setIsCancellationFlowOpen(false)}
           onConfirm={handleCancelAccount}
           onDowngrade={handleDowngrade}
           onPause={handlePause}
           brand={brand}
        />
      )}
      
      {isDNAIncomplete && (
         <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right duration-500">
            <div className="glass border border-accent/20 p-6 rounded-[32px] shadow-2xl space-y-4 max-w-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent"><Fingerprint size={20}/></div>
                  <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">DNA Incompleto</h4>
               </div>
               <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">Seu Sherlock precisa de mais dados para ser preciso. Complete seu Brand Kit.</p>
               <button onClick={() => { setIsDNAIncomplete(false); setDashView('dna'); }} className="w-full py-3 bg-accent text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:scale-105 transition-all">Completar Agora</button>
            </div>
         </div>
      )}
      
      {globalAlert && (
          <CustomAlert isOpen={true} {...globalAlert} onConfirm={globalAlert.onConfirm || (() => setGlobalAlert(null))} />
      )}
    </div>
  );
}

// ─── UTILS E CONTEÚDOS ESTATICOS ──────────────────────────────────────────
