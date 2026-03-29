import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function CustomAlert({ isOpen, type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  const icons = {
    warning: <AlertTriangle size={24} className="text-orange-500" />,
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <X size={24} className="text-red-500" />,
    info: <Info size={24} className="text-accent" />
  };

  const isConfirm = !!onCancel;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
        <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}}
          className="glass border border-white/10 rounded-[32px] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            {icons[type] || icons.info}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{title || 'Aviso'}</h3>
            <p className="text-xs text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
              {message}
            </p>
          </div>

          <div className={`flex gap-3 ${isConfirm ? 'justify-between' : 'justify-center'}`}>
            {isConfirm && (
              <button onClick={onCancel}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">
                {cancelText}
              </button>
            )}
            <button onClick={onConfirm}
              className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all shadow-xl ${
                type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 
                'intel-gradient text-black hover:scale-105'
              }`}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
