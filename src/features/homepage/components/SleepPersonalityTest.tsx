'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PersonalityTestProps {
    onComplete: (personality: string) => void;
}

export const SleepPersonalityTest = ({ onComplete }: PersonalityTestProps) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const questions = [
        {
            question: t('howDoYouFeelMorning'),
            options: [
                { label: t('energetic'), value: 'owl' },
                { label: t('tired'), value: 'bear' },
                { label: t('relaxed'), value: 'dolphin' },
            ],
        },
        {
            question: t('idealEnvironment'),
            options: [
                { label: t('pitchBlack'), value: 'quiet' },
                { label: t('softLight'), value: 'calm' },
                { label: t('natureSound'), value: 'nature' },
            ],
        },
    ];

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Logic to determine personality
            const result = newAnswers.includes('owl') ? 'Creative Owl' : 'Peaceful Bear';
            onComplete(result);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl max-w-md w-full border border-white/20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <h3 className="text-2xl font-bold text-white text-center">
                        {questions[step].question}
                    </h3>
                    <div className="grid gap-4">
                        {questions[step].options.map((opt) => (
                            <motion.button
                                key={opt.value}
                                onClick={() => handleAnswer(opt.value)}
                                className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors text-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
