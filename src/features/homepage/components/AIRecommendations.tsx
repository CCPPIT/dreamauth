'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/infrastructure/storage/stores/user-store';
import { useRoomStore } from '@/infrastructure/storage/stores/room-store';

export const AIRecommendations = () => {
    const { t } = useTranslation();
    const { sleepHours, age, personalityResult, comfortScore } = useUserStore();
    const { budget, mood } = useRoomStore();

    const getRecommendation = () => {
        if (budget < 2000) return t('budgetFriendlyRoom');
        if (mood === 'relaxed') return t('zenSanctuary');
        return t('luxurySuite');
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto py-20 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
                🧠 {t('aiSmartAnalyzer')}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                        <span>✨</span> {t('personalityAnalysis')}
                    </h3>
                    <p className="text-3xl font-bold text-white mb-4">{personalityResult || t('waitingForTest')}</p>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: '85%' }}
                            transition={{ duration: 1.5 }}
                        />
                    </div>
                    <p className="mt-4 text-white/50 text-sm">{t('personalityMatchScore')}: 85%</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-400">
                        <span>💤</span> {t('expectedComfort')}
                    </h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-6xl font-black text-white">{comfortScore || 92}</span>
                        <span className="text-2xl text-white/50 mb-2">/100</span>
                    </div>
                    <p className="text-white/70 italic">
                        "{t('comfortAnalysisText')}"
                    </p>
                </div>
            </div>

            <motion.div
                className="mt-8 bg-linear-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-3xl border border-white/20 text-center"
                whileHover={{ scale: 1.02 }}
            >
                <p className="text-white/60 mb-2 uppercase tracking-tighter text-sm">{t('aiPredictedRoome')}</p>
                <h3 className="text-2xl font-bold text-white uppercase">{getRecommendation()}</h3>
            </motion.div>
        </motion.div>
    );
};
