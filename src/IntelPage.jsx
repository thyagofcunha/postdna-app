import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search, TrendingUp, Zap, Clock, RefreshCw, Plus,
  BarChart2, MessageSquare, Target, Eye,
  ChevronRight, Sparkles, Heart, Share2, Check
} from 'lucide-react';

// ─── MARKET INTELLIGENCE GENERATOR ──────────────────────────────────────────
function getMarketIntelligence(brand, t) {
  const src = ((brand.product || '') + ' ' + (brand.targetAudience || '')).toLowerCase();

  // Nicho: Esportes / Futebol
  if (/futebol|esport|jogo|atleta|treino/.test(src)) return {
    niche: t('intelPage.niches.sports'),
    topics: [
      { title: 'A ascensão do treino por dados no futebol amador',      reason: 'Conteúdos sobre tecnologia e performance cresceram 68% no nicho em março',  trend: '+68%' },
      { title: 'Erros de treino que destroem o joelho antes dos 40',    reason: 'Lesões e prevenção são o tema de maior engajamento em perfis de treinadores', trend: '+41%' },
      { title: 'Como jogar melhor sem treinar mais — método e não volume', reason: 'Conteúdos contra-intuitivos geram 3x mais compartilhamentos no nicho',      trend: '+3x saves' },
      { title: 'Antes/Depois: de jogador lento a referência do time',    reason: 'Provas sociais visuais têm 2.8x mais alcance que posts teóricos',             trend: '+2.8x alcance' },
      { title: 'Preparação física para o jogo de fim de semana',        reason: 'Conteúdo prático e imediato tem taxa de salvamentos 45% maior no segmento',          trend: '+45% salvamentos' },
    ],
    patterns: {
      format:   { label: 'Carrossel (6-8 slides)', detail: 'Formato favorito do nicho — mantém atenção na sequência de dicas táticas', icon: '📊' },
      hook:     { label: 'Dado-choque de abertura', detail: '"90% dos jogadores amadores cometem esse erro" — padrão mais replicado',    icon: '⚡' },
      tone:     { label: 'Intenso + Prático',       detail: 'Tom motivacional com aplicação imediata funciona melhor que só teoria',     icon: '🎯' },
      bestTime: { label: 'Quinta e Sexta, 18h-21h', detail: 'Pico de atenção pré-fim de semana — jogadores pensando no jogo',            icon: '🕕' },
    },
  };

  // Nicho: Beleza / Estética
  if (/beleza|cabelo|estética|pele|salão|unhas/.test(src)) return {
    niche: t('intelPage.niches.beauty'),
    topics: [
      { title: 'Antes e depois com transparência de processo',         reason: 'Documentar o "como" aumentou o alcance médio em 82% no nicho em março', trend: '+82%' },
      { title: 'Mitos e verdades sobre o cabelo que viralizam',        reason: 'Formato de desmistificação tem o maior compartilhamento do segmento',   trend: '+3x shares' },
      { title: 'Por que o resultado dura mais com profissional',       reason: 'Argumento de autoridade reduz objeções e aumenta conversão 38%',       trend: '+38% conv.' },
      { title: 'Rotina de manutenção em casa (pós-atendimento)',       reason: 'Conteúdo de cuidado contínuo fideliza mais do que qualquer promoção',  trend: 'top salvamentos' },
      { title: 'Resultados reais de clientes (sem filtro excessivo)', reason: 'Autenticidade venceu perfeição — alcance 2.2x maior para conteúdo real', trend: '+2.2x' },
    ],
    patterns: {
      format:   { label: 'Estático + Carrossel',     detail: 'Antes/depois como estático, processo detalhado como carrossel', icon: '📸' },
      hook:     { label: 'Transformação visual',      detail: 'Resultado no primeiro slide antes da explicação — gera clique',  icon: '✨' },
      tone:     { label: 'Empático + Empoderador',    detail: 'Falar com a cliente como mulher para mulher tem 2x engajamento', icon: '💬' },
      bestTime: { label: 'Segunda e Sábado, 9h-11h',  detail: 'Pico de busca por profissional de beleza nesse horário',        icon: '🕘' },
    },
  };

  // Nicho: Saúde / Nutrição
  if (/saúde|nutri|academia|dieta|bem.estar/.test(src)) return {
    niche: t('intelPage.niches.health'),
    topics: [
      { title: 'Alimentação real vs. dieta milagre — comparativo honesto', reason: 'Desconstrução de mitos é formato com maior taxa de save no nicho', trend: '+75% saves' },
      { title: 'O papel do cortisol no ganho de peso — sem complicar',     reason: 'Ciência acessível cresce 55% em alcance frente a posts motivacionais', trend: '+55%' },
      { title: 'Por que você para a dieta no final de semana',             reason: 'Comportamento real da audiência como tema — alto compartilhamento',    trend: '+60% compartilhamentos' },
      { title: 'Rotina de 10 minutos que substitui 1h de academia',       reason: 'Praticidade extrema tem 3x engajamento no público de 25-40 anos',      trend: '+3x engaj.' },
      { title: 'O que profissionais de saúde comem no dia a dia',         reason: 'Bastidores de especialistas geram identificação e autoridade',         trend: 'top retenção' },
    ],
    patterns: {
      format:   { label: 'Carrossel educativo (7-10 slides)', detail: 'Profundidade em saúde exige espaço — carrossels ficam mais tempo na tela', icon: '📚' },
      hook:     { label: 'Pergunta-problema pessoal',         detail: '"Você já sentiu que faz tudo certo mas não emagrece?" — cria identificação', icon: '🤔' },
      tone:     { label: 'Científico + Acessível',            detail: 'Autoridade com linguagem popular — sem jargão, com referência',             icon: '🔬' },
      bestTime: { label: 'Segunda, 7h-9h e 19h-21h',          detail: 'Segunda-feira é o dia de recomeço — atenção máxima para mudança',         icon: '🕗' },
    },
  };

  // Nicho: Negócios / Vendas / Empreendedorismo
  if (/vendas?|empreend|negócio|empresa|faturar|marketing/.test(src)) return {
    niche: t('intelPage.niches.business'),
    topics: [
      { title: 'Como fechar mais vendas sem desconto — método real',       reason: 'Conteúdo antidesperdiço de margem cresce 71% no nicho desde Q1/25', trend: '+71%' },
      { title: 'Erros que impedem MEIs de escalar para LTDA',             reason: 'Transição empresarial é o tema de maior procura no segmento',        trend: '+3x pesquisas' },
      { title: 'Por que o seu produto está certo mas o cliente não compra', reason: 'Psicologia de vendas gera 2.5x mais compartilhamento no IG',        trend: '+2.5x compartilhamentos' },
      { title: 'Rotina de 3h que substituiu 8h de trabalho reativo',      reason: 'Produtividade extrema tem a maior taxa de salvamentos do segmento em março',   trend: 'top salvamentos' },
      { title: 'O que os seus concorrentes fazem que você ainda não viu',  reason: 'Análise competitiva como conteúdo cria autoridade e gera curiosidade', trend: '+58%' },
    ],
    patterns: {
      format:   { label: 'Carrossel lista (3-7 slides)',     detail: 'Listas numeradas performam 40% melhor que narrativas no nicho',       icon: '📋' },
      hook:     { label: 'Provocação + dado de mercado',     detail: '"R$ 50k de faturamento e sem salário — você conhece alguém assim?" — alto engajamento', icon: '💥' },
      tone:     { label: 'Direto + Sem paciência para teoria', detail: 'Audiência de negócios quer aplicação imediata — menos contexto, mais ação', icon: '⚡' },
      bestTime: { label: 'Terça e Quarta, 7h-9h',             detail: 'Empreendedores consomem conteúdo no início da jornada de trabalho',   icon: '🕖' },
    },
  };

  // Nicho: Marcenaria / Construção
  if (/marcen|móveis?|madeira|carpint|construção|reforma/.test(src)) return {
    niche: t('intelPage.niches.wood'),
    topics: [
      { title: 'Transformação de ambiente com móvel planejado — antes/depois', reason: 'Visuais de transform. têm 91% mais alcance que posts teóricos', trend: '+91%' },
      { title: 'O que o vendedor de loja não te conta sobre o MDF',            reason: 'Conteúdo conta-intuitivo tem alta virabilidade no segmento',     trend: '+2.1x shares' },
      { title: 'Erro de medição que arruinou a cozinha de um cliente',         reason: 'Histórias de erro geram alto engajamento por identificação',    trend: 'top comentários' },
      { title: 'Por que móvel sob medida custa mais e vale mais',              reason: 'Argumento de valor justifica preço e reduz objeção de custo',   trend: '+44% conv.' },
      { title: 'Tempo real: como um closet sai do zero em 3 dias',            reason: 'Conteúdo de bastidores/processo tem taxa de salvamento 3x maior',        trend: '+3x salvamentos' },
    ],
    patterns: {
      format:   { label: 'Carrossel processo + Reel (se disponível)', detail: 'Sequência de fotos do "em obras" ao resultado final performa muito', icon: '🪵' },
      hook:     { label: 'Resultado visual no primeiro slide',         detail: 'Mostrar o depois antes do antes — cria curiosidade de processo',     icon: '👁️' },
      tone:     { label: 'Orgulho artesanal + Técnico acessível',     detail: 'Valorizar o ofício enquanto explica o processo sem jargão',         icon: '🔨' },
      bestTime: { label: 'Sábado, 9h-12h',                            detail: 'Pico de planejamento residencial nos finais de semana',            icon: '🕘' },
    },
  };

  // Fallback genérico baseado nos dados do usuário
  return {
    niche: brand.product ? `${brand.product.split(' ').slice(0,3).join(' ')}` : t('intelPage.niches.fallback'),
    topics: [
      { title: `Por que ${brand.targetAudience || t('common.audience')} está mudando de comportamento`,          reason: 'Mudanças de comportamento são os temas com maior engajamento de nicho',              trend: '+alto eng.' },
      { title: `O erro que faz ${brand.targetAudience || t('common.audience')} não converterem`,                    reason: 'Conteúdo de objeção convertida tem save rate 2x maior que posts motivacionais',   trend: '+2x saves'  },
      { title: `Bastidores: como ${brand.businessName || t('common.brandKit')} entrega resultado`,             reason: 'Transparência de processo aumenta confiança e fidelidade do cliente',               trend: '+confiança' },
      { title: `3 sinais que ${brand.targetAudience || t('common.audience')} está pronto para comprar`,          reason: 'Conteúdo de vendas consultivo tem conversão 38% maior no formato carrossel',      trend: '+38% conv.' },
      { title: `O que ninguém te conta sobre ${brand.product || t('common.niche')}`,                         reason: 'Revelações de bastidor têm virabilidade 3x maior em nichos de serviço',            trend: '+3x shares' },
    ],
    patterns: {
      format:   { label: 'Carrossel (6-8 slides)',     detail: 'Formato com maior tempo de tela e taxa de save no seu segmento',  icon: '📊' },
      hook:     { label: 'Pergunta-problema pessoal',  detail: 'Cria identificação imediata e aumenta as chances de comentário',  icon: '💬' },
      tone:     { label: 'Prático + Empático',         detail: 'Associação de solução direta com empatia pela dor do cliente',   icon: '🎯' },
      bestTime: { label: 'Terça a Quinta, 19h-21h',   detail: 'Horário de maior consumo ativo de conteúdo no Brasil',           icon: '🕘' },
    },
  };
}

