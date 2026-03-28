import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Sparkles, Layers, Camera, Globe, X, ExternalLink, Clock, CheckCircle2
} from 'lucide-react';

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

  // Filtrar apenas aprovados para este mês/ano
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

  if ((approvedContent || []).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in fade-in duration-700">
        <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center relative group">
           <div className="absolute inset-0 bg-[#c4973b]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
           <CalendarIcon size={40} className="text-gray-700 relative z-10" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-widest text-gray-400">Seu calendário está esperando</p>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
            Quando você aprovar um post, ele aparecerá aqui como um registro histórico da sua marca.
          </p>
        </div>
        <button onClick={() => setDashView('criar')}
          className="gold-gradient text-black px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.05] transition-transform shadow-xl">
          <Sparkles size={14} /> + Criar primeiro conteúdo
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full relative overflow-hidden">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-10">
        {/* Top Header & Stats */}
        <div className="flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-30 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={18} className="text-gray-600"/></button>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter capitalize min-w-[140px] text-center">{monthName}</h3>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={18} className="text-gray-600"/></button>
            </div>
            
            {stats.total > 0 && (
              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                   <strong className="text-[#c4973b]">{stats.total}</strong> APROVADOS
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                   <strong className="text-green-500">{stats.published}</strong> PUBLICADOS
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                   <strong className="text-blue-400">{stats.scheduled}</strong> AGENDADOS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
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
                } ${dayContent ? 'bg-white/5 border-white/10' : ''} ${isSelected ? 'border-[#c4973b]/60 bg-[#c4973b]/10' : ''}`}>
                
                {d && <span className={`text-xs font-black ${dayContent ? 'text-[#c4973b]' : 'text-gray-800'}`}>{d}</span>}
                
                <div className="flex flex-col gap-1 w-full mt-auto">
                  {dayContent?.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                      <div className="text-[#c4973b] opacity-60">{getTypeIcon(c?.type)}</div>
                      <div className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-[#c4973b] w-full" />
                      </div>
                    </div>
                  ))}
                  {(dayContent?.length > 3) && (
                    <p className="text-[7px] font-black text-gray-600 text-center">+{dayContent.length - 3} MAIS</p>
                  )}
                </div>

                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#c4973b] shadow-[0_0_8px_#c4973b]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedDay && contentByDay[selectedDay] && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 glass border-l border-white/10 p-6 flex flex-col gap-6 overflow-y-auto sticky top-0 h-[calc(100vh-140px)] z-40"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase italic tracking-tighter">Conteúdo do Dia {selectedDay}</h4>
              <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-600"><X size={16}/></button>
            </div>

            <div className="space-y-6">
              {contentByDay[selectedDay].map((item, idx) => (
                <div key={idx} className="space-y-4 pb-6 border-b border-white/5 last:border-0">
                   {/* Design Preview Mockup */}
                   <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 bg-white/5 relative group cursor-pointer"
                        style={{ background: `linear-gradient(145deg, ${brand?.colors?.[1] || '#000000'}, ${brand?.colors?.[0] || '#c4973b'}22)` }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                         <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-4 overflow-hidden">
                            {brand?.logo ? <img src={brand.logo} className="w-full h-full object-contain" /> : <p className="font-black text-xs">{(brand?.businessName || 'P').substring(0,1)}</p>}
                         </div>
                         <h5 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{item?.topic || 'Untitled'}</h5>
                         <p className="text-[7px] text-gray-500 font-bold uppercase tracking-[0.2em]">{item?.type || 'Post'}</p>
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
                         <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{item?.approvedAt ? new Date(item.approvedAt).toLocaleTimeString([], {hour: '2d-digit', minute:'2d-digit'}) : '--:--'}</p>
                      </div>
                      <p className="text-xs font-black uppercase italic tracking-tighter text-white">{item?.topic || 'Untitled'}</p>
                      <p className="text-[10px] text-gray-500 font-bold leading-relaxed line-clamp-3 italic">"{item?.caption || 'Sem legenda disponível...'}"</p>
                      
                      <button 
                        onClick={() => onOpenDetails?.(item)}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#c4973b]/40 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
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

export default CalendarPage;
