import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const SleepExperience = () => {
    const { t } = useTranslation();
    const [showCalculator, setShowCalculator] = useState(false);
    const [showMattressTest, setShowMattressTest] = useState(false);

    return (
        <section className="py-32 px-4 relative overflow-hidden">
            {/* Interactive Modal (Overlay) */}
            <AnimatePresence>
                {(showCalculator || showMattressTest) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            className="bg-white/10 border border-white/20 p-12 rounded-[3rem] max-w-2xl w-full relative"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                        >
                            <button
                                onClick={() => { setShowCalculator(false); setShowMattressTest(false); }}
                                className="absolute top-8 right-8 text-white/40 hover:text-white"
                            >
                                ✕ Close
                            </button>

                            <h3 className="text-3xl font-black text-white mb-6">
                                {showCalculator ? t('sleepQualityCalculator') : t('mattressSelectionTest')}
                            </h3>
                            <p className="text-white/60 mb-8">
                                {showCalculator ? t('calcDesc') : t('mattressDesc')}
                            </p>

                            <div className="space-y-4">
                                {[1, 2, 3].map(q => (
                                    <button key={q} className="w-full bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 text-left text-white transition-all">
                                        Option {q} for {showCalculator ? 'Daily Habit' : 'Sleep Position'}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-6 block font-bold">
                        {t('theUltimateStep')}
                    </span>
                    <h2 className="text-6xl md:text-7xl font-black text-white mb-10 leading-[1.1]">
                        {t('startNewLifeNow')}
                    </h2>
                    <p className="text-2xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed">
                        {t('sleepExpDesc')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                        <h3 className="font-bold text-white mb-4">{t('sleepMusic')}</h3>
                        <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all mx-auto text-2xl">
                            ▶️
                        </button>
                    </div>
                    <motion.div
                        className="p-8 bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-white/10 backdrop-blur-md cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowMattressTest(true)}
                    >
                        <h3 className="font-bold text-white mb-4">{t('mattressTest')}</h3>
                        <button className="text-blue-400 font-bold hover:underline">
                            {t('startTest')} →
                        </button>
                    </motion.div>
                    <motion.div
                        className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowCalculator(true)}
                    >
                        <h3 className="font-bold text-white mb-4">{t('sleepQuality')}</h3>
                        <p className="text-white/40 text-sm italic">{t('calculateYourScore')}</p>
                    </motion.div>
                </div>

                <motion.button
                    className="px-16 py-7 bg-white text-black text-3xl font-black rounded-full shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform active:scale-95"
                    whileHover={{ y: -5 }}
                >
                    {t('initiateSequence')}
                </motion.button>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="text-white/30 uppercase tracking-widest text-xs">
                        {t('noCreditCardRequired')}
                    </p>
                    <button className="bg-white/5 hover:bg-white/10 text-white/60 px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-white/10 transition-all">
                        💎 {t('sleepImproveSubscription')}
                    </button>
                </div>
            </div>
        </section>
    );
};
