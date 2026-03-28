import React, { useRef } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
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
  CheckCircle2
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
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6">
         <div className="max-w-7xl mx-auto flex items-center justify-between glass border border-white/5 px-8 py-4 rounded-[28px] backdrop-blur-3xl">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-[#00BFC6] flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(0,191,198,0.3)]">
                  <img src="/assets/postdna-icon.svg" className="w-full" alt="PostDNA Logo" />
               </div>
               <span className="font-extrabold tracking-tighter text-lg uppercase italic">PostDNA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
               <a href="#features" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Squad</a>
               <a href="#demo" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Tecnologia</a>
               <a href="#testimonials" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Prova Social</a>
            </div>

            <div className="flex items-center gap-4">
               <button onClick={onLogin} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white px-4 py-2 hover:bg-white/5 rounded-xl transition-all">Login</button>
               <button onClick={onGetStarted} className="px-6 py-3 bg-[#00BFC6] text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Get Started</button>
            </div>
         </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center pt-48 pb-20 px-4 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00BFC6]/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-[0.1em] text-[#00BFC6] uppercase animate-fade-in">
             Inteligência Artificial de Elite para Marcas
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] max-w-5xl mx-auto uppercase italic">
            Pare de pagar designer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00BFC6] to-white/50">Comece a criar com o seu DNA.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium">
            O PostDNA usa inteligência artificial para criar carrosséis, posts e artigos com a identidade visual da sua marca — em minutos.
          </p>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={onGetStarted}
              className="px-16 py-8 bg-[#00BFC6] text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(0,191,198,0.4)] text-xl uppercase tracking-widest group relative overflow-hidden"
            >
              <span className="relative z-10">Criar meu primeiro post grátis →</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
              Sem cartão de crédito · Sem compromisso
            </p>
          </div>
        </div>

        {/* --- SECTION 2: PROVA SOCIAL IMEDIATA --- */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/5 pt-12">
           <div className="flex items-center justify-center gap-4 group">
              <div className="flex text-yellow-500 gap-0.5">
                 {[...Array(5)].map((_, i) => <Sparkles key={i} size={14} className="fill-current" />)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00BFC6] group-hover:text-white transition-colors">+2.500 Marcas Criando Conteúdo</span>
           </div>
           <div className="flex items-center justify-center gap-4 group">
              <Zap size={18} className="text-[#00BFC6]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Conteúdo gerado em menos de 3 minutos</span>
           </div>
           <div className="flex items-center justify-center gap-4 group">
              <Shield size={18} className="text-[#00BFC6]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">7 dias de garantia ou dinheiro de volta</span>
           </div>
        </div>

        {/* --- DEVICE COMBO MOCKUP --- */}
        <div className="relative mt-24 max-w-6xl w-full px-4 perspective-1000">
           <div className="relative flex items-center justify-center">
              {/* Safari Desktop */}
              <div className="w-full max-w-5xl transform-gpu transition-all duration-700 hover:scale-[1.01]">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                  <Safari 
                    url="app.postdna.com.br" 
                    imageSrc="/assets/dashboard-preview.png"
                    className="w-full"
                  />
                  <BorderBeam size={400} duration={12} delay={9} />
                </div>
              </div>

              {/* iPhone Overlay */}
              <div className="absolute -bottom-10 -right-4 md:right-10 w-[240px] md:w-[280px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform-gpu hover:-translate-y-4 hover:rotate-2 transition-all duration-500">
                 <Iphone 
                   src="/assets/mobile-preview.png" 
                   className="w-full"
                 />
              </div>

              {/* Floating Notifications or Stats */}
              <div className="absolute top-20 left-0 md:-left-10 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl hidden lg:block animate-bounce-slow">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00BFC6]/20 flex items-center justify-center">
                       <TrendingUp className="w-5 h-5 text-[#00BFC6]" />
                    </div>
                    <div>
                       <div className="text-xs font-bold text-neutral-400">Alcance Estimado</div>
                       <div className="text-xl font-black text-white">+24.8%</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- AGENT HUB SECTION (CENTRO + AGENTES) --- */}
      <section className="py-40 px-4 relative overflow-hidden bg-[#08080A]">
        <div className="text-center mb-24 space-y-4 relative z-10">
          <div className="text-[#00BFC6] font-black tracking-[0.3em] uppercase text-xs">A Tecnologia por trás do DNA</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight italic uppercase italic">O Squad trabalhando por você</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-medium">Um fluxo integrado de agentes especialistas que garantem que seu conteúdo nunca seja genérico.</p>
        </div>

        <div
          className="relative flex h-[600px] w-full items-center justify-center overflow-hidden p-10 max-w-6xl mx-auto bg-black/40 rounded-[60px] border border-white/5"
          ref={containerRef}
        >
          <div className="flex size-full max-h-[400px] max-w-lg flex-col items-stretch justify-between gap-10">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div1Ref}>
                  <Search className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">1. Sherlock</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div5Ref}>
                  <Palette className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">5. Designer</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div2Ref}>
                  <BarChart3 className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">2. Analista</span>
              </div>
              
              <Circle ref={div4Ref} className="size-28 md:size-32 bg-gradient-to-br from-[#00E5EE] to-[#00BFC6] p-0.5 border-none shadow-[0_0_80px_rgba(0,191,198,0.4)]">
                <div className="w-full h-full bg-[#060608] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <img src="/assets/postdna-icon.svg" className="w-14 md:w-16 relative z-10" alt="PostDNA" />
                  <div className="absolute inset-0 bg-[#00BFC6]/5 animate-pulse" />
                </div>
              </Circle>

              <div className="flex flex-col items-center gap-2">
                <Circle ref={div6Ref}>
                  <Type className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">4. Copywriter</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div3Ref}>
                  <Target className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">3. Estrategista</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle ref={div7Ref}>
                  <CheckCircle2 className="w-8 h-8 text-[#00BFC6]" />
                </Circle>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">6. Revisor</span>
              </div>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div4Ref}
            curvature={-75}
            endYOffset={-10}
            duration={5}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div4Ref}
            duration={6}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div4Ref}
            curvature={75}
            endYOffset={10}
            duration={4}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div5Ref}
            toRef={div4Ref}
            curvature={-75}
            endYOffset={-10}
            duration={5}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div6Ref}
            toRef={div4Ref}
            duration={6}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={div7Ref}
            toRef={div4Ref}
            curvature={75}
            endYOffset={10}
            duration={4}
            reverse
          />
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="py-40 px-4 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 p-12 bg-white/[0.02] border border-white/10 rounded-[48px] overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFC6]/5 blur-[100px] pointer-events-none transition-all duration-500 group-hover:bg-[#00BFC6]/10" />
               <div className="space-y-6 relative z-10">
                  <Sparkles className="w-12 h-12 text-[#00BFC6]" />
                  <h3 className="text-4xl font-bold tracking-tight">Seu Negócio, Seu DNA.<br/> Sem templates genéricos.</h3>
                  <p className="text-neutral-400 text-lg max-w-xl">O PostDNA aprende com seu site e referências para criar um estilo visual único que ninguém pode copiar.</p>
                  <div className="flex items-center gap-4 pt-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-[#00BFC6]">
                           <CheckCircle2 className="w-3 h-3" /> Inteligência Real
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="md:col-span-4 p-12 bg-[#00BFC6] rounded-[48px] text-black space-y-8 flex flex-col justify-between">
               <div className="space-y-4">
                  <Zap className="w-12 h-12" />
               <h3 className="text-3xl font-black uppercase leading-none tracking-tighter">Velocidade <br /> de Elite</h3>
               </div>
               <p className="font-bold text-lg leading-snug">O que um designer leva 4 dias para entregar, seu squad faz em 3 minutos.</p>
               <button onClick={onGetStarted} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  CRIAR CONTA
               </button>
            </div>
         </div>
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

          <button onClick={onGetStarted} className="px-12 py-6 bg-[#00BFC6] text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,191,198,0.2)] text-lg uppercase tracking-widest">
            Criar meu primeiro post grátis →
          </button>
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
               { label: "Custo Mensal", ag: "R$800 a R$3.000", pd: "A partir de R$67" },
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
      <section className="py-40 px-4 bg-[#00BFC6]/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-20">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">Escolha o plano certo</h2>
            <div className="flex items-center justify-center gap-4">
               <span className="text-xs font-bold text-neutral-400">Mensal</span>
               <div className="w-12 h-6 rounded-full bg-white/10 p-1 flex items-center justify-end cursor-pointer border border-white/10">
                  <div className="w-4 h-4 rounded-full bg-[#00BFC6] shadow-[0_0_10px_rgba(0,191,198,0.5)]" />
               </div>
               <span className="text-xs font-black text-[#00BFC6] uppercase tracking-widest">Anual — 20% OFF</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {/* BÁSICO */}
             <div className="p-10 rounded-[40px] border border-white/5 bg-black/40 space-y-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-neutral-500">Básico</div>
                   <div className="text-5xl font-black uppercase italic">R$67<span className="text-xs text-neutral-500 not-italic">/mês</span></div>
                </div>
                <ul className="text-left space-y-4 text-sm font-bold text-neutral-400 uppercase italic tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> 80 Créditos</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> Carrossel & Posts</li>
                   <li className="flex items-center gap-2 text-neutral-600">Sem Blog</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm transition-all">Começar no Básico</button>
             </div>

             {/* CRESCIMENTO */}
             <div className="p-10 rounded-[40px] bg-[#00BFC6] text-black space-y-8 flex flex-col justify-between scale-105 shadow-[0_0_80px_rgba(0,191,198,0.2)] relative overflow-hidden">
                <div className="absolute top-6 right-6 px-3 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest rounded-full">Mais Popular</div>
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-black/40">Crescimento</div>
                   <div className="text-5xl font-black uppercase italic">R$147<span className="text-xs text-black/40 not-italic">/mês</span></div>
                </div>
                <ul className="text-left space-y-4 text-sm font-bold text-black uppercase italic tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 240 Créditos</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Story Carrossel</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Todos os Tipos</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">Escolher Crescimento</button>
             </div>

             {/* COMPLETO */}
             <div className="p-10 rounded-[40px] border border-white/5 bg-black/40 space-y-8 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="space-y-4">
                   <div className="text-xs font-black uppercase tracking-widest text-neutral-500">Completo</div>
                   <div className="text-5xl font-black uppercase italic">R$197<span className="text-xs text-neutral-500 not-italic">/mês</span></div>
                </div>
                <ul className="text-left space-y-4 text-sm font-bold text-neutral-400 uppercase italic tracking-wider">
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> 400 Créditos</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> Blog Incluso</li>
                   <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00BFC6]" /> Suporte VIP</li>
                </ul>
                <button onClick={onGetStarted} className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm transition-all">Começar no Completo</button>
             </div>
          </div>

          <div className="pt-10">
             <button onClick={onGetStarted} className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 hover:text-[#00BFC6] transition-colors underline underline-offset-8 decoration-neutral-800">Ainda em dúvida? Comece com 1 carrossel gratuito →</button>
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
