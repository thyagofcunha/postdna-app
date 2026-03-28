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
  Cpu
} from "lucide-react"

// Mock Data for Social Proof
const testimonials = [
  {
    name: "Duda Ferreira",
    handle: "@duda_mkt",
    content: "O Sherlock economizou 4 horas da minha semana só na primeira análise. É surreal como ele entende o público.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duda",
    date: "12 Mar 2026",
  },
  {
    name: "Carlos Silva",
    handle: "@carlosediting",
    content: "O Designer do PostDNA entrega layouts que eu levaria o dia todo pra fazer. O estilo visual é top de linha.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    date: "15 Mar 2026",
  },
  {
    name: "Dani Almeida",
    handle: "@danimkt_br",
    content: "Finalmente um squad de IA que não parece robótico. As legendas são estratégicas e vendem de verdade.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dani",
    date: "20 Mar 2026",
  },
  {
    name: "Lucas Tech",
    handle: "@lucas_ai",
    content: "A integração dos agentes é o diferencial. Um analisa, outro escreve, outro cria. Fluxo perfeito.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    date: "22 Mar 2026",
  },
]

export default function LandingViewV8({ onGetStarted }) {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const sherlockRef = useRef(null)
  const strategyRef = useRef(null)
  const designerRef = useRef(null)
  const redatorRef = useRef(null)
  const resultRef = useRef(null)

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-[#00BFC6]/30">
      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00BFC6]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="z-10 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C4A]/30 border border-[#00BFC6]/20 text-[#00BFC6] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Zap className="w-3 h-3 animate-pulse" /> PostDNA V8 Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-sora tracking-tight leading-[1.1]">
            PostDNA: O único sistema com seu próprio <br />
            <TypingAnimation 
              className="text-[#00BFC6] inline-block"
              words={["Sherlock Particular", "Squad de Elite", "Designer Estratégico", "Analista de Treeds"]} 
              loop 
              pauseDelay={2000}
            />
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Pare de "tentar" o Camera. Deixe nossos agentes especialistas analisarem seus dados, criarem sua estratégia e entregarem posts que convertem seguidores em clientes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-[#00BFC6] text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,191,198,0.3)]"
            >
              COMEÇAR AGORA
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              VER DEMONSTRAÇÃO
            </button>
          </div>
        </div>

        {/* Safari Mockup Hero */}
        <div className="relative mt-20 max-w-5xl w-full px-4 group">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl">
            <Safari 
              url="app.postdna.com.br" 
              imageSrc="/assets/dashboard-preview.png" // Mockup placeholder
              className="w-full"
            />
            <BorderBeam size={400} duration={12} delay={9} />
          </div>
        </div>
      </section>

      {/* --- ECO-SISTEMA SECTION --- */}
      <section className="py-32 px-4 relative overflow-hidden bg-black/40">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
             <div className="label-mono text-[#00BFC6]">Orbitando seus Resultados</div>
             <h2 className="text-4xl font-bold font-sora">O PostDNA é o Centro <br /> Gravitacional do seu Marketing</h2>
             <p className="text-neutral-400 leading-relaxed">
               Nós conectamos todas as peças. Seus arquétipos, suas referências de design, seus dados de alcance e as tendências do momento orbitam em torno de um único objetivo: Sua Autoridade.
             </p>
             <div className="grid grid-cols-2 gap-4 pt-6">
               <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                 <Shield className="w-5 h-5 text-[#00BFC6] mb-2" />
                 <div className="text-sm font-bold">100% Autoral</div>
                 <div className="text-[10px] text-neutral-500">Sem conteúdo genérico de IA.</div>
               </div>
               <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                 <TrendingUp className="w-5 h-5 text-[#00BFC6] mb-2" />
                 <div className="text-sm font-bold">Data Driven</div>
                 <div className="text-[10px] text-neutral-500">Sherlock analisa o que funciona.</div>
               </div>
             </div>
          </div>

          <div className="relative h-[400px] flex items-center justify-center">
            <div className="relative h-64 w-64 bg-[#00BFC6]/10 rounded-full flex items-center justify-center border border-[#00BFC6]/20">
               <img src="/assets/postdna-icon.svg" className="w-20" alt="PostDNA" /> {/* Placeholder */}
               <div className="absolute inset-0 animate-pulse bg-[#00BFC6]/5 rounded-full" />
            </div>
            
            <OrbitingCircles radius={80} duration={30}>
              <Camera className="w-6 h-6 text-pink-500" />
            </OrbitingCircles>
            <OrbitingCircles radius={140} duration={40} reverse>
              <Users className="w-6 h-6 text-blue-400" />
            </OrbitingCircles>
            <OrbitingCircles radius={190} duration={50}>
              <Cpu className="w-6 h-6 text-[#00BFC6]" />
            </OrbitingCircles>
          </div>
        </div>
      </section>

      {/* --- BENTO SQUAD SECTION --- */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="label-mono text-[#00BFC6]">O Squad trabalhando por você</div>
          <h2 className="text-4xl font-bold font-sora">Do Planejamento à Entrega</h2>
        </div>

        <div className="relative flex flex-col items-center justify-center h-full p-10 bg-black/20 rounded-3xl border border-white/5" ref={containerRef}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full z-10">
            {/* SHERLOCK */}
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5" ref={sherlockRef}>
              <div className="w-12 h-12 rounded-full bg-[#123C4A] flex items-center justify-center">
                <Search className="w-6 h-6 text-[#00BFC6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Sherlock</span>
              <span className="text-[8px] text-neutral-500">Analista de Trends</span>
            </div>

            {/* ESTRATEGISTA */}
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5" ref={strategyRef}>
              <div className="w-12 h-12 rounded-full bg-[#123C4A] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#00BFC6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Estrategista</span>
              <span className="text-[8px] text-neutral-500">Dani Almeida</span>
            </div>

            {/* DESIGNER */}
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5" ref={designerRef}>
              <div className="w-12 h-12 rounded-full bg-[#123C4A] flex items-center justify-center">
                <Palette className="w-6 h-6 text-[#00BFC6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Designer</span>
              <span className="text-[8px] text-neutral-500">High-End Layouts</span>
            </div>

            {/* REDATOR */}
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5" ref={redatorRef}>
              <div className="w-12 h-12 rounded-full bg-[#123C4A] flex items-center justify-center">
                <Type className="w-6 h-6 text-[#00BFC6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Redator</span>
              <span className="text-[8px] text-neutral-500">Textos que Vendem</span>
            </div>

            {/* RESULTADO (CENTRAL) */}
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-[#00BFC6] shadow-[0_0_30px_rgba(0,191,198,0.2)]" ref={resultRef}>
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#00BFC6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-black">POST PRONTO</span>
              <span className="text-[8px] text-black/60">Success!</span>
            </div>
          </div>

          {/* Animated Beams connecting agents to Result */}
          <AnimatedBeam containerRef={containerRef} fromRef={sherlockRef} toRef={resultRef} />
          <AnimatedBeam containerRef={containerRef} fromRef={strategyRef} toRef={resultRef} curvature={20} />
          <AnimatedBeam containerRef={containerRef} fromRef={designerRef} toRef={resultRef} curvature={-20} />
          <AnimatedBeam containerRef={containerRef} fromRef={redatorRef} toRef={resultRef} duration={5} />
        </div>
      </section>

      {/* --- SOCIAL PROOF MARQUEE --- */}
      <section className="py-32 overflow-hidden bg-black/40">
        <div className="text-center mb-16 px-4">
          <div className="label-mono text-[#00BFC6]">Prova Social</div>
          <h2 className="text-3xl font-bold font-sora">O que os Criadores de Elite dizem</h2>
        </div>
        
        <Marquee pauseOnHover className="[--duration:30s] mb-12">
          {testimonials.map((t) => (
            <TweetCard key={t.handle} {...t} />
          ))}
        </Marquee>
        
        <Marquee reverse pauseOnHover className="[--duration:25s]">
          {testimonials.map((t) => (
            <TweetCard key={t.handle} {...t} />
          ))}
        </Marquee>
      </section>

      {/* --- FOOTER CTA SECTION --- */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 z-10 relative">
          <h2 className="text-4xl md:text-6xl font-bold font-sora tracking-tight">
            Pronto para colocar sua marca em outro patamar?
          </h2>
          <p className="text-neutral-400 text-lg">
             Entre para o grupo exclusivo de quem usa inteligência de verdade.
          </p>
          <div className="pt-6">
             <button 
              onClick={onGetStarted}
              className="px-12 py-5 bg-[#00BFC6] text-black font-extrabold rounded-2xl text-xl hover:scale-110 transition-transform shadow-[0_0_50px_rgba(0,191,198,0.4)]"
             >
                CRIAR MEU SQUAD GRÁTIS
             </button>
          </div>
        </div>

        {/* iPhone Mockup Floating */}
        <div className="absolute -bottom-40 right-10 w-[300px] rotate-[15deg] opacity-20 hidden md:block">
           <Iphone src="/assets/mobile-preview.png" />
        </div>
        <div className="absolute -bottom-40 left-10 w-[300px] -rotate-[15deg] opacity-20 hidden md:block">
           <Iphone src="/assets/mobile-preview.png" />
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 text-center text-[10px] text-neutral-600 tracking-widest uppercase">
        © 2026 POSTDNA ENGINE. TODOS OS DIREITOS RESERVADOS.
      </footer>
    </div>
  )
}
