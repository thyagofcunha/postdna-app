// ─── DNA EXTRACTION UTILS ───────────────────────────────────────────────────

export function lum({r,g,b}) { return 0.2126*r + 0.7152*g + 0.0722*b; }
export function sat({r,g,b}) {
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  return max===0?0:(max-min)/max;
}
export function colorDist(c1,c2) {
  return Math.sqrt(Math.pow(c1.r-c2.r,2)+Math.pow(c1.g-c2.g,2)+Math.pow(c1.b-c2.b,2));
}

export function rgbToHex(r, g, b) {
  const toHex = x => Math.round(x).toString(16).padStart(2, '0');
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

export function kMeans(pixels, k, iterations=10) {
  let centroids = pixels.slice(0,k).map(p=>({...p}));
  let clusters = Array.from({length:k},()=>[]);
  for(let iter=0; iter<iterations; iter++) {
    clusters = Array.from({length:k},()=>[]);
    for(const p of pixels) {
      let minDist=Infinity, bestCent=0;
      for(let i=0; i<k; i++) {
        const d = colorDist(p, centroids[i]);
        if(d < minDist) { minDist=d; bestCent=i; }
      }
      clusters[bestCent].push(p);
    }
    centroids = clusters.map((cl,i) => {
      if(cl.length===0) return centroids[i];
      const sum = cl.reduce((acc,p)=>({r:acc.r+p.r,g:acc.g+p.g,b:acc.b+p.b}),{r:0,g:0,b:0});
      return {r:sum.r/cl.length, g:sum.g/cl.length, b:sum.b/cl.length};
    });
  }
  return clusters.map((cl,i)=>({c:centroids[i],w:cl.length})).filter(x=>x.w>0).sort((a,b)=>b.w-a.w);
}

export function extractDNA(imgEl) {
  const MAX=200, scale=Math.min(1,MAX/Math.max(imgEl.naturalWidth||imgEl.width,1));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round((imgEl.naturalWidth||imgEl.width)*scale);
  canvas.height=Math.round((imgEl.naturalHeight||imgEl.height)*scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl,0,0,canvas.width,canvas.height);
  const {data,width,height}=ctx.getImageData(0,0,canvas.width,canvas.height);
  const mx=Math.floor(width*.05), my=Math.floor(height*.05);
  const pixels=[];
  for(let y=my;y<height-my;y++) for(let x=mx;x<width-mx;x++) {
    const i=(y*width+x)*4, r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
    if(a<128) continue;
    const s=sat({r,g,b}), l=lum({r,g,b});
    if(s<.05&&l>220) continue; 
    pixels.push({r,g,b});
  }
  if (pixels.length<50) return { colors:['#c4973b','#000000','#ffffff'], style:'MODERNO' };
  const step=Math.max(1,Math.floor(pixels.length/3000));
  const sampled=pixels.filter((_,i)=>i%step===0);
  const clusters=kMeans(sampled,5,15);
  if (clusters.length<2) return { colors:['#c4973b','#000000','#ffffff'], style:'MODERNO' };
  const cents=clusters.map(x=>x.c);
  const distinct=[];
  for(const c of cents) {
    // Distância de cor e luminância maior para evitar cores quase iguais
    const dup=distinct.some(d=>colorDist(c,d)<60||Math.abs(lum(c)-lum(d))<15);
    if(!dup) distinct.push(c);
  }
  const bySat=[...distinct].sort((a,b)=>sat(b)-sat(a));
  const byLum=[...distinct].sort((a,b)=>lum(a)-lum(b));
  
  const bg = byLum[0]; // Cor mais escura
  
  // A primária deve ser diferente do fundo e ter boa saturação
  const primaryCandidates = bySat.filter(c => colorDist(c, bg) > 80 && sat(c) > 0.1);
  const primary = primaryCandidates.length > 0 ? primaryCandidates[0] : (colorDist(bySat[0], bg) > 50 ? bySat[0] : bySat[1] || bySat[0]);
  
  const textCand = byLum[byLum.length-1];
  // Se o texto for muito próximo do fundo, força branco
  let textColor = (lum(textCand) - lum(bg) > 100) ? textCand : {r:255,g:255,b:255};
  
  // Garantir que primary, bg e text sejam minimamente diferentes
  if (colorDist(primary, textColor) < 40) textColor = {r:255,g:255,b:255};
  const s=sat(primary), l=lum(primary);
  const style=s>.5?'IMPACTANTE':l<60?'LUXO & ELITE':l>200?'MODERNO & CLEAN':'CORPORATIVO';
  const colors=[rgbToHex(primary.r,primary.g,primary.b),rgbToHex(bg.r,bg.g,bg.b),rgbToHex(textColor.r,textColor.g,textColor.b)];
  return { colors, style };
}
