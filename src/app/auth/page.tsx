'use client';

import { AuthHub } from '../../features/auth/components/AuthHub';
import { motion } from 'framer-motion';

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
            >
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <AuthHub />
            </motion.div>

            {/* Footer Info */}
            <div className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] font-black text-white/10 z-10 text-center">
                AES-256 Multi-Layered Cryptography • DreamEngine Security v4
            </div>
        </div>
    );
}
