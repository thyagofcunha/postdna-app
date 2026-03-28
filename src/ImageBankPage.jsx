import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Image as ImageIcon, Trash2, Search, Filter, 
  Plus, X, Check, ImagePlus, User, Tag, Layout, Image
} from 'lucide-react';

const ImageBankPage = ({ brand, onUpload, onDelete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  const images = brand.brand_images || [];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files) => {
    setIsUploading(true);
    // Simulação de upload e auto-tagging
    setTimeout(() => {
      const newImages = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        file_name: file.name,
        file_url: URL.createObjectURL(file), // Em produção seria a URL do Supabase
        category: 'other',
        auto_tags: ['imagem', 'upload'], // Simula o resultado da visão computacional
        created_at: new Date().toISOString()
      }));
      onUpload(newImages);
      setIsUploading(false);
    }, 1500);
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         img.auto_tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'product', label: 'Produto', icon: <Plus size={14}/> },
    { id: 'personal', label: 'Pessoal', icon: <User size={14}/> },
    { id: 'brand', label: 'Marca', icon: <Tag size={14}/> },
    { id: 'background', label: 'Fundo', icon: <Layout size={14}/> },
    { id: 'other', label: 'Outros', icon: <Image size={14}/> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & UPLOAD ZONE */}
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-tight">Banco de Imagens</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
              Seu repositório visual conectado ao designer de IA
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="BUSCAR POR TAGS OU NOME..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none focus:border-accent/50 transition-all w-64"
              />
            </div>
            <label className="intel-gradient px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/10 flex items-center gap-2">
              <Upload size={14} /> Fazer Upload
              <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} accept="image/png, image/jpeg, image/webp" />
            </label>
          </div>
        </div>
      </header>

      {/* INFO CARD */}
      <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-[28px] p-6">
         <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">📸</div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">O que é o Banco de Imagens?</h4>
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
               O designer de IA do PostDNA usa estas imagens para criar seus posts. 
               Suba fotos de <strong className="text-white">produto, marca e lifestyle</strong>. 
               Nossa visão computacional irá catalogar as fotos automaticamente para usá-las nos slides corretos.
            </p>
         </div>
      </div>

      {/* DRAG AND DROP AREA */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`h-40 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center transition-all ${
          dragActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02]'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Subindo e catalogando com IA...</span>
          </div>
        ) : (
          <>
            <ImagePlus size={32} className="text-gray-700 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Arraste suas fotos aqui (JPG, PNG ou WebP)</p>
          </>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setCategoryFilter('all')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
            categoryFilter === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
          }`}
        >
          Tudo
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${
              categoryFilter === cat.id ? 'border-cyan-500 text-cyan-500 border-cyan-500' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={img.id}
                className="group relative aspect-square rounded-[24px] overflow-hidden bg-white/5 border border-white/5"
              >
                <img src={img.file_url} alt={img.file_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => onDelete(img.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center backdrop-blur-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-white truncate">{img.file_name}</p>
                    <div className="flex flex-wrap gap-1">
                      {img.auto_tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[6px] font-black uppercase bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-800">
            <ImageIcon size={32} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] max-w-xs">
            Nenhuma imagem ainda. Suba fotos do seu produto, da sua marca ou de você.
          </p>
        </div>
      )}

    </div>
  );
};

export default ImageBankPage;
