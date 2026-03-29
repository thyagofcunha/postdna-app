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
export async function generateContent(brand, topic, type, objective) {
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

  const systemPrompt = `Você é o OPENSQUAD da Magic Dani (Estrategista + Copywriter + Designer).
Sua missão é gerar um conteúdo de ALTA CONVERSÃO para o Instagram baseado no DNA da marca abaixo.

--- DNA DA MARCA ---
Nome: ${brand.businessName} (O Cara do Jogo)
O que vende: ${brand.product}
Público Alvo: ${brand.targetAudience}
Voz: Formalidade(${brand.voice?.formality}/5), Profundidade(${brand.voice?.depth}/5), Energia(${brand.voice?.energy}/5)
Persona (Dor): ${brand.persona?.mainPain}
Estilo Visual Sugerido: ${brand.visualStyle}
Cores Principais: ${brand.colors?.join(', ')}

--- BRIEFING DO POST ---
Tema: ${topic}
Formato: ${type} (${numSlides} slides/frames)
Fase do Funil: ${funnelPhase}

--- REGRAS DOS AGENTES ---
1. ESTRATEGISTA: Se for TOPO/MEIO, foque em VALOR para o jogador. Não mencione venda. 
2. COPYWRITER: Use o tom da marca. Seja persuasivo e humano. Máximo 15 palavras por slide.
3. DESIGNER: Capa (slide 1) sempre IMPACTANTE para parar o scroll. Alterne layouts entre slides.
4. MOBILE-FIRST: Headlines gigantes e legíveis.

--- FORMATO DE RETORNO (JSON) ---
{
  "topic": "${topic}",
  "type": "${type}",
  "slides": [
    {
      "index": 1,
      "frameType": "hook/context/problem/solution/cta",
      "headline": "Headline curta e potente",
      "body": "Texto de apoio curto",
      "imageTheme": "palavra-chave simples em inglês para imagem (ex: 'soccer field', 'tired player')",
      "layout": "editorial"
    }
  ],
  "caption": "Legenda otimizada com 5 hashtags."
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
          primaryColor: brand.colors?.[0] || '#c4973b',
          secondaryColor: brand.colors?.[1] || '#1a2240',
          textColor: s.layout === 'editorial' ? '#1a2240' : '#ffffff'
        };
      }),
      hasImages: true
    };
  } catch (err) {
    console.error("Erro na geração de conteúdo:", err);
    throw err;
  }
}
