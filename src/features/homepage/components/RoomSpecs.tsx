'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRoomStore } from '@/infrastructure/storage/stores/room-store';
import { useState } from 'react';

export const RoomSpecs = () => {
    const { t } = useTranslation();
    const { length, width, setLength, setWidth, furniture } = useRoomStore();
    const [error, setError] = useState<string | null>(null);

    const validate = (l: number, w: number) => {
        if (l > 0 && w > 0 && l * w < 5) {
            setError(t('roomTooSmall'));
        } else {
            setError(null);
        }
    };

    const remainingSpace = length * width - furniture.length * 2;

    return (
        <section className="py-24 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-white">{t('roomDimensions')}</h2>
                <p className="text-white/50">{t('enterSpecsDetails')}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/40">{t('lengthMetre')}</label>
                            <input
                                type="number"
                                value={length || ''}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setLength(val);
                                    validate(val, width);
                                }}
                                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white text-xl focus:border-blue-500 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-white/40">{t('widthMetre')}</label>
                            <input
                                type="number"
                                value={width || ''}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setWidth(val);
                                    validate(length, val);
                                }}
                                className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white text-xl focus:border-blue-500 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}

                    <div className="pt-8 border-t border-white/10 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-white/60">{t('totalArea')}</span>
                            <span className="text-white font-bold">{length * width} m²</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">{t('movementSpace')}</span>
                            <span className={`font-bold ${remainingSpace < 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {remainingSpace} m²
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-video bg-black/40 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
                    {/* Visual Simulation Placeholder */}
                    <div
                        className="bg-blue-500/20 border-2 border-blue-500/50 transition-all duration-500"
                        style={{
                            width: `${Math.min(length * 20, 90)}%`,
                            height: `${Math.min(width * 20, 90)}%`
                        }}
                    />
                    <div className="absolute inset-x-8 bottom-8 flex justify-between text-[10px] uppercase tracking-tighter text-white/40">
                        <p>Simulation Engine v1.0</p>
                        <p>Real-time Scaling Active</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
