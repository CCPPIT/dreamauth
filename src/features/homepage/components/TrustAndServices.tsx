'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const TrustAndServices = () => {
    const { t } = useTranslation();

    const stats = [
        { label: t('roomsSoldToday'), value: '24', icon: '🏠' },
        { label: t('customerSatisfaction'), value: '99.2%', icon: '⭐️' },
        { label: t('avgDeliveryTime'), value: '3 ' + t('days'), icon: '🚚' },
        { label: t('installationSpeed'), value: '45 ' + t('mins'), icon: '🛠️' },
    ];

    return (
        <section className="py-24 px-4 bg-white/5">
            <div className="max-w-6xl mx-auto">
                {/* Psychological Impact Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            className="text-center p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <span className="text-4xl mb-4 block">{stat.icon}</span>
                            <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
                            <p className="text-sm uppercase tracking-widest text-white/40">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Trust Section */}
                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold text-white">{t('whyDreamEngine')}</h2>
                        <div className="space-y-6">
                            {[
                                { title: t('electronicWarranty'), desc: t('warrantyDesc'), detail: '10 Years Full Coverage' },
                                { title: t('realTimeTracking'), desc: t('trackingDesc'), detail: 'Manufacturing Stage GPS' },
                                { title: t('clearReturnPolicy'), desc: t('returnDesc'), detail: '30 Days No Questions Asked' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex gap-6 group cursor-default"
                                    whileHover={{ x: 10 }}
                                >
                                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                        <p className="text-white/50 leading-relaxed mb-2">{item.desc}</p>
                                        <span className="text-[10px] uppercase tracking-widest text-blue-400/60 font-black">{item.detail}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Video Testimonials */}
                        <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl shrink-0">🎬</div>
                            <div>
                                <p className="text-white font-bold">{t('watchCustomerStories')}</p>
                                <p className="text-white/40 text-xs">Over 500+ Video Reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="bg-linear-to-br from-blue-600/10 to-purple-600/10 p-12 rounded-[3rem] border border-white/20">
                        <h2 className="text-3xl font-bold text-white mb-8">{t('exclusiveServices')}</h2>
                        <ul className="space-y-4 mb-10">
                            {[
                                t('freeDelivery'),
                                t('freeInstallation'),
                                t('postInstallCleanup'),
                                t('annualMaintenance'),
                                t('freeAdjustment30Days')
                            ].map((service, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-white/80">
                                    <span className="text-green-400">✓</span> {service}
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                                <span>💬</span> {t('whatsappSupport')}
                            </button>
                            <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all">
                                {t('scheduleVisit')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
