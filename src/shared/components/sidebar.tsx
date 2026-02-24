import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  const menuItems = [
    { id: 'hero', label: t('entryExperience'), icon: '✨' },
    { id: 'ai', label: t('aiSmartAnalyzer'), icon: '🧠' },
    { id: 'layout', label: t('aiLayoutEngine'), icon: '🤖' },
    { id: 'customize', label: t('liveCustomization'), icon: '🏠' },
    { id: 'specs', label: t('roomDimensions'), icon: '📏' },
    { id: 'showcase', label: t('immersiveShowcase'), icon: '🎥' },
    { id: 'offers', label: t('smartOffers'), icon: '💰' },
    { id: 'trust', label: t('trustSection'), icon: '📦' },
    { id: 'services', label: t('exclusiveServices'), icon: '🛠️' },
    { id: 'sleep', label: t('sleepExperience'), icon: '🌙' },
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      <motion.div
        className="fixed top-0 left-0 h-full w-80 bg-black/40 backdrop-blur-2xl z-[101] border-r border-white/10 flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <span className="text-xl font-black text-white tracking-widest uppercase">DreamEngine</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
          {/* User Section */}
          {session ? (
            <motion.div
              className="mb-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <img
                  src={session.user?.image || 'https://ui-avatars.com/api/?name=' + session.user?.name}
                  className="w-20 h-20 rounded-full border-2 border-blue-500/50 p-1"
                  alt="User"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
              </div>
              <div>
                <p className="text-white font-black uppercase text-xs tracking-widest">{session.user?.name}</p>
                <p className="text-white/30 text-[9px] uppercase tracking-wider mt-1">{session.user?.email}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-[9px] uppercase font-black text-red-400/60 hover:text-red-400 transition-colors"
              >
                {t('logout')}
              </button>
            </motion.div>
          ) : (
            <Link href="/auth" onClick={onClose}>
              <motion.div
                className="mb-8 p-6 bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4 hover:border-white/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👤</div>
                <div>
                  <p className="text-white font-black uppercase text-xs tracking-widest">{t('loginToDreamEngine')}</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-wider mt-1">{t('syncYourConsciousness')}</p>
                </div>
              </motion.div>
            </Link>
          )}

          {menuItems.map((item, idx) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/10 group"
              whileHover={{ x: 10 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
              <span className="text-sm font-bold text-white/60 group-hover:text-white uppercase tracking-wider">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="p-8 border-t border-white/5">
          <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-2xl">
            <span>🎧</span> {t('aiVoiceAssistant')}
          </button>
        </div>
      </motion.div>
    </>
  );
}
