'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const VisualShowcase = () => {
    const { t } = useTranslation();
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        { title: t('designing'), desc: t('designingDesc'), icon: '✏️' },
        { title: t('woodSelection'), desc: t('woodSelectionDesc'), icon: '🪚' },
        { title: t('handcrafting'), desc: t('handcraftingDesc'), icon: '🔨' },
        { title: t('finalCheck'), desc: t('finalCheckDesc'), icon: '✨' },
    ];

    return (
        <section className="py-24 px-4 bg-linear-to-b from-white/5 to-transparent">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                        🎥 {t('immersiveShowcase')}
                    </h2>
                    <p className="text-white/40">{t('experienceBeforeBuy')}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 360 View Placeholder */}
                    <div className="lg:col-span-2 aspect-video bg-black/40 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <motion.div
                                    className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="mt-4 text-white/30 uppercase tracking-[0.3em] text-[10px]">{t('loading360Engine')}</p>
                            </div>
                        </div>

                        <div className="absolute top-8 left-8 flex gap-3">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">LIVE 360°</span>
                            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">4K HDR</span>
                        </div>

                        <div className="absolute bottom-8 right-8 flex gap-4">
                            <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20">☀️</button>
                            <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20">🌙</button>
                        </div>
                    </div>

                    {/* Manufacturing Stages */}
                    <div className="space-y-4">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 h-full">
                            <h3 className="text-xl font-bold text-white mb-8">🛠️ {t('manufacturingStages')}</h3>
                            <div className="space-y-6">
                                {stages.map((stage, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeStage === idx ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent opacity-40 grayscale'
                                            }`}
                                        onClick={() => setActiveStage(idx)}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <span className="text-2xl">{stage.icon}</span>
                                            <div>
                                                <p className="font-bold text-white text-sm">{stage.title}</p>
                                                <p className="text-[10px] text-white/50 leading-tight mt-1">{stage.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Before and After Section */}
                <div className="mt-20 grid md:grid-cols-2 gap-8">
                    <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border border-white/5">
                        <div className="absolute inset-x-8 top-8 z-10">
                            <span className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest">{t('before')}</span>
                        </div>
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center italic text-white/20">
                            Empty Space Visual
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl">
                        <div className="absolute inset-x-8 top-8 z-10">
                            <span className="bg-blue-600 px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest">{t('after')}</span>
                        </div>
                        <div className="w-full h-full bg-linear-to-br from-blue-900 to-black flex items-center justify-center italic text-white/40">
                            Dreamroom Visual
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
