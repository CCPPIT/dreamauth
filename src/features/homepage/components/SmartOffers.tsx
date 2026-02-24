'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export const SmartOffers = () => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <section className="py-24 bg-linear-to-b from-transparent to-white/5">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-linear-to-r from-red-600 to-orange-600 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                    {/* Animated Background Gradients */}
                    <motion.div
                        className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
                                {t('limitedTimeOffer')}
                            </span>
                            <h2 className="text-5xl font-black mb-6 leading-tight">
                                {t('completeIn10Mins')} <br />
                                <span className="text-white/60 text-4xl">{t('getExtraDiscount')}</span>
                            </h2>
                            <div className="flex gap-4 items-center mb-8">
                                <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl text-center min-w-[100px]">
                                    <p className="text-3xl font-black">{minutes}</p>
                                    <p className="text-[10px] uppercase opacity-50">{t('minutes')}</p>
                                </div>
                                <span className="text-2xl font-bold">:</span>
                                <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl text-center min-w-[100px]">
                                    <p className="text-3xl font-black">{String(seconds).padStart(2, '0')}</p>
                                    <p className="text-[10px] uppercase opacity-50">{t('seconds')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                className="bg-white/10 p-6 rounded-2xl border border-white/20"
                                whileHover={{ x: 10 }}
                            >
                                <h3 className="font-bold text-xl mb-1">{t('bundleDeal')}</h3>
                                <p className="text-white/70">{t('roomMattressInstall')}</p>
                            </motion.div>
                            <motion.div
                                className="bg-white/10 p-6 rounded-2xl border border-white/20"
                                whileHover={{ x: 10 }}
                            >
                                <h3 className="font-bold text-xl mb-1">{t('studentWeddingOffer')}</h3>
                                <p className="text-white/70">{t('extra5OffText')}</p>
                            </motion.div>
                            <button className="w-full bg-white text-red-600 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-transform">
                                {t('claimRewardNow')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
