'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
    id?: string;
    onStart: () => void;
    sleepHours: number | null;
    setSleepHours: (h: number) => void;
    visitorCount: number;
}

export const HeroSection = ({ id, onStart, sleepHours, setSleepHours, visitorCount }: HeroSectionProps) => {
    const { t } = useTranslation();

    return (
        <div id={id} className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-white/50">
                    {t('dreamYourRoom')}
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto italic">
                    "{t('heroTagline')}"
                </p>
            </motion.div>

            <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex flex-col items-center gap-4">
                    <label className="text-white/70 text-lg uppercase tracking-widest">{t('howManyHours')}</label>
                    <input
                        type="range"
                        min="1"
                        max="12"
                        value={sleepHours || 8}
                        onChange={(e) => setSleepHours(Number(e.target.value))}
                        className="w-64 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <span className="text-4xl font-bold text-white">{sleepHours || 8}h</span>
                </div>

                <motion.button
                    onClick={onStart}
                    className="group relative px-12 py-5 bg-white text-black rounded-full text-2xl font-bold shadow-2xl hover:shadow-white/20 transition-all overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10">{t('findRoomIn60Sec')}</span>
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </motion.button>

                <div className="flex items-center gap-3 justify-center text-white/50">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p>{visitorCount} {t('peoplePreparingNow')}</p>
                </div>
            </motion.div>
        </div>
    );
};