// ─── INTEL PAGE ──────────────────────────────────────────────────────────────
export default function IntelPage({ brand, hasActivated, primaryColor, onCreateFirst }) {
  const { t, i18n } = useTranslation();
  const [updating, setUpdating]         = useState(false);
  const [lastUpdate, setLastUpdate]     = useState(hasActivated ? new Date() : null);
  const [activeTopicIdx, setActiveTopicIdx] = useState(null);
  const hasIG = !!brand.isInstagramConnected;

  const intel = getMarketIntelligence(brand, t);

  const handleUpdate = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setLastUpdate(new Date());
    }, 2800);
  };

  // ── EMPTY STATE ──
  if (!hasActivated) return (
    <div className="flex flex-col items-center justify-center flex-1 py-28 gap-8 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center">
        <Search size={44} className="text-gray-400"/>
      </motion.div>
      <div>
        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-3">
          {t('intelPage.emptyState.title').split('.')[0]}.<br/>{t('intelPage.emptyState.title').split('.')[1]}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {t('intelPage.emptyState.subtitle')}
        </p>
      </div>
      <button onClick={onCreateFirst}
        className="intel-gradient text-black px-10 py-4 rounded-[20px] font-black uppercase tracking-widest text-sm shadow-xl flex items-center gap-3 hover:scale-[1.02] transition-transform">
        <Plus size={18}/> {t('dashboard.suggestions.createBtn')}
      </button>

      {/* Preview */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl opacity-30 pointer-events-none">
        {['Temas em alta', 'Padrões do mercado', 'Performance'].map((l,i) => (
          <div key={i} className="glass border border-white/5 rounded-[20px] p-5 space-y-3">
            <div className="h-3 bg-white/10 rounded-full w-3/4"/>
            <div className="h-2 bg-white/5 rounded-full"/>
            <div className="h-2 bg-white/5 rounded-full w-2/3"/>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ACTIVE STATE ──
  return (
    <div className="space-y-8 pb-10">

      {/* INFO CARD */}
      <div className="flex items-start gap-4 bg-accent/5 border border-[#c4973b]/20 rounded-[28px] p-6 shadow-xl shadow-accent/5">
         <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl shrink-0">🔍</div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">O que é a Inteligência de Mercado?</h4>
            <p className="text-[11px] text-gray-300 font-bold leading-relaxed">
               O Sherlock analisa as <strong className="text-white">tendências e padrões</strong> do seu nicho em tempo real. 
               Identificamos quais temas estão com maior alcance acadêmico, quais formatos convertem mais e o melhor tom de voz para sua audiência. 
               Use estes dados para validar suas ideias antes de criar.
            </p>
         </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
            {t('intelPage.title').split('.')[0]} <span className="text-accent">{t('intelPage.title').split('.')[1]}</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {t('intelPage.subtitle', { niche: intel.niche })}
          </p>
        </div>

        {/* Last update + refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('intelPage.lastUpdate')}</p>
            <p className="text-[10px] font-bold text-gray-300">
              {lastUpdate ? lastUpdate.toLocaleString(i18n.language === 'es' ? 'es-ES' : 'pt-BR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}
            </p>
          </div>
          <button onClick={handleUpdate} disabled={updating}
            className={`flex items-center gap-2 px-4 py-2 rounded-[14px] border text-[10px] font-black uppercase tracking-widest transition-all ${
              updating
                ? 'bg-accent/10 border-[#c4973b]/30 text-accent cursor-wait'
                : 'bg-white/5 border-white/10 text-gray-300 hover:border-accent/40 hover:text-white'
            }`}>
            <RefreshCw size={12} className={updating ? 'animate-spin' : ''}/>
            {updating ? t('intelPage.updating') : t('intelPage.refresh')}
          </button>
        </div>
      </div>

      {/* Sherlock "working" indicator */}
      <AnimatePresence>
        {updating && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-4 bg-accent/5 border border-[#c4973b]/20 rounded-[18px] p-4">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-lg shrink-0">🔍</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-accent">{t('intelPage.sherlockWorking')}</p>
              <p className="text-[10px] text-gray-300 font-bold">{t('intelPage.sherlockAnalyzing', { niche: intel.niche })}</p>
            </div>
            <div className="flex gap-1 ml-auto">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}/>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCK 1: Temas em alta ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-[#c4973b]/20 flex items-center justify-center text-base">🔍</div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">{t('intelPage.trending.title')}</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t('intelPage.trending.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {intel.topics.map((topic, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`glass rounded-[24px] p-5 border transition-all relative overflow-hidden group cursor-pointer ${
                activeTopicIdx === i ? 'border-accent/20 bg-accent/5' : 'border-white/5 hover:border-accent/25'
              }`}
              onClick={() => setActiveTopicIdx(activeTopicIdx === i ? null : i)}
            >
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-opacity" style={{ background: primaryColor }}/>

              <div className="flex items-start justify-between mb-3">
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: primaryColor, borderColor: primaryColor + '40', background: primaryColor + '15' }}>
                  {topic.trend}
                </span>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">#{i+1}</span>
              </div>

              <h4 className="font-bold text-sm text-white leading-snug mb-2">{topic.title}</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-4">{topic.reason}</p>

              <button
                onClick={e => { e.stopPropagation(); onCreateFirst(topic.title); }}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors">
                <Plus size={11}/> {t('intelPage.trending.createBtn')}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BLOCK 2: O que está funcionando ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-[#c4973b]/20 flex items-center justify-center text-base">♟️</div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">{t('intelPage.stats.title')}</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t('intelPage.stats.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(intel.patterns).map(([key, p], i) => (
            <motion.div key={key}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
              className="glass rounded-[22px] p-5 border border-white/5 space-y-3">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1.5">
                  {key === 'format'   ? t('intelPage.stats.format')  :
                   key === 'hook'     ? t('intelPage.stats.hook')  :
                   key === 'tone'     ? t('intelPage.stats.tone')  : t('intelPage.stats.time')}
                </p>
                <p className="font-black text-sm text-white leading-snug">{p.label}</p>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed border-t border-white/5 pt-3">{p.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── BLOCK 3: Histórico (IG) ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-[#c4973b]/20 flex items-center justify-center text-base">📈</div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">{t('intelPage.ig.title')}</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t('intelPage.ig.subtitle')}</p>
          </div>
        </div>

        {hasIG ? (
          <div className="glass border border-white/5 rounded-[28px] p-8 space-y-6">
            {/* Simulated top posts */}
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">{t('intelPage.ig.accountLabel', { handle: brand.igHandle })}</p>
            <div className="space-y-3">
              {[
                { type: 'CARROSSEL', topic: 'Por que treinar sem método é pior que não treinar',        reach: '4.2k', eng: '8.1%', saves: 312 },
                { type: 'POST',      topic: 'O erro que comete quem treina há anos sem resultado',      reach: '2.9k', eng: '6.4%', saves: 189 },
                { type: 'STORY',     topic: 'Enquete: você treina com método ou na intuição?',          reach: '1.8k', eng: '12.3%',saves: 0   },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[16px] bg-white/3 border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background: primaryColor + '33', color: primaryColor }}>
                    {i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color: primaryColor }}>{p.type}</p>
                    <p className="text-xs font-bold text-white truncate">{p.topic}</p>
                  </div>
                  <div className="flex gap-4 shrink-0 text-right">
                    <div>
                      <p className="text-xs font-black text-white">{p.reach}</p>
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">alcance</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-green-400">{p.eng}</p>
                      <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">engaj.</p>
                    </div>
                    {p.saves > 0 && (
                      <div>
                        <p className="text-xs font-black text-accent">{p.saves}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">salvos</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 italic pt-2">{t('intelPage.ig.simulatedInfo')}</p>
          </div>
        ) : (
          <div className="glass border border-white/5 rounded-[28px] p-10 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center">
              <Eye size={32} className="text-gray-400"/>
            </div>
            <div>
              <h4 className="font-black text-lg uppercase italic tracking-tighter mb-2">{t('intelPage.ig.ctaTitle')}</h4>
              <p className="text-gray-400 text-sm max-w-sm">
                {t('intelPage.ig.ctaSub')}
              </p>
            </div>
            <button 
              onClick={() => onCreateFirst?.('dna')}
              className="flex items-center gap-2 px-8 py-4 rounded-[22px] intel-gradient text-black text-sm font-black uppercase tracking-widest hover:scale-[1.05] transition-transform shadow-xl">
              <Zap size={16}/> CONECTAR INSTAGRAM AGORA
            </button>
          </div>
        )}
      </section>

      {/* ── SHERLOCK SIGNATURE ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="flex items-center gap-4 bg-white/3 border border-white/5 rounded-[20px] p-5">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-[#c4973b]/20 flex items-center justify-center text-xl shrink-0">🔍</div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-0.5">{t('intelPage.sherlock.title')}</p>
          <p className="text-[10px] text-gray-300 font-bold">
            {t('intelPage.sherlock.desc')}
          </p>
        </div>
        {lastUpdate && (
          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 shrink-0 text-right">
            {lastUpdate.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'pt-BR', { day: '2-digit', month: 'short' })}<br/>
            {lastUpdate.toLocaleTimeString(i18n.language === 'es' ? 'es-ES' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </motion.div>
    </div>
  );
}
