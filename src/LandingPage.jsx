import React, { useRef } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { BorderBeam } from "@/components/ui/border-beam"
import { Safari } from "@/components/ui/safari"
import { Iphone } from "@/components/ui/iphone"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { Marquee } from "@/components/ui/marquee"
import { TweetCard } from "@/components/ui/tweet-card"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { 
  Search, 
  Target,
  Palette,
  Type,
  TrendingUp, 
  Zap, 
  Shield, 
  Users,
  MessageSquare,
  Camera,
  Cpu,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Calendar,
  Fingerprint,
  X
} from "lucide-react"

// Testimonial Card Simplified
const TestimonialCard = ({ name, handle, content, avatar }) => (
  <div className="w-80 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-4 hover:border-white/10 transition-colors">
    <div className="flex items-center gap-3">
      <img src={avatar} className="w-10 h-10 rounded-full" alt={name} />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{name}</span>
        <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">{handle}</span>
      </div>
    </div>
    <p className="text-xs text-neutral-300 leading-relaxed font-medium italic">"{content}"</p>
  </div>
);

const Circle = React.forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-[#00BFC6]/50 group",
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"

// Mock Data for Social Proof
const testimonials = [
  {
    name: "Duda Ferreira",
    handle: "Marketing Performance",
    content: "O Sherlock economizou 4 horas da minha semana só na primeira análise. É surreal como ele entende o público.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duda",
  },
  {
    name: "Carlos Silva",
    handle: "Creative Director",
    content: "O Designer do PostDNA entrega layouts que eu levaria o dia todo pra fazer. O estilo visual é top de linha.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  },
  {
    name: "Dani Almeida",
    handle: "Estratégia Digital",
    content: "Finalmente um squad de IA que não parece robótico. As legendas são estratégicas e vendem de verdade.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dani",
  },
  {
    name: "Lucas Tech",
    handle: "Tech Entrepreneur",
    content: "A integração dos agentes é o diferencial. Um analisa, outro escreve, outro cria. Fluxo perfeito.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  },
]

export default function LandingPage({ onGetStarted, onLogin }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#00BFC6]/30 font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 font-sans">
         <div className="max-w-7xl mx-auto flex items-center justify-between glass border border-white/5 px-8 py-5 rounded-[32px] backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5EE] to-[#00BFC6] flex items-center justify-center p-2 shadow-[0_0_30px_rgba(0,191,198,0.3)]">
                  <img src="/assets/postdna-icon.svg" className="w-full" alt="PostDNA Logo" />
               </div>
               <span className="font-extrabold tracking-tighter text-xl uppercase italic text-white">PostDNA</span>
            </div>
            
            <button onClick={onLogin} className="px-8 py-3 bg-[#00BFC6] text-black font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,191,198,0.2)]">ENTRAR</button>
         </div>
      </nav>

      {/* --- HERO SECTION: EDITORIAL TITANIC --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container px-6 mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-8"
        >
          <Zap size={14} fill="currentColor" /> A Evolução da Automação Chegou
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-12 drop-shadow-2xl">
           PARE DE SER <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-gray-500">GENÉRICO</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-bold text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 uppercase tracking-tight">
          Sua marca merece uma <span className="text-accent italic">Grife Editorial</span>, não apenas uma IA que faz posts. Automatizamos sua autoridade global com Squads Especialistas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <button 
             onClick={onGetStarted}
             className="px-10 py-5 bg-accent text-black font-black rounded-2xl text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(0,191,198,0.3)]"
           >
             Começar agora
           </button>
           <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
             Ver demonstração
           </button>
         </div>
      </div>
    </section>

    {/* SECTION: A NOVA ERA (COMPARATIVO DE CATEGORIA) */}
    <section className="py-24 bg-[#0a0a0c] border-y border-white/5 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
       <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
                   Conveniência vs Qualidade
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                   O Fim das IAs <br /> <span className="text-accent underline decoration-accent/30 underline-offset-8">Commoditizadas.</span>
                </h2>
                <p className="text-xl text-gray-400 font-bold leading-relaxed max-w-lg">
                   Não somos apenas mais um gerador com templates prontos. Enquanto sistemas comuns criam ruído industrial, nós criamos sinal de alta frequência.
                </p>
                <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-red-500/50 group-hover:bg-red-500/10 transition-all"><X size={20} /></div>
                      <div>
                         <p className="text-sm font-black uppercase text-gray-500">Automação Comum</p>
                         <p className="text-xs font-bold text-gray-600">Posts que "gritam" inteligência artificial genérica.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent"><CheckCircle2 size={20} /></div>
                      <div>
                         <p className="text-sm font-black uppercase text-accent">Squad PostDNA</p>
                         <p className="text-xs font-bold text-white uppercase tracking-widest italic">Conexão humana e design de grife.</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Tabela de Contraste Visual */}
             <div className="glass rounded-[40px] border border-white/10 overflow-hidden shadow-2xl p-8 lg:p-12 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                <div className="space-y-10">
                   <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recurso</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">PostDNA Elite</span>
                   </div>
                   {[
                      { l: 'Fidelidade Visual', r: '1080x1440 Editorial' },
                      { l: 'Estratégia de Copy', r: 'Investigação do Sherlock' },
                      { l: 'Direção de Arte', r: 'Agente Designer In-App' },
                      { l: 'Conveniência', r: 'Dashboard Hub (BYOK)' }
                   ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{row.l}</span>
                         <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Zap size={10} className="text-accent" /> {row.r}
                         </span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </section>

      {/* SECTION: SHOWCASE EDITORIAL (FASE 2.1) */}
    <section className="py-32 bg-black relative">
       <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20 border-b border-white/5 pb-12">
             <div className="space-y-4 max-w-2xl">
                <p className="text-xs font-black text-accent uppercase tracking-[0.4em]">Curadoria Visual</p>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                   3 Modelos, <br /> Milhares de <span className="text-accent">Diferenciais</span>.
                </h2>
             </div>
             <p className="text-lg text-gray-400 font-bold max-w-sm leading-relaxed uppercase tracking-tight italic">
                Enquanto sistemas comuns alucinam com templates datados, o PostDNA gera designs baseados em hierarquia editorial real.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* MODEL 1: EDITORIAL */}
             <motion.div whileHover={{ y: -10 }} className="space-y-6">
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 relative group bg-amber-50">
                   <img src="https://images.unsplash.com/photo-1541461985943-9590d7474b5a?q=80&w=1080&h=1440&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-multiply opacity-20" />
                   <div className="absolute inset-0 p-12 flex flex-col justify-between text-black">
                      <div className="flex items-center gap-2"><div className="w-6 h-6 bg-black rounded-lg"></div><span className="text-[10px] font-black uppercase italic">LUXURY BRAND</span></div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Capas de Alto Impacto</span>
                        <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.8] mt-4">Editorial de Autoridade</h3>
                      </div>
                   </div>
                </div>
                <div className="px-4">
                   <h4 className="text-xl font-black uppercase text-white">01. Layout Editorial</h4>
                   <p className="text-sm text-gray-500 font-bold mt-2">O padrão de ouro das revistas de luxo aplicadas ao seu feed.</p>
                </div>
             </motion.div>

             {/* MODEL 2: MINIMALIST */}
             <motion.div whileHover={{ y: -10 }} className="space-y-6">
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 relative group bg-zinc-950 flex flex-col items-center justify-center text-center p-12">
                   <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.8] text-white">Insights que dominam o Scroll</h3>
                   <div className="w-16 h-1.5 bg-accent rounded-full mt-8"></div>
                </div>
                <div className="px-4">
                   <h4 className="text-xl font-black uppercase text-white">02. Minimalist Mode</h4>
                   <p className="text-sm text-gray-500 font-bold mt-2">Clareza alemã. Foco total na sua sabedoria e tipografia massiva.</p>
                </div>
             </motion.div>

             {/* MODEL 3: TWEET CARD */}
             <motion.div whileHover={{ y: -10 }} className="space-y-6">
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 relative group bg-zinc-900 flex flex-col items-center justify-center p-8">
                   <TweetCard 
                      author={{
                        name: "Sua Marca",
                        handle: "@autoridade",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brand"
                      }}
                      content={{
                        text: "A automação comum cria ruído. O PostDNA cria sinal de alta frequência. Escolha seu DNA.",
                        subText: "Venda mais com menos esforço."
                      }}
                      className="w-full border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                   />
                </div>
                <div className="px-4">
                   <h4 className="text-xl font-black uppercase text-white">03. Social Mode</h4>
                   <p className="text-sm text-gray-500 font-bold mt-2">O clássico Tweet Card que gera as maiores taxas de compartilhamento.</p>
                </div>
             </motion.div>
          </div>
       </div>
    </section>

     {/* --- GRID DE MOCKUPS EDITORIAIS --- */}
    <section className="py-20 px-4 relative overflow-hidden bg-black/60">
        <div className="max-w-[1400px] mx-auto space-y-20">
           <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12">
              <div className="space-y-4">
                 <p className="text-accent font-black tracking-[0.3em] uppercase text-[10px]">O Padrão Editorial 2026</p>
                 <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                    Sua marca, <br /> em Alta Definição.
                 </h2>
              </div>
              <p className="text-neutral-500 max-w-sm font-bold text-sm leading-relaxed mb-1">
                 O PostDNA é o único sistema que gera conteúdos no formato 3:4 (1080x1440), capturando 20% mais atenção no feed do que posts comuns.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "A Ascensão do Digital", 
                  style: "editorial", 
                  img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600&h=800",
                  tag: "CAPA / HOOK"
                },
                { 
                  title: "Estratégia Silenciosa", 
                  style: "dark", 
                  img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=800",
                  tag: "CONTEÚDO"
                },
                { 
                  title: "O Futuro das Marcas", 
                  style: "editorial", 
                  img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600&h=800",
                  tag: "AUTORIDADE"
                },
                { 
                  title: "Conversão Imediata", 
                  style: "dark", 
                  img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=800",
                  tag: "CTA"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className={`aspect-[3/4] rounded-[48px] overflow-hidden border-8 border-white/5 relative group cursor-pointer shadow-2xl transition-all duration-700 ${item.style === 'editorial' ? 'bg-[#F0EAD6]' : 'bg-[#0A0A0C]'}`}
                >
                   <img 
                    src={item.img} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${item.style === 'editorial' ? 'mix-blend-multiply opacity-30' : 'opacity-40 group-hover:opacity-50'}`} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   
                   <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-start">
                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.style === 'editorial' ? 'bg-black text-white border-black' : 'bg-accent text-black border-accent'}`}>
                            {item.tag}
                         </div>
                         <Fingerprint className={item.style === 'editorial' ? 'text-black/20' : 'text-white/20'} size={24} />
                      </div>
                      <div className="space-y-4">
                         <h4 className={`text-4xl font-black uppercase italic tracking-tighter leading-none ${item.style === 'editorial' ? 'text-black' : 'text-white'}`}>
                            {item.title}
                         </h4>
                         <div className={`w-12 h-1 bg-accent rounded-full group-hover:w-full transition-all duration-500`} />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* --- DEVICE COMBO MOCKUP (Deslocado para impacto) --- */}
        <div className="relative mt-40 max-w-6xl w-full px-4 mx-auto perspective-1000">
           <div className="relative flex items-center justify-center">
              {/* Safari Desktop */}
              <div className="w-full max-w-5xl transform-gpu transition-all duration-700 hover:scale-[1.01]">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                  <Safari 
                    url="app.postdna.com.br" 
                    imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"
                    className="w-full"
                  />
                  <BorderBeam size={400} duration={12} delay={9} />
                </div>
              </div>

              {/* iPhone Overlay */}
              <div className="absolute -bottom-10 -right-4 md:right-10 w-[240px] md:w-[280px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform-gpu hover:-translate-y-4 hover:rotate-2 transition-all duration-500">
                 <Iphone 
                   src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1080&h=1920" 
                   className="w-full"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* --- AGENT HUB SECTION (SQUAD EM SEQUÊNCIA) --- */}
      <section className="py-40 px-4 relative overflow-hidden bg-[#08080A]">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="text-center mb-24 space-y-4 relative z-10">
          <div className="text-[#00BFC6] font-black tracking-[0.3em] uppercase text-xs">Inteligência em Sequência</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase italic">O Squad trabalhando por você</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-medium leading-relaxed">Cada agente tem uma função vital na construção do seu DNA Digital. Um processo linear de perfeição.</p>
        </div>

        <div
          className="relative flex h-[700px] w-full items-center justify-center overflow-hidden p-10 max-w-6xl mx-auto"
          ref={containerRef}
        >
          <div className="flex size-full max-h-[500px] max-w-2xl flex-col items-stretch justify-between gap-10">
            {/* Top Row: Sherlock & Designer */}
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 01</div>
                <Circle ref={div1Ref}>
                  <Search className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Sherlock</span>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 05</div>
                <Circle ref={div5Ref}>
                  <Palette className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Designer</span>
              </div>
            </div>

            {/* Middle Row: Analista & PostDNA & Copywriter */}
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 02</div>
                <Circle ref={div2Ref}>
                  <BarChart3 className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Analista</span>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Circle ref={div4Ref} className="size-32 md:size-40 bg-gradient-to-br from-[#00E5EE] to-[#00BFC6] p-0.5 border-none shadow-[0_0_100px_rgba(0,191,198,0.4)] animate-pulse">
                  <div className="w-full h-full bg-[#060608] rounded-full flex items-center justify-center relative overflow-hidden">
                    <img src="/assets/postdna-icon.svg" className="w-16 md:w-20 relative z-10" alt="PostDNA" />
                    <div className="absolute inset-0 bg-[#00BFC6]/5" />
                  </div>
                </Circle>
                <span className="text-[11px] font-black uppercase text-[#00BFC6] tracking-[0.4em] italic">PostDNA Core</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 04</div>
                <Circle ref={div6Ref}>
                  <Type className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Copywriter</span>
              </div>
            </div>

            {/* Bottom Row: Estrategista & Revisor */}
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 03</div>
                <Circle ref={div3Ref}>
                  <Target className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Estrategista</span>
              </div>
              <div className="flex flex-col items-center gap-3 group">
                <div className="absolute -top-6 text-[10px] font-black text-[#00BFC6]/40 uppercase tracking-widest group-hover:text-[#00BFC6] transition-colors">Passo 06</div>
                <Circle ref={div7Ref}>
                  <CheckCircle2 className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Revisor</span>
              </div>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div2Ref}
            duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div3Ref}
            duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div4Ref}
            duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div4Ref}
            toRef={div6Ref}
            duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div6Ref}
            toRef={div5Ref}
            duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div5Ref}
            toRef={div7Ref}
            duration={3}
          />
        </div>
      </section>

      {/* --- FEATURES BENTO GRID (ESTILO MAGIC UI) --- */}
      <section className="py-40 px-4 max-w-7xl mx-auto space-y-20">
         <div className="text-center space-y-4">
            <div className="text-[#00BFC6] font-black tracking-[0.3em] uppercase text-xs">A Tecnologia de Elite</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase italic">Sua marca no próximo nível</h2>
         </div>

         <BentoGrid>
            {/* CARD 1: SHERLOCK INTEL */}
            <BentoCard
              name="Inteligência Sherlock"
              className="lg:col-span-2 lg:row-span-1"
              background={
                <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                  <div className="flex flex-col gap-2 p-8 h-full items-center justify-center">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20 animate-pulse"><Search size={24} className="text-accent" /></div>
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5"><TrendingUp size={24} className="text-white/40" /></div>
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5"><Target size={24} className="text-white/40" /></div>
                    </div>
                  </div>
                </div>
              }
              Icon={Search}
              description="A IA que vasculha o mercado por você e encontra os temas que estão bombando agora."
              href="/dashboard"
              cta="Ver por dentro"
            />

            {/* CARD 2: NOTIFICAÇÕES */}
            <BentoCard
              name="Notificações de Elite"
              className="lg:col-span-1 lg:row-span-1"
              background={
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-6 opacity-40">
                  <div className="space-y-2 w-full">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i*200}ms` }}>
                         <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center"><Zap size={12} className="text-accent" /></div>
                         <div className="flex-1 h-2 bg-white/10 rounded-full w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              }
              Icon={Zap}
              description="Alertas de conteúdo pronto, créditos expirando e tendências críticas."
              href="/dashboard"
              cta="Ativar agora"
            />

            {/* CARD 3: CALENDÁRIO */}
            <BentoCard
              name="Agenda de Conteúdo"
              className="lg:col-span-1 lg:row-span-1"
              background={
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <div className="grid grid-cols-4 gap-2 w-full p-8">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white/10 rounded-lg border border-white/10 flex items-center justify-center">
                          {i === 3 && <div className="size-2 rounded-full bg-accent animate-ping" />}
                        </div>
                      ))}
                   </div>
                </div>
              }
              Icon={Calendar}
              description="Postagens para o mês inteiro organizadas em segundos. Sua audiência nunca fica órfã."
              href="/dashboard"
              cta="Organizar postagens"
            />

            {/* CARD 4: DNA VISUAL */}
            <BentoCard
              name="DNA Visual Único"
              className="lg:col-span-2 lg:row-span-1"
              background={
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                   <Fingerprint size={300} className="text-neutral-500" strokeWidth={0.5} />
                </div>
              }
              Icon={Palette}
              description="O squad estuda suas cores, fontes e estilo. Nenhum post é genético — tudo é construído com seu DNA."
              href="/dashboard"
              cta="Definir meu estilo"
            />
         </BentoGrid>
      </section>

      {/* --- SECTION 3: COMO FUNCIONA --- */}
      <section className="py-40 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <div className="text-[#00BFC6] font-bold tracking-[0.3em] uppercase text-xs">Simplicidade de Elite</div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic">Três passos. Sem complicação.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: 1, title: "Configure o DNA da sua marca", desc: "Logo, cores, fonte e tom de voz. Uma vez só. O PostDNA aplica em tudo automaticamente.", icon: <Shield size={32} /> },
            { step: 2, title: "Escolha o que criar", desc: "Carrossel, story, post ou artigo. O Sherlock pesquisa tendências do seu nicho antes de criar.", icon: <Zap size={32} /> },
            { step: 3, title: "Revise, aprove e baixe", desc: "Veja o conteúdo pronto com a identidade da sua marca. Edite o que quiser e baixe em alta resolução.", icon: <Users size={32} /> },
          ].map((item) => (
            <div key={item.step} className="group p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-[#00BFC6]/30 transition-all relative overflow-hidden">
               <div className="text-[80px] font-black absolute -top-10 -right-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">0{item.step}</div>
               <div className="w-16 h-16 rounded-2xl bg-[#00BFC6]/10 flex items-center justify-center text-[#00BFC6] mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
               <h4 className="text-xl font-black uppercase italic mb-4">{item.title}</h4>
               <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 4: DEMO VISUAL (Antes e Depois) --- */}
      <section className="py-40 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic">Veja funcionando antes de assinar</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
             <div className="space-y-6">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-red-500">Sem PostDNA</div>
                <div className="aspect-square rounded-[40px] bg-neutral-900 border border-white/5 flex flex-col items-center justify-center p-12 text-center group grayscale hover:grayscale-0 transition-all">
                  <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/10 opacity-40">
                     <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Post genérico sem alma</span>
                  </div>
                  <p className="mt-8 text-sm text-neutral-500 font-bold uppercase italic italic">"Tentei fazer sozinho e ficou assim..."</p>
                </div>
             </div>
             <div className="space-y-6">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-[#00BFC6]">Com PostDNA</div>
                <div className="aspect-square rounded-[40px] bg-[#00BFC6]/5 border border-[#00BFC6]/20 relative overflow-hidden group">
                   <img src="/assets/mobile-preview.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Exemplo PostDNA" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   <div className="absolute bottom-10 left-10 text-left">
                      <div className="text-2xl font-black uppercase italic text-white leading-none">Design de Elite</div>
                      <p className="text-[8px] font-bold text-[#00BFC6] uppercase tracking-[0.4em] mt-2">Identidade Visual · Estratégia · Copy</p>
                   </div>
                </div>
             </div>
          </div>

          <button onClick={onGetStarted} className="px-12 py-6 bg-[#00BFC6] text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(0,191,198,0.2)] text-lg uppercase tracking-widest">
            ENTRAR AGORA →
          </button>
        </div>
      </section>

      {/* --- SECTION 4.5: TESTEMUNHOS (MARQUEE) --- */}
      <section className="py-20 bg-black/20 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-full space-y-4">
           <Marquee pauseOnHover className="[--duration:40s]">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
           </Marquee>
        </div>
      </section>

      {/* --- SECTION 5: COMPARATIVO --- */}
      <section className="py-40 px-4 max-w-5xl mx-auto overflow-x-auto md:overflow-visible">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Quanto você está gastando hoje?</h2>
        </div>

        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
             <tr className="border-b border-white/10">
                <th className="py-8 text-xs font-black uppercase tracking-widest text-neutral-500 italic">Comparativo</th>
                <th className="py-8 text-xs font-black uppercase tracking-widest text-neutral-400 italic">Designer / Agência</th>
                <th className="py-8 text-xs font-black uppercase tracking-widest text-[#00BFC6] italic">PostDNA</th>
             </tr>
          </thead>
          <tbody className="text-sm">
             {[
               { label: "Custo Mensal", ag: "R$ 1.500 a R$ 5.000", pd: "A partir de R$ 97" },
               { label: "Prazo de Entrega", ag: "2 a 5 dias", pd: "Menos de 3 minutos" },
               { label: "Brief Semanal", ag: "Sim — toda semana", pd: "Não — DNA Fixado" },
               { label: "Disponibilidade", ag: "Horário Comercial", pd: "24 horas por dia" },
               { label: "Identidade da Marca", ag: "Depende do profissional", pd: "Sempre consistente" },
               { label: "Dependência", ag: "Sim — total", pd: "Não — você no controle" },
             ].map((row, i) => (
               <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 font-bold text-neutral-400">{row.label}</td>
                  <td className="py-6 text-neutral-600 font-medium italic">{row.ag}</td>
                  <td className="py-6 font-black text-white italic uppercase tracking-wider">{row.pd}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </section>

      {/* --- SECTION 6: PLANOS --- */}
      <section id="pricing" className="py-40 px-4 bg-[#00BFC6]/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-20">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-[8rem] font-black uppercase italic tracking-tighter leading-none mb-4">A Escolha de <span className="text-accent">Elite</span></h2>
            <div className="flex items-center justify-center gap-4 bg-white/5 w-fit mx-auto p-2 rounded-2xl border border-white/10">
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-4">Mensal</span>
               <div className="w-12 h-6 rounded-full bg-accent p-1 flex items-center justify-end cursor-pointer shadow-[0_0_20px_rgba(0,191,198,0.3)]">
                  <div className="w-4 h-4 rounded-full bg-black" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-accent px-4 italic">Anual — 2 Meses Grátis ✨</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {/* PLAN 1: AUTHORITY */}
             <div className="p-10 rounded-[40px] border border-white/5 bg-black/40 space-y-8 flex flex-col justify-between hover:border-white/10 transition-colors group">
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-neutral-500">Authority</div>
                   <div className="text-7xl font-black uppercase italic text-white leading-none">R$ 97<span className="text-xs text-neutral-500 not-italic">/mês</span></div>
                   <div className="py-2 px-4 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-accent inline-block">Mix: 4 Carrosséis + 10 Posts + Stories</div>
                </div>
                <ul className="text-left space-y-4 text-[11px] font-black uppercase italic tracking-wider">
                   <li className="flex items-center gap-2 font-bold"><CheckCircle2 size={16} className="text-[#00BFC6]" /> 100 Créditos iniciais</li>
                   <li className="flex items-center gap-2 text-neutral-200"><CheckCircle2 size={16} className="text-[#00BFC6]" /> 1 Marca (DNA Único)</li>
                   <li className="flex items-center gap-2 text-neutral-200"><CheckCircle2 size={16} className="text-[#00BFC6]" /> Sherlock + Designer</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Começar agora</button>
             </div>

             {/* PLAN 2: SCALER */}
             <div className="p-10 rounded-[40px] bg-accent text-black space-y-8 flex flex-col justify-between scale-105 shadow-[0_40px_100px_rgba(0,191,198,0.2)] relative overflow-hidden group border-4 border-white/20">
                <div className="absolute top-0 right-0 p-8">
                   <div className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">Mais Vendido</div>
                </div>
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-black/40 italic">Scaler</div>
                   <div className="text-7xl font-black uppercase italic leading-none">R$ 147<span className="text-xs text-black/40 not-italic">/mês</span></div>
                   <div className="py-2 px-4 bg-black/10 rounded-xl border border-black/5 text-[9px] font-black uppercase tracking-[0.2em] inline-block">Mix: 12 Carrosséis + 30 Posts + Stories</div>
                </div>
                <ul className="text-left space-y-4 text-[11px] font-black uppercase italic tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 300 Créditos iniciais</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Até 3 Marcas (DNAs)</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Todos os Agentes de Elite</li>
                   <li className="flex items-center gap-2 font-black italic"><CheckCircle2 size={16} /> Baixar em Alta Resolução</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-2xl">⚡ Ativar Escalabilidade</button>
             </div>

             {/* PLAN 3: AGENCY HUB */}
             <div className="p-10 rounded-[40px] border border-white/5 bg-black/40 space-y-8 flex flex-col justify-between hover:border-white/10 transition-colors group">
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-neutral-500">Agency Hub</div>
                   <div className="text-7xl font-black uppercase italic text-white leading-none">R$ 247<span className="text-xs text-neutral-500 not-italic">/mês</span></div>
                   <div className="py-2 px-4 bg-accent/10 rounded-xl border border-accent/10 text-[9px] font-black uppercase tracking-[0.2em] text-accent inline-block">Mix: 30 Carrosséis + 60 Posts + Blog</div>
                </div>
                <ul className="text-left space-y-4 text-[11px] font-black uppercase italic tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> 600 Créditos iniciais</li>
                   <li className="flex items-center gap-2 text-neutral-200"><CheckCircle2 size={16} className="text-[#00BFC6]" /> Marcas Ilimitadas</li>
                   <li className="flex items-center gap-2 text-[#00BFC6] font-black italic"><CheckCircle2 size={16} /> Suporte Prioritário</li>
                   <li className="flex items-center gap-2 text-[#00BFC6] font-black italic"><CheckCircle2 size={16} /> Créditos Acumulativos</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all underline underline-offset-4">Assinar Agora</button>
             </div>
          </div>

          <div className="pt-24 text-center">
             <button onClick={onGetStarted} className="text-neutral-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors group">
               Ainda em dúvida? <span className="text-[#00BFC6] group-hover:underline underline-offset-8 transition-all font-black">Comece com 1 carrossel gratuito</span> — sem cartão de crédito.
             </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 8: GARANTIA --- */}
      <section className="py-40 px-4">
        <div className="max-w-4xl mx-auto p-16 rounded-[48px] bg-white/[0.02] border border-white/5 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00BFC6]/10 blur-[80px] rounded-full pointer-events-none" />
           <Shield size={64} className="mx-auto text-[#00BFC6] relative z-10" />
           <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter relative z-10">7 dias de garantia total</h2>
           <p className="text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed relative z-10">
             Se o PostDNA não entregar o que prometemos, devolvemos 100% do valor pago. Sem formulários, sem burocracia, sem perguntas.
           </p>
        </div>
      </section>

      {/* --- SECTION 9: FAQ --- */}
      <section className="py-40 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-16 text-center">Dúvidas Frequentes</h2>
        <div className="space-y-4">
           {[
             { q: "O conteúdo gerado vai parecer feito por IA?", a: "Não. O conteúdo é criado com a identidade visual real da sua marca, tom de voz personalizado e pesquisa de mercado. Não é template genérico." },
             { q: "Funciona para qualquer nicho?", a: "Sim. O Sherlock pesquisa tendências específicas do seu segmento e analisa o que seu público realmente consome antes de criar." },
             { q: "Preciso saber usar Canva ou Photoshop?", a: "Não. Você configura o DNA da marca uma vez e o PostDNA aplica em tudo automaticamente. Você só revisa e aprova." },
             { q: "O que acontece se eu cancelar?", a: "Você pode cancelar a qualquer momento. Seus conteúdos aprovados ficam salvos e disponíveis para download por 30 dias." },
             { q: "Qual a diferença entre os planos?", a: "A quantidade de créditos mensais e o acesso ao gerador de blog automático. Todos os planos têm a mesma qualidade de IA." },
           ].map((faq, i) => (
             <details key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all">
                <summary className="font-bold text-lg uppercase italic flex items-center justify-between list-none">
                   {faq.q}
                   <CheckCircle2 size={18} className="text-[#00BFC6] group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-neutral-400 leading-relaxed font-medium">{faq.a}</p>
             </details>
           ))}
        </div>
      </section>

      {/* --- SECTION 10: CTA FINAL --- */}
      <section className="py-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00BFC6] opacity-5 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
           <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
             Sua marca merece <br /> conteúdo profissional. <span className="text-[#00BFC6]">Todo dia.</span>
           </h2>
           <div className="flex flex-col items-center gap-6">
             <button 
               onClick={onGetStarted}
               className="px-16 py-8 bg-[#00BFC6] text-black font-black rounded-3xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(0,191,198,0.4)] text-2xl uppercase tracking-widest"
             >
               Criar meu primeiro post grátis →
             </button>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">
               Sem cartão · Sem compromisso · Pronto em minutos
             </p>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-4 border-t border-white/5 bg-[#060608]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#00BFC6] flex items-center justify-center p-1.5">
                    <img src="/assets/postdna-icon.svg" className="w-full" alt="PostDNA" />
                 </div>
                 <span className="font-extrabold tracking-tighter text-lg uppercase italic">PostDNA</span>
              </div>
              <p className="text-xs text-neutral-500 max-w-sm uppercase font-bold tracking-widest leading-relaxed">O único sistema com seu próprio Squad de Elite cuidando do seu Instagram.</p>
           </div>
           
           <div className="flex flex-wrap gap-8 md:justify-end text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              <a href="#" className="hover:text-white transition-colors">Planos</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-neutral-700">
           <span>© 2026 POSTDNA. ALL RIGHTS RESERVED.</span>
           <div className="flex gap-4">
              <span className="text-[#00BFC6]">PT-BR</span>
              <span>ES</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
