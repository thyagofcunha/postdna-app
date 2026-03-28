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
