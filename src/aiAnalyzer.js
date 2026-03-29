export async function analyzeWebsiteDNA(url) {
  // 1. Fetch text via Jina AI
  const jinaUrl = `https://r.jina.ai/${url}`;
  
  let markdown = '';
  try {
    const res = await fetch(jinaUrl);
    markdown = await res.text();
  } catch (err) {
    console.error("Falha ao ler o site via Jina:", err);
    throw new Error("Não foi possível acessar o site. Ele pode estar bloqueando raspadores de dados.");
  }
  
  if (!markdown || markdown.length < 50) {
    throw new Error("O site parece estar vazio ou não retornou texto o suficiente.");
  }
  
  // Limit to avoid excessive token sizes
  const maxChars = 15000;
  if(markdown.length > maxChars) {
     markdown = markdown.substring(0, maxChars);
  }

  // 2. Fetch from OpenAI
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave VITE_OPENAI_API_KEY não configurada no ambiente local.");
  }

  const prompt = `Você é um Analista de Marcas Sênior operando dentro da plataforma PostDNA AI.
Sua missão é extrair a Identidade Visual e o Comportamento de uma marca a partir da página convertida em Markdown abaixo.

REGRAS CRÍTICAS: 
- Retorne EXATAMENTE UM JSON válido.
- As "colors" devem conter 3 códigos hexadecimais válidos para criar um degradê bonito. O primeiro é uma cor viva e principal baseada na identidade, o segundo é uma cor de fundo escurecida derivada do tema (se for tech escuro) ou bem clarinha, e o último a cor de texto (claro ou escuro dependendo do fundo).

Estrutura JSON esperada:
{
  "colors": ["Hex1", "Hex2", "Hex3"],
  "voice": {
    "formality": <numero 1 a 5>,
    "depth": <numero 1 a 5>,
    "energy": <numero 1 a 5>
  },
  "visualStyle": "<deve ser uma dessas: 'minimalist', 'vibrant', 'corporate', 'warm'>",
  "businessName": "<nome da empresa ou pessoa>",
  "product": "<o que vende, 3 a 5 palavras>",
  "targetAudience": "<para quem vende, 3 a 5 palavras>",
  "mainPain": "<a maior dor que resolve, até 10 palavras>"
}

CONTEÚDO DO SITE:
---
${markdown}
---`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2
      })
    });

    const data = await response.json();
    
    if (data.error) {
       throw new Error(data.error.message || "Erro retornado pela API da OpenAI.");
    }
    
    const result = JSON.parse(data.choices[0].message.content);
    return result;
  } catch (err) {
    console.error("Erro no Sherlock AI:", err);
    throw new Error("Falha ao decodificar a identidade via IA. Verifique sua chave de acesso ou tente colar um link diferente.");
  }
}
export async function generateContent(brand, topic, type, objective = 'EDUCAR', vibe = 'editorial') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("API Key não configurada.");

  // Traduzir objetivos para as fases do OpenSquad
  const funnelMap = {
    'ATRAIR': 'TOPO — Descoberta e identificação',
    'EDUCAR': 'MEIO — Educação e nutrição',
    'VENDER': 'FUNDO — Conversão direta'
  };

  const funnelPhase = funnelMap[objective] || 'EDUCAR';
  const numSlides = (type === 'POST' || type === 'CAPTION') ? 1 : (type === 'STORY_SIMPLE' ? 3 : 8);

  const systemPrompt = `### ROLE: POSTDNA AGENTIC SQUAD
### ROLE: POSTDNA AGENTIC SQUAD (OPEN SQUAD CORE)
Você é o motor de inteligência do PostDNA, obedecendo à hierarquia rigorosa do OpenSquad:

1. **SHERLOCK (Investigação)**: Pesquisa o nicho e identifica tendências virais. Seu output serve de base para o Estrategista.
2. **ESTRATEGISTA (Estrutura)**: Define a jornada do usuário em cada slide (Gancho, Retenção, Autoridade, CTA).
3. **COPYWRITER (Texto)**: Escreve headlines massivas (90px+) e corpos de texto ultra-concisos (Máx 15 palavras por slide).
4. **DESIGNER (Direction)**: Escolha layouts cinematográficos (EDITORIAL), reflexivos (MINIMALIST) ou sociais (TWEET).
5. **REVISOR (Qualidade)**: Audita o conteúdo final, garantindo que os limites de texto, tom de voz e estilo visual da marca sejam obedecidos.

### DNA DA MARCA:
- NOME: ${brand.businessName}
- PRODUTO: ${brand.product} e Soluções.
- PÚBLICO: ${brand.targetAudience}
- VOZ: Formalidade(${brand.voice?.formality}/5), Profundidade(${brand.voice?.depth}/5), Energia(${brand.voice?.energy}/5)
- ESTILO: ${brand.visualStyle} (Cores da marca: ${brand.colors?.join(', ')})

### BRIEFING DO CONTEÚDO:
- TEMA: "${topic}"
- FORMATO: ${type}
- QUANTIDADE: Gerar exatamente ${numSlides} slides no array.
- PHASE: ${funnelPhase}
- ESTILO VISUAL REQUERIDO: ${vibe.toUpperCase()}

### REGRAS CRÍTICAS DO SQUAD:
1. **Sherlock**: Identifique o gatilho emocional para este objetivo.
2. **Estrategista**: Se o Estilo for TWEET, use frases curtas e provocativas. Se for EDITORIAL, foque em narrativa visual.
3. **Copy**: Adapte o tom para ${vibe}. Máx 12 palavras por slide.
4. **Designer**: Use OBRIGATORIAMENTE o layout "${vibe}" na maioria dos slides.
5. **Revisor**: Verifique se o ${vibe} está sendo respeitado.

### FORMATO DE SAÍDA (JSON):
{
  "topic": "${topic}",
  "type": "${type}",
  "content": "Markdown body (APENAS se for BLOG)",
  "slides": [
    {
      "index": 1,
      "headline": "Título Impactante",
      "body": "Texto curto",
      "layout": "editorial | minimalist | tweet",
      "imageTheme": "English keyword for Unsplash"
    }
  ],
  "caption": "Legenda com 5 hashtags."
}`;


  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Gere o conteúdo para o tema: ${topic}` }],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    // Mapear para o formato interno do App.jsx
    return {
      ...content,
      id: Date.now(),
      status: 'Aguardando revisão',
      date: new Date().toISOString().split('T')[0],
      slides: (content.slides || []).map((s, i) => {
        const randomSeed = Math.floor(Math.random() * 1000000);
        return {
          ...s,
          type: 'text_image',
          // Usar Picsum com seed único para estabilidade extrema
          image: `https://picsum.photos/seed/${randomSeed}/1080/1440`,
          safe_zone: type.includes('STORY'),
          max_lines: type.includes('STORY') ? 4 : 8,
          primaryColor: brand.colors?.[0] || '#00BFC6',
          secondaryColor: brand.colors?.[1] || '#060608',
          textColor: (s.layout === 'editorial' || vibe === 'editorial') ? '#ffffff' : '#00BFC6'
        };
      }),
      hasImages: true
    };
  } catch (err) {
    console.error("Erro na geração de conteúdo:", err);
    throw err;
  }
}

export async function saveContentToSupabase(item) {
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const url = import.meta.env.VITE_SUPABASE_URL;
  
  if (!apiKey || !url) throw new Error("Supabase não configurado.");

  // Mapeamento inteligente de dados baseado no tipo (Blog vs Social)
  const isSocial = item.type !== 'BLOG';
  
  const payload = {
    title: item.topic || "Sem título",
    slug: item.slug || `dna-${item.type.toLowerCase()}-${Date.now()}`,
    // Para Social, salvamos o objeto completo (slides + design) no content
    content: isSocial ? JSON.stringify({ 
      slides: item.slides, 
      design: { 
        vibe: item.vibe, 
        logoPos: item.logoPos,
        logoOpacity: item.logoOpacity 
      } 
    }) : item.content,
    caption: item.caption || null,
    type: item.type,
    summary: item.topic,
    keywords: item.keywords?.join(', ') || null,
    status: 'Aprovado',
    published: item.type === 'BLOG' ? true : false,
    published_at: item.type === 'BLOG' ? new Date().toISOString() : null
  };

  const response = await fetch(`${url}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao salvar no Supabase.");
  }

  return await response.json();
}
