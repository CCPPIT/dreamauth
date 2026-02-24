'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useRoomStore } from '@/infrastructure/storage/stores/room-store';

export const AILayoutEngine = () => {
    const { t } = useTranslation();
    const { length, width, furniture } = useRoomStore();
    const [isArranging, setIsArranging] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'standard' | 'fengshui' | 'minimalist'>('standard');
    const [showFuture, setShowFuture] = useState(false);

    const startAutoArrangement = () => {
        setIsArranging(true);
        setTimeout(() => setIsArranging(false), 2000);
    };

    return (
        <section className="py-24 px-4 max-w-6xl mx-auto border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-6">
                        🤖 {t('aiLayoutEngine')}
                    </h2>
                    <p className="text-white/50 mb-8 max-w-md">
                        {t('aiLayoutDesc')}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-10">
                        {['standard', 'fengshui', 'minimalist'].map(m => (
                            <button
                                key={m}
                                onClick={() => setLayoutMode(m as any)}
                                className={`px-6 py-3 rounded-2xl border transition-all ${layoutMode === m ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40'
                                    }`}
                            >
                                {t(m)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={startAutoArrangement}
                        disabled={isArranging}
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        {isArranging ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, ease: "linear" }}
                            >
                                ⚙️
                            </motion.span>
                        ) : '✨'}
                        {isArranging ? t('arranging') : t('optimizeLayoutNow')}
                    </button>
                </div>

                <div className="relative aspect-square bg-white/5 rounded-[3rem] border border-white/10 p-12 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={layoutMode + (isArranging ? 'arr' : 'idle')}
                            className="w-full h-full relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                        >
                            {/* Simulated Furniture Blocks */}
                            <motion.div
                                className="absolute bg-blue-500/40 border border-blue-400 rounded-2xl flex items-center justify-center p-4 shadow-2xl"
                                animate={isArranging ? { x: [0, 20, -10, 0], y: [0, -20, 10, 0] } : {}}
                                style={{
                                    width: '60%',
                                    height: '40%',
                                    left: layoutMode === 'fengshui' ? '20%' : '10%',
                                    top: layoutMode === 'fengshui' ? '40%' : '10%'
                                }}
                            >
                                <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Bed</span>
                            </motion.div>

                            <motion.div
                                className="absolute bg-purple-500/40 border border-purple-400 rounded-xl"
                                animate={isArranging ? { x: [0, -20, 10, 0], y: [0, 20, -10, 0] } : {}}
                                style={{
                                    width: '20%',
                                    height: '20%',
                                    right: '10%',
                                    top: layoutMode === 'minimalist' ? '60%' : '20%'
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <div>
                                <p className="text-[10px] uppercase text-white/40 tracking-widest">{t('layoutEfficiency')}</p>
                                <p className="text-xl font-bold text-white">94%</p>
                            </div>
                            <button
                                onClick={() => setShowFuture(!showFuture)}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs transition-colors"
                            >
                                🔮 {t('predict3Years')}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFuture && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-blue-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12 z-20"
                            >
                                <div className="mb-6 text-6xl">✨</div>
                                <h3 className="text-2xl font-black text-white mb-4">{t('futurePredictionTitle')}</h3>
                                <p className="text-white/60 mb-8">
                                    {t('futurePredictionDesc')}
                                </p>
                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 w-full">
                                    <p className="text-sm font-bold text-blue-400 uppercase mb-2">Outcome: High Longevity</p>
                                    <p className="text-xs text-white/40">"This configuration remains 88% efficient as your lifestyle evolves."</p>
                                </div>
                                <button
                                    onClick={() => setShowFuture(false)}
                                    className="mt-8 text-white/40 hover:text-white transition-colors uppercase text-[10px] tracking-widest"
                                >
                                    Close Vision
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
