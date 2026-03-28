import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Check, Upload, Palette, Type, ChevronRight, Globe, Zap,
  RefreshCw, Save, AlertTriangle, Sparkles, ImageIcon, User, X
} from 'lucide-react';
import { extractDNA } from './dnaUtils';

// ─── VOICE SLIDER ──────────────────────────────────────────────────────────────
const VoiceSlider = ({ label, leftLabel, rightLabel, leftEx, rightEx, value, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-600">
      <span>{leftLabel}</span><span>{label}</span><span>{rightLabel}</span>
    </div>
    <div className="flex gap-3 text-[10px] text-gray-600">
      <div className={`flex-1 p-3 rounded-xl border transition-all ${value <= 2 ? 'border-[#c4973b]/40 bg-[#c4973b]/5' : 'border-white/5 bg-white/5'} italic`}>
        {leftEx}
      </div>
      <div className={`flex-1 p-3 rounded-xl border transition-all text-right ${value >= 4 ? 'border-[#c4973b]/40 bg-[#c4973b]/5' : 'border-white/5 bg-white/5'} italic`}>
        {rightEx}
      </div>
    </div>
    <input type="range" min="1" max="5" step="1" value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full cursor-pointer" style={{ accentColor: '#c4973b' }} />
    <div className="flex justify-between">
      {[1,2,3,4,5].map(n => (
        <div key={n} className={`w-2 h-2 rounded-full transition-all ${n <= value ? 'bg-[#c4973b]' : 'bg-white/10'}`} />
      ))}
    </div>
  </div>
);

// ─── SECTION WRAPPER ───────────────────────────────────────────────────────────
const Section = ({ title, icon, children, onSave, saveLabel, saving }) => (
  <div className="glass border border-white/5 rounded-[28px] p-7 space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#c4973b]/10 border border-[#c4973b]/20 flex items-center justify-center text-[#c4973b]">
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">{title}</h3>
    </div>
    {children}
    {onSave && (
      <button onClick={onSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#c4973b]/40 transition-all">
        <Save size={13}/> {saving ? '...' : saveLabel}
      </button>
    )}
  </div>
);

// ─── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#c4973b] text-black px-6 py-3 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-2"
      >
        <Check size={14}/> {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── MAIN DNA PAGE ──────────────────────────────────────────────────────────────
export default function DNAPage({ brand, setBrand, approvedCount = 0 }) {
  const { t, i18n } = useTranslation();
  const [local, setLocal]   = useState({ ...brand });
  const [toast, setToast]   = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [logoProposal, setLogoProposal] = useState(null); // { logo, colors, style }
  const fileRef = useRef();

  const STYLE_VIBES = [
    { key: 'minimalist', label: t('dnaPage.vibes.minimalist'),  desc: t('dnaPage.vibes.minimalistDesc')   },
    { key: 'vibrant',    label: t('dnaPage.vibes.vibrant'),      desc: t('dnaPage.vibes.vibrantDesc')       },
    { key: 'corporate',  label: t('dnaPage.vibes.corporate'),   desc: t('dnaPage.vibes.corporateDesc')     },
    { key: 'warm',       label: t('dnaPage.vibes.warm'),        desc: t('dnaPage.vibes.warmDesc')        },
  ];

  const FONT_OPTIONS = [
    { key: 'bold',    name: t('dnaPage.fonts.bold'),   css: 'font-black',   sample: t('onboarding.step1.fontPreview') },
    { key: 'elegant', name: t('dnaPage.fonts.elegant'),  css: 'font-bold',    sample: t('onboarding.step1.fontPreview') },
    { key: 'modern',  name: t('dnaPage.fonts.modern'),   css: 'font-semibold',sample: t('onboarding.step1.fontPreview')    },
    { key: 'rounded', name: t('dnaPage.fonts.rounded'),  css: 'font-black',   sample: t('onboarding.step1.fontPreview')   },
    { key: 'mono',    name: t('dnaPage.fonts.mono'),     css: 'font-medium',  sample: t('onboarding.step1.fontPreview')      },
    { key: 'thin',    name: t('dnaPage.fonts.thin'),     css: 'font-light',   sample: t('onboarding.step1.fontPreview')   },
  ];

  const showMsg = (msg) => {
    setToast(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const save = () => {
    setBrand(prev => ({ ...prev, ...local }));
    showMsg(t('common.saved'));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const dna = extractDNA(img);
        setLogoProposal({ logo: ev.target.result, colors: dna.colors, style: dna.style });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const hasChanges = approvedCount > 0 &&
    (local.colors?.[0] !== brand.colors?.[0] || local.fontStyle !== brand.fontStyle);

  // ── LIVE PREVIEW ──
  const LivePreview = () => {
    const primary = local.colors?.[0] || '#c4973b';
    const bg      = local.colors?.[1] || '#000000';
    const name    = local.businessName || brand.businessName || 'PostDNA';
    const handle  = local.igHandle || brand.igHandle || '@suamarca';
    const logo    = local.logo || brand.logo;
    return (
      <div className="sticky top-8 space-y-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 text-center flex items-center gap-2 justify-center">
          <Sparkles size={10} className="text-[#c4973b]"/> LIVE PREVIEW
        </p>
        <motion.div layout
          className="w-[200px] mx-auto aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col relative"
          style={{ background: `linear-gradient(145deg, ${bg}, ${primary}22)` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: primary }}/>
          <div className="flex items-center justify-between p-4 z-10">
            <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
              {logo
                ? <img src={logo} className="w-full h-full object-contain"/>
                : <span className="text-[10px] font-black text-white">{name.substring(0,2).toUpperCase()}</span>
              }
            </div>
            <div className="px-2 py-0.5 rounded-full bg-white/10 text-[7px] font-black uppercase tracking-widest opacity-60">01</div>
          </div>
          <div className="flex-1 flex flex-col justify-end p-4 z-10 space-y-2">
            <div className="self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest" style={{ background: primary, color: '#000' }}>
              {name.split(' ')[0].toUpperCase()}
            </div>
            <h3 className={`text-lg uppercase tracking-tight leading-tight text-white italic ${FONT_OPTIONS.find(f=>f.key===local.fontStyle)?.css || 'font-black'}`}>
              DNA<br/><span style={{ color: primary }}>IDENTIFIED.</span>
            </h3>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">PostDNA AI Agent</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[8px] font-black uppercase text-gray-500">{handle}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: primary }}>
                <ChevronRight size={10} className="text-black"/>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="bg-white/3 border border-white/5 rounded-[16px] p-3 space-y-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.colors')}</p>
          <div className="flex gap-1">
            {(local.colors || brand.colors || []).slice(0,3).map((c,i) => (
              <div key={i} className="flex-1 rounded-lg overflow-hidden">
                <div className="h-6 w-full" style={{ background: c }}/>
                <p className="text-[7px] font-mono text-gray-700 text-center mt-0.5">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Toast message={toast} visible={showToast}/>

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
          {t('dnaPage.title')}
        </h2>
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
          {t('dnaPage.subtitle')}
        </p>
      </div>

      {/* Warning if has approved content */}
      {hasChanges && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-[18px] p-4 mb-6 text-sm">
          <AlertTriangle size={16} className="text-orange-400 shrink-0"/>
          <p className="text-orange-300 font-bold text-xs">
            {t('dnaPage.approvedWarning', { count: approvedCount })}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-8 items-start">

        {/* LEFT — Sections */}
        <div className="space-y-6">

          {/* 1. Identidade Visual */}
          <Section title={t('dnaPage.sections.visual')} icon={<Palette size={16}/>} onSave={save} saveLabel={t('common.save')}>

            {/* Logo */}
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.logo')}</p>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {local.logo
                    ? <img src={local.logo} className="w-full h-full object-contain"/>
                    : <div className="text-center">
                        <p className="text-2xl font-black text-white" style={{ color: local.colors?.[0] }}>
                          {(local.businessName || 'P').substring(0,1).toUpperCase()}
                        </p>
                        <p className="text-[7px] text-gray-600 uppercase">DNA</p>
                      </div>
                  }
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-[#c4973b]/40 transition-all">
                    <Upload size={12}/> {local.logo ? t('dnaPage.actions.uploadLogo') : t('dnaPage.actions.addLogo')}
                  </button>
                  {local.logo && (
                    <button onClick={() => setLocal(p => ({ ...p, logo: null }))}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-red-400 transition-colors text-left">
                      {t('dnaPage.actions.removeLogo')}
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.colors')}</p>
              <div className="flex gap-5">
                {[
                  { label: t('onboarding.step1.primary'), idx: 0 },
                  { label: t('onboarding.step1.base'),     idx: 1 },
                  { label: t('onboarding.step1.text'),    idx: 2 },
                ].map(({ label, idx }) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="relative group cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl border-2 border-white/10 hover:border-[#c4973b]/50 transition-all"
                        style={{ background: local.colors?.[idx] || '#888' }}/>
                      <input type="color" value={local.colors?.[idx] || '#888888'}
                        onChange={e => {
                          const nc = [...(local.colors || [])];
                          nc[idx] = e.target.value;
                          setLocal(p => ({ ...p, colors: nc }));
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-2xl"/>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-white transition-all rounded-2xl pointer-events-none">
                        {t('common.edit')}
                      </div>
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</p>
                    <p className="text-[8px] font-mono text-gray-700">{(local.colors?.[idx] || '').toUpperCase()}</p>
                  </div>
                ))}
              </div>
              {brand.website && (
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-[#c4973b] transition-colors">
                  <RefreshCw size={11}/> {t('dnaPage.actions.reExtract')} ({brand.website})
                </button>
              )}
            </div>

            {/* Font */}
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.typography')}</p>
              <div className="bg-white/5 border border-white/5 rounded-[18px] p-4 flex items-center justify-between">
                <p className={`text-lg text-white ${FONT_OPTIONS.find(f=>f.key===local.fontStyle)?.css || 'font-black'}`}>
                  {FONT_OPTIONS.find(f=>f.key===local.fontStyle)?.sample || 'Seu produto. Sua marca.'}
                </p>
                <button onClick={() => setShowFontPicker(v => !v)}
                  className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-[#c4973b] transition-colors whitespace-nowrap ml-4">
                  {t('dnaPage.actions.chooseFont')}
                </button>
              </div>
              {showFontPicker && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FONT_OPTIONS.map(f => (
                    <button key={f.key}
                      onClick={() => { setLocal(p => ({ ...p, fontStyle: f.key })); setShowFontPicker(false); }}
                      className={`p-4 rounded-[16px] border text-left transition-all ${local.fontStyle === f.key ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/5 hover:border-white/15'}`}>
                      <p className={`text-sm text-white ${f.css} mb-1`}>{f.sample}</p>
                      <p className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">{f.name}</p>
                      {local.fontStyle === f.key && <Check size={12} className="absolute top-3 right-3 text-[#c4973b]"/>}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </Section>

          {/* 2. Estilo de Conteúdo */}
          <Section title={t('dnaPage.sections.style')} icon={<ImageIcon size={16}/>} onSave={save} saveLabel={t('common.save')}>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 -mt-2">
              {t('dnaPage.fields.vibe')}: <span className="text-[#c4973b]">{STYLE_VIBES.find(s=>s.key===local.visualStyle)?.label || 'Vibrante'}</span>
            </p>
            {!showStylePicker ? (
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-[18px] p-4">
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tight text-white">
                    {STYLE_VIBES.find(s=>s.key===local.visualStyle)?.label || 'Vibrante'}
                  </p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    {STYLE_VIBES.find(s=>s.key===local.visualStyle)?.desc}
                  </p>
                </div>
                <button onClick={() => setShowStylePicker(true)}
                  className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-[#c4973b] transition-colors whitespace-nowrap">
                  {t('dnaPage.actions.chooseStyle')}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-3">
                {STYLE_VIBES.map(v => (
                  <button key={v.key}
                    onClick={() => { setLocal(p => ({ ...p, visualStyle: v.key })); setShowStylePicker(false); }}
                    className={`p-5 rounded-[20px] border-2 text-left transition-all relative ${local.visualStyle === v.key ? 'border-[#c4973b] bg-[#c4973b]/5' : 'border-white/5 bg-white/5 hover:border-white/15'}`}>
                    {local.visualStyle === v.key && <Check size={14} className="absolute top-3 right-3 text-[#c4973b]"/>}
                    <h4 className="font-black text-sm uppercase tracking-tight mb-1">{v.label}</h4>
                    <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">{v.desc}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </Section>

          {/* 3. Tom de Voz */}
          <Section title={t('dnaPage.sections.voice')} icon={<Type size={16}/>} onSave={save} saveLabel={t('common.save')}>
            <div className="space-y-8">
              <VoiceSlider label={t('onboarding.step5.formality')} leftLabel={t('onboarding.step5.formalityLow')} rightLabel={t('onboarding.step5.formalityHigh')}
                leftEx={t('onboarding.step5.formalityLowEx')} rightEx={t('onboarding.step5.formalityHighEx')}
                value={local.voice?.formality || 3}
                onChange={v => setLocal(p => ({ ...p, voice: { ...p.voice, formality: v } }))} />
              <VoiceSlider label={t('onboarding.step5.depth')} leftLabel={t('onboarding.step5.depthLow')} rightLabel={t('onboarding.step5.depthHigh')}
                leftEx={t('onboarding.step5.depthLowEx')} rightEx={t('onboarding.step5.depthHighEx')}
                value={local.voice?.depth || 3}
                onChange={v => setLocal(p => ({ ...p, voice: { ...p.voice, depth: v } }))} />
              <VoiceSlider label={t('onboarding.step5.energy')} leftLabel={t('onboarding.step5.energyLow')} rightLabel={t('onboarding.step5.energyHigh')}
                leftEx={t('onboarding.step5.energyLowEx')} rightEx={t('onboarding.step5.energyHighEx')}
                value={local.voice?.energy || 3}
                onChange={v => setLocal(p => ({ ...p, voice: { ...p.voice, energy: v } }))} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">{t('dnaPage.fields.forbiddenWords')}</p>
                <input type="text" placeholder="..."
                  defaultValue={local.voice?.forbiddenWords || ''}
                  onBlur={e => setLocal(p => ({ ...p, voice: { ...p.voice, forbiddenWords: e.target.value } }))}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-[14px] px-4 text-sm font-bold outline-none focus:border-[#c4973b]/60 transition-all placeholder:text-gray-700"/>
              </div>
            </div>
          </Section>

          {/* 4. Informações do Negócio */}
          <Section title={t('dnaPage.sections.business')} icon={<Zap size={16}/>} onSave={save} saveLabel={t('common.save')}>
            <div className="space-y-3">
              {[
                { key: 'businessName',   label: t('onboarding.step3.businessLabel'),   ph: t('onboarding.step3.businessPh')              },
                { key: 'product',        label: t('onboarding.step3.productLabel'),    ph: t('onboarding.step3.productPh') },
                { key: 'targetAudience', label: t('onboarding.step6.audienceLabel'),   ph: t('onboarding.step6.audiencePh')  },
                { key: 'price',          label: t('onboarding.step3.priceLabel'),      ph: t('onboarding.step3.pricePh')                   },
                { key: 'salesLink',      label: t('onboarding.step2.siteLabel'),       ph: t('onboarding.step2.sitePh')           },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1 pl-1">{label}</label>
                  <input type="text" placeholder={ph} defaultValue={local[key] || ''}
                    onBlur={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-[14px] px-4 text-sm font-bold outline-none focus:border-[#c4973b]/60 transition-all placeholder:text-gray-700"/>
                </div>
              ))}
            </div>
          </Section>

          {/* 5. Sobre o Público */}
          <Section title={t('dnaPage.sections.public')} icon={<User size={16}/>} onSave={save} saveLabel={t('common.save')}>
            <div className="space-y-4">
              {[
                { key: 'description',      label: t('onboarding.step6.audienceLabel'), ph: t('onboarding.step6.audiencePh') },
                { key: 'mainPain',         label: t('onboarding.step6.painLabel'),     ph: t('onboarding.step6.painPh')                       },
                { key: 'previousAttempts', label: t('onboarding.step6.attemptsLabel'), ph: t('onboarding.step6.attemptsPh')              },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1 pl-1">{label}</label>
                  <textarea rows={2} placeholder={ph} defaultValue={local.persona?.[key] || ''}
                    onBlur={e => setLocal(p => ({ ...p, persona: { ...p.persona, [key]: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-[14px] px-4 py-3 text-sm font-bold outline-none focus:border-[#c4973b]/60 transition-all placeholder:text-gray-700 resize-none"/>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Conexão Instagram */}
          <Section title="Conexão Instagram" icon={<Globe size={16}/>}>
             <div className="space-y-4">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                   Conecte sua conta profissional para que o Sherlock analise seus melhores posts e automatize o agendamento.
                </p>
                
                {!brand.isInstagramConnected ? (
                  <button 
                    onClick={() => {
                        // Mock connection for now
                        setBrand(prev => ({ 
                           ...prev, 
                           isInstagramConnected: true,
                           instagramInfo: {
                              handle: brand.igHandle || '@seu.insta',
                              followers: '1.2k',
                              profilePic: null
                           }
                        }));
                        showMsg("Instagram Conectado!");
                    }}
                    className="flex items-center gap-3 px-6 py-4 rounded-[20px] bg-[#c4973b]/10 border border-[#c4973b]/20 hover:bg-[#c4973b]/20 transition-all w-full md:w-auto"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#c4973b] flex items-center justify-center text-black">
                       <Zap size={16} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">Conectar Instagram Business</p>
                       <p className="text-[9px] text-[#c4973b] font-bold uppercase tracking-widest">Ativar Sherlock Reports</p>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-5 rounded-[22px] bg-white/5 border border-[#c4973b]/30">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-0.5">
                           <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                              <User size={20} className="text-gray-600" />
                           </div>
                        </div>
                        <div>
                           <p className="text-sm font-black uppercase italic tracking-tighter text-white">{brand.instagramInfo?.handle || '@connected'}</p>
                           <p className="text-[9px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                              <Check size={10} /> Conta Conectada
                           </p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setBrand(prev => ({ ...prev, isInstagramConnected: false }))}
                       className="text-[9px] font-black text-gray-700 hover:text-red-500 uppercase tracking-widest p-2"
                     >
                        Desconectar
                     </button>
                  </div>
                )}
             </div>
          </Section>

          {/* 7. Idioma */}
          <Section title={t('dnaPage.sections.language')} icon={<Globe size={16}/>} onSave={save} saveLabel={t('common.save')}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.interfaceLang')}</p>
                  <div className="flex gap-2">
                    {['pt-BR', 'es'].map(lang => (
                      <button key={lang}
                        onClick={() => {
                          setLocal(p => ({ ...p, interfaceLanguage: lang }));
                          i18n.changeLanguage(lang);
                        }}
                        className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${local.interfaceLanguage === lang ? 'border-[#c4973b] bg-[#c4973b]/10 text-white' : 'border-white/5 bg-white/5 text-gray-500'}`}>
                        {lang === 'pt-BR' ? 'Português' : 'Español'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{t('dnaPage.fields.contentLang')}</p>
                  <div className="flex gap-2">
                    {['pt-BR', 'es'].map(lang => (
                      <button key={lang}
                        onClick={() => setLocal(p => ({ ...p, contentLanguage: lang }))}
                        className={`flex-1 py-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${local.contentLanguage === lang ? 'border-[#c4973b] bg-[#c4973b]/10 text-white' : 'border-white/5 bg-white/5 text-gray-500'}`}>
                        {lang === 'pt-BR' ? 'PT-BR' : 'ES-LATAM'}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          </Section>

          {/* 8. Reset de Dados (Pânico) */}
          <Section title="Manutenção do Squad" icon={<RefreshCw size={16}/>}>
             <div className="space-y-4">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                   Use estas opções apenas em caso de erros persistentes ou se desejar recomeçar sua estratégia do zero.
                </p>
                <div className="flex flex-wrap gap-4">
                   <button 
                     onClick={() => {
                        if(confirm("Isso apagará seu histórico de conteúdos e DNA local. Deseja continuar?")) {
                           localStorage.clear();
                           window.location.reload();
                        }
                     }}
                     className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl"
                   >
                      Resetar Todo o App
                   </button>
                </div>
             </div>
          </Section>

          {/* Global save */}
          <button onClick={save}
            className="w-full gold-gradient text-black py-4 rounded-[20px] font-black uppercase tracking-widest text-sm hover:scale-[1.01] transition-transform shadow-xl flex items-center justify-center gap-3">
            <Save size={18}/> {t('dnaPage.actions.saveAll')}
          </button>
        </div>

        {/* RIGHT — Live Preview (sticky) */}
        <LivePreview />
      </div>

      {/* ── LOGO PROPOSAL MODAL ── */}
      <AnimatePresence>
        {logoProposal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
             <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
               className="glass border border-white/10 rounded-[40px] p-10 max-w-md w-full text-center space-y-8 shadow-[0_0_100px_rgba(196,151,59,0.15)]">
                <div className="space-y-3">
                   <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 p-3 mx-auto flex items-center justify-center overflow-hidden">
                      <img src={logoProposal.logo} className="w-full h-full object-contain" />
                   </div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">DNA Capturado!</h3>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                      O Sherlock identificou novas cores e estilo nesta logo. Deseja manter sua paleta atual ou atualizar para o novo DNA?
                   </p>
                </div>

                <div className="flex gap-2 justify-center">
                   {logoProposal.colors.map((c,i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white/10 shadow-xl" style={{backgroundColor:c}} />
                   ))}
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={() => {
                        setLocal(p => ({ ...p, logo: logoProposal.logo, colors: logoProposal.colors, suggestedStyle: logoProposal.style }));
                        setLogoProposal(null);
                        showMsg("DNA Atualizado!");
                     }}
                     className="w-full gold-gradient text-black py-5 rounded-[22px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl">
                      <Check size={16}/> ADOTAR NOVO DNA (Recomendado)
                   </button>
                   <button 
                     onClick={() => {
                        setLocal(p => ({ ...p, logo: logoProposal.logo }));
                        setLogoProposal(null);
                        showMsg("Logo adicionada!");
                     }}
                     className="w-full py-4 rounded-[22px] bg-white/5 border border-white/10 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                      MANTÊR MINHA PALETA ATUAL
                   </button>
                </div>
                
                <button 
                  onClick={() => setLogoProposal(null)}
                  className="text-[9px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">
                  CANCELAR
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
