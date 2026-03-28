import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Check, Star, Shield, Clock, 
  ChevronDown, Layers, Search, Download, 
  MessageSquare, Layout, TrendingUp, Globe,
  Users, ArrowRight, User, Camera, Lock, Palette
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'annual'
  const [openFaq, setOpenFaq] = useState(null);

  const priceDiscount = 0.8; // 20% off

  const plans = [
    { 
      id: 'basico', 
      name: 'BÁSICO', 
      price: 67, 
      credits: 80, 
      features: ['Carrossel Feed', 'Post Estático', 'Stories Simples', 'Suporte via Ticktet'],
      limit: '80 créditos mensais'
    },
    { 
      id: 'crescimento', 
      name: 'CRESCIMENTO', 
      price: 147, 
      credits: 240, 
      features: ['Todos do Básico', 'Carrossel de Stories', 'Prioridade em novos recursos', 'Suporte Prioritário'],
      popular: true,
      limit: '240 créditos mensais'
    },
    { 
      id: 'completo', 
      name: 'COMPLETO', 
      price: 197, 
      credits: 400, 
      features: ['Todos do Crescimento', 'Gerador de Blog (Artigos)', '8 créditos por artigo', 'Suporte VIP'],
      limit: '400 créditos mensais'
    }
  ];

  const faqs = [
    { q: "O conteúdo gerado vai parecer feito por IA?", a: "Não — o conteúdo é criado com a identidade visual real da sua marca, tom de voz personalizado e pesquisa de mercado estratégica. Não é um template genérico." },
    { q: "Funciona para qualquer nicho?", a: "Sim. O Sherlock pesquisa tendências específicas do seu segmento e analisa concorrência antes de sugerir temas ou criar o copy." },
    { q: "Preciso saber usar Canva ou Photoshop?", a: "Não. Você configura o DNA da sua marca uma única vez e o PostDNA aplica cores, logo e fontes em tudo automaticamente." },
    { q: "O que acontece se eu cancelar?", a: "Você pode cancelar a qualquer momento sem burocracia. Seus conteúdos aprovados ficam disponíveis para download por até 30 dias após o cancelamento." },
    { q: "Qual a diferença entre os planos?", a: "A principal diferença está no saldo de créditos mensais e no acesso à criação de artigos para Blog no plano Completo. A qualidade da IA é idêntica em todos." }
  ];

  return (
    <div className="bg-[#060606] text-white selection:bg-[#c4973b]/20 overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c4973b]/10 rounded-full blur-[120px] opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#c4973b]"
          >
            <Zap size={12} fill="currentColor" /> Powered by Multi-Agent IA
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black uppercase italic italic tracking-tighter leading-[0.9] text-white"
          >
            Pare de pagar designer.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c4973b] to-white/50">Comece a criar com o seu DNA.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed"
          >
            PostDNA usa inteligência artificial para criar carrosséis, posts e artigos com a identidade visual da sua marca — em minutos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <button 
              onClick={onGetStarted}
              className="gold-gradient px-12 py-6 rounded-[28px] text-black font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#c4973b]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
              Criar meu primeiro post grátis <ArrowRight size={20} />
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Sem cartão de crédito · Sem compromisso</p>
          </motion.div>

          {/* SIMULATED PIPELINE GIF/ANIMATION PLACEHOLDER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl rounded-[40px] border-8 border-white/5 bg-white/5 aspect-video overflow-hidden shadow-2xl flex items-center justify-center group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-[#c4973b]/20 via-transparent to-transparent opacity-30" />
             <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                   {['Sherlock', 'Designer', 'Revisor'].map((agent, i) => (
                     <div key={i} className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse`} style={{ animationDelay: `${i * 200}ms` }}>
                       <Zap size={20} className="text-gray-500" />
                     </div>
                   ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Assistindo o Squad em ação...</p>
             </div>
             {/* Em produção aqui haveria um vídeo real */}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: PROVA SOCIAL */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060606] bg-gray-800" />)}
            </div>
            <div>
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white">+1.200 marcas criativas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Clock className="text-[#c4973b]" size={20} />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Conteúdo em menos de 3 minutos</p>
          </div>
          <div className="flex items-center gap-3">
             <Shield className="text-green-500" size={20} />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">7 dias de garantia total</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMO FUNCIONA */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Três passos. Sem complicação.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              step: '01', 
              title: 'Configure o DNA', 
              desc: 'Logo, cores e tom de voz. Uma única vez. O PostDNA aplica em tudo automaticamente.',
              icon: <Palette size={32} />
            },
            { 
              step: '02', 
              title: 'Escolha o que criar', 
              desc: 'Carrossel, story ou artigo. O Sherlock pesquisa tendências antes de abrir o canvas.',
              icon: <Layout size={32} />
            },
            { 
              step: '03', 
              title: 'Revise e Baixe', 
              desc: 'O conteúdo nasce pronto com a sua identidade. Edite o que quiser e baixe em alta resolução.',
              icon: <Download size={32} />
            }
          ].map((item, i) => (
            <div key={i} className="group p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#c4973b]/20 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-[#c4973b]/10 text-[#c4973b] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-[#c4973b] font-black text-xs mb-2 tracking-widest">{item.step}</p>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{item.title}</h4>
              <p className="text-gray-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: DEMO VISUAL (Antes e Depois) */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Veja funcionando</h2>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Transformação visual instantânea</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="p-2 label bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest w-fit rounded-lg">Sem PostDNA</div>
              <div className="aspect-square bg-white shadow-inner rounded-[32px] p-12 flex flex-col justify-center gap-4">
                 <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                 <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                 <div className="h-20 w-full bg-gray-50 rounded" />
                 <p className="text-gray-400 text-xs text-center uppercase tracking-widest">Post genérico sem alma</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-2 label bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest w-fit rounded-lg">Com PostDNA</div>
              <div className="aspect-square gold-gradient rounded-[40px] p-12 flex flex-col justify-end relative overflow-hidden shadow-2xl">
                 <div className="absolute top-10 right-10 w-12 h-12 bg-white/20 rounded-xl" />
                 <div className="space-y-4 relative z-10 text-black">
                    <h4 className="text-4xl font-black uppercase italic leading-none tracking-tighter">O SEGREDO DA<br/>CONVERSÃO</h4>
                    <p className="text-sm font-black uppercase tracking-widest opacity-60">Identidade Visual Única</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-10">
            <button onClick={onGetStarted} className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
              Criar meu primeiro post grátis →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMPARATIVO */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-center mb-16 px-4">Quanto você está gastando hoje?</h2>
        <div className="overflow-x-auto rounded-[40px] border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-600">Critério</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-[#c4973b]">Agência / Designer</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white">PostDNA IA</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold uppercase tracking-widest">
              {[
                { label: 'Custo mensal', col1: 'R$800 a R$3000', col2: 'A partir de R$67' },
                { label: 'Prazo entrega', col1: '2 a 5 dias', col2: 'Segundos' },
                { label: 'Brief semanal', col1: 'Toda semana', col2: 'Configura 1 vez' },
                { label: 'Disponibilidade', col1: 'Horário Comercial', col2: '24 horas' },
                { label: 'Identidade', col1: 'Depende do profissional', col2: 'Sempre consistente' },
                { label: 'Independência', col1: 'Não — você depende dele', col2: 'Sim — total autonomia' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                   <td className="p-8 text-gray-500">{row.label}</td>
                   <td className="p-8 text-gray-400">{row.col1}</td>
                   <td className="p-8 text-white">{row.col2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 6: PLANOS */}
      <section id="planos" className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Escolha seu plano</h2>
            
            {/* Toggle Billing */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-[10px] font-black uppercase transition-all ${billing === 'monthly' ? 'text-white' : 'text-gray-600'}`}>Mensal</span>
              <button 
                onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 flex items-center relative transition-all"
              >
                <div className={`w-6 h-6 rounded-full bg-[#c4973b] transition-all transform ${billing === 'annual' ? 'translate-x-[24px]' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[10px] font-black uppercase transition-all ${billing === 'annual' ? 'text-[#c4973b]' : 'text-gray-600'}`}>
                Anual <span className="text-[8px] bg-[#c4973b]/10 px-2 py-0.5 rounded-full ml-1">-20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div key={p.id} className={`relative p-10 rounded-[48px] border flex flex-col justify-between group transition-all ${p.popular ? 'bg-white/[0.03] border-[#c4973b]/40 shadow-2xl shadow-[#c4973b]/5 scale-105 z-10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-[#c4973b] text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                    MAIS POPULAR ⭐
                  </div>
                )}
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4973b]">{p.name}</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black italic tracking-tighter">R${billing === 'annual' ? Math.floor(p.price * priceDiscount) : p.price}</span>
                       <span className="text-xs font-bold text-gray-500 uppercase">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <Zap size={14} className="text-[#c4973b]" />
                        <span className="text-xs font-black uppercase italic">{p.limit}</span>
                     </div>
                     <div className="space-y-3 pt-6 border-t border-white/5">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-4 text-xs font-bold text-gray-400 leading-snug">
                            <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                            {f}
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <button 
                  onClick={onGetStarted}
                  className={`mt-10 w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${p.popular ? 'gold-gradient text-black shadow-xl shadow-[#c4973b]/10' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                >
                  Começar agora
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
            Ainda em dúvida? <button onClick={onGetStarted} className="text-white underline hover:text-[#c4973b]">Comece com 1 carrossel gratuito</button> — Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* SECTION 7: DEPOIMENTOS */}
      <section className="py-32 px-6 max-w-6xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { name: "Mariana Silva", niche: "Nutricionista", text: "Eu gastava horas tentando fazer posts bonitos no Canva e nunca ficavam bons. O PostDNA resolveu minha vida em 2 minutos." },
             { name: "Lucas Mendes", niche: "E-commerce", text: "Ter o Sherlock pesquisando o que meus concorrentes estão postando antes de o Designer criar meus carrosséis é trapaça. Sensacional." },
             { name: "Dra. Ana Paula", niche: "Médica", text: "A identidade visual da minha clínica finalmente está consistente em todos os posts. O custo-benefício é incomparável com agência." }
           ].map((d, i) => (
             <div key={i} className="space-y-6">
                <div className="flex text-[#c4973b]">
                   {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg font-bold text-gray-300 italic">"{d.text}"</p>
                <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
                   <div>
                      <p className="text-[10px] font-black uppercase text-white leading-none">{d.name}</p>
                      <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mt-1">{d.niche}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* SECTION 8: GARANTIA */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8 glass p-16 rounded-[48px] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c4973b]/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 rounded-3xl bg-[#c4973b]/10 text-[#c4973b] flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
             <Shield size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">7 dias de garantia total</h3>
            <p className="text-gray-500 font-bold leading-relaxed max-w-md mx-auto">
              Se o PostDNA não entregar o que prometemos, devolvemos 100% do valor pago. Sem formulário, sem burocracia, sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-32 px-6 max-w-3xl mx-auto space-y-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center italic">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-white/5 rounded-3xl overflow-hidden transition-all bg-white/[0.01]">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all"
              >
                <span className="text-sm font-black uppercase tracking-widest text-white leading-relaxed">{f.q}</span>
                <ChevronDown className={`text-[#c4973b] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="px-8 pb-8"
                  >
                    <p className="text-[12px] font-bold text-gray-500 leading-relaxed border-t border-white/5 pt-6 italic">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: CTA FINAL */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto gold-gradient p-16 rounded-[48px] text-center space-y-10 relative overflow-hidden shadow-2xl shadow-[#c4973b]/20">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] pointer-events-none" />
           <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-black uppercase leading-tight">Sua marca merece<br/>conteúdo profissional. Todo dia.</h2>
              <p className="text-black/60 font-black uppercase tracking-widest text-[10px]">Prepare-se para dominar seu nicho em minutos.</p>
           </div>
           <div className="flex flex-col items-center gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-black text-white px-12 py-6 rounded-[28px] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                Criar meu primeiro post grátis <ArrowRight size={20} />
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Sem cartão · Sem compromisso · Pronto em minutos</p>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-white/[0.01]">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black">
                    <Zap size={22} fill="white" />
                  </div>
                  <span className="text-2xl font-black uppercase italic italic tracking-tighter">PostDNA</span>
              </div>
              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] max-w-xs">Dominância visual com inteligência de mercado integrada.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">PRODUTO</p>
                  <div className="flex flex-col gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <button className="hover:text-white transition-colors text-left" onClick={() => document.getElementById('planos').scrollIntoView({behavior:'smooth'})}>Planos</button>
                    <button className="hover:text-white transition-colors text-left">Funcionalidades</button>
                    <button className="hover:text-white transition-colors text-left">FAQ</button>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">LEGAL</p>
                  <div className="flex flex-col gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <button className="hover:text-white transition-colors text-left">Termos</button>
                    <button className="hover:text-white transition-colors text-left">Privacidade</button>
                  </div>
               </div>
               <div className="space-y-4 col-span-2 md:col-span-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#c4973b]">IDIOMA</p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <button className="text-[10px] font-black uppercase text-white">PT-BR</button>
                    <button className="text-[10px] font-black uppercase text-gray-700 hover:text-white transition-colors">ES</button>
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
