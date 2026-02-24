'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/infrastructure/storage/stores/user-store';
import { useRoomStore } from '@/infrastructure/storage/stores/room-store';
import { Tabbar } from '@/shared/components/tabbar';
import { Sidebar } from '@/shared/components/sidebar';
import { HeroSection } from './components/HeroSection';
import { SleepPersonalityTest } from './components/SleepPersonalityTest';
import { AIRecommendations } from './components/AIRecommendations';
import { RoomSpecs } from './components/RoomSpecs';
import { SmartOffers } from './components/SmartOffers';
import { TrustAndServices } from './components/TrustAndServices';
import { SleepExperience } from './components/SleepExperience';
import { AILayoutEngine } from './components/AILayoutEngine';
import { VisualShowcase } from './components/VisualShowcase';

export default function Homepage() {
  const { t } = useTranslation();
  const {
    sleepHours, setSleepHours,
    personality, setPersonality,
    age, setAge,
    personalityResult, setPersonalityResult,
    comfortScore, setComfortScore
  } = useUserStore();

  const {
    color, setColor,
    woodType, setWoodType,
    price, updatePrice,
    furniture, addFurniture, removeFurniture,
    length, width, setLength, setWidth
  } = useRoomStore();

  const [background, setBackground] = useState('day');
  const [visitorCount, setVisitorCount] = useState(1234);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enableBreathing, setEnableBreathing] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setBackground(hour < 6 || hour > 18 ? 'night' : 'day');

    // Simulate live visitor counter
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (enableBreathing && typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.current = ctx;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);

      const breathe = () => {
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0.02, now);
        gainNode.gain.exponentialRampToValueAtTime(0.1, now + 2);
        gainNode.gain.exponentialRampToValueAtTime(0.02, now + 4);
      };

      oscillator.start();
      breathe();
      const interval = setInterval(breathe, 4000);

      return () => {
        clearInterval(interval);
        oscillator.stop();
        ctx.close();
      };
    } else if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  }, [enableBreathing]);

  const handlePersonalityComplete = (result: string) => {
    setPersonalityResult(result);
    setComfortScore(85 + Math.floor(Math.random() * 15));
    setShowTest(false);
    setShowAI(true);

    // Smooth scroll to AI section
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${background === 'night'
      ? 'bg-gray-950 text-white'
      : 'bg-blue-50 text-gray-900'
      }`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <motion.button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-2xl">☰</span>
      </motion.button>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!showTest && !showAI ? (
            <HeroSection
              key="hero"
              id="hero"
              onStart={() => setShowTest(true)}
              sleepHours={sleepHours}
              setSleepHours={setSleepHours}
              visitorCount={visitorCount}
            />
          ) : showTest ? (
            <div key="test" className="min-h-screen flex items-center justify-center p-4">
              <SleepPersonalityTest onComplete={handlePersonalityComplete} />
            </div>
          ) : null}
        </AnimatePresence>

        {showAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div id="ai"><AIRecommendations /></div>
            <div id="layout"><AILayoutEngine /></div>
            <div id="specs"><RoomSpecs /></div>
            <div id="showcase"><VisualShowcase /></div>
            <div id="offers"><SmartOffers /></div>

            {/* Live Customization Section */}
            <section id="customize" className="min-h-screen flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-sm border-y border-white/10">
              <h2 className="text-4xl font-bold mb-12">{t('liveCustomization')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full">
                <div className="aspect-square bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center overflow-hidden relative">
                  <motion.div
                    className="w-48 h-48 bg-blue-500 rounded-2xl shadow-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundColor: color }}
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-md p-4 rounded-xl text-center">
                    <p className="text-sm uppercase tracking-widest text-white/60 mb-1">{t('activeDesign')}</p>
                    <p className="font-bold text-white uppercase">{color} {woodType} Bed</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm uppercase tracking-widest text-white/50 mb-3">{t('woodSelection')}</label>
                    <div className="flex gap-4">
                      {['oak', 'pine', 'maple'].map(wood => (
                        <button
                          key={wood}
                          onClick={() => setWoodType(wood)}
                          className={`px-6 py-3 rounded-xl border transition-all ${woodType === wood ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20'
                            }`}
                        >
                          {wood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-widest text-white/50 mb-3">{t('colorSelection')}</label>
                    <div className="flex gap-4">
                      {['blue', 'red', 'green', 'yellow'].map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${color === c ? 'border-white scale-125' : 'border-transparent opacity-50'
                            }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="flex justify-between items-end gap-4 flex-wrap">
                      <div className="flex-1 min-w-[150px]">
                        <p className="text-sm uppercase tracking-widest text-white/50">{t('totalInvestment')}</p>
                        <p className="text-5xl font-black">${price}</p>
                      </div>
                      <div className="flex gap-4">
                        <button className="bg-white/10 text-white p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                          💾 {t('save')}
                        </button>
                        <button className="bg-white/10 text-white p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                          🔗 {t('share')}
                        </button>
                        <button className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                          {t('proceedBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div id="trust"><TrustAndServices /></div>
            <div id="services"><div className="py-2" /></div> {/* Anchor for services */}
            <div id="sleep"><SleepExperience /></div>
          </motion.div>
        )}
      </main>

      <Tabbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Breathing Sound Toggle */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setEnableBreathing(!enableBreathing)}
          className={`p-10 shadow-3xl rounded-3xl backdrop-blur-xl border transition-all ${enableBreathing ? 'bg-blue-600 border-blue-400 rotate-12' : 'bg-white/5 border-white/10 opacity-30 hover:opacity-100'
            }`}
        >
          {enableBreathing ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
}
