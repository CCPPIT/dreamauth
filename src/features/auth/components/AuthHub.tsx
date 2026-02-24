import { motion, AnimatePresence } from 'framer-motion';
import { useState, useTransition, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';
import {
    registerAction,
    loginAction,
    sendOTPAction,
    sendEmailOTPAction,
    sendSMSOTPAction,
    sendWhatsAppOTPAction,
    sendPushNotificationAction,
    initiateVoiceVerificationAction,
    generateTOTPSecretAction,
    generateTemporaryQRAction,
    verifySecretQuestionAction,
    verifyTOTPAction,
    unlinkAccountAction,
    syncUserProfileAction,
    sendMagicLinkAction
} from '../actions/auth-actions';
import { useAuthStore } from '../stores/auth-store';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export const AuthHub = () => {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition(); // لضمان سلاسة التنقل بين الحالات
    const { data: session } = useSession(); // جلب بيانات الجلسة الحالية
    const { isSyncing, setSyncing, lastSyncTime, updateSyncTime } = useAuthStore(); // استخدام متجر Zustand للمزامنة
    const [mode, setMode] = useState<'login' | 'register' | 'mfa' | 'success' | 'reset' | 'manage' | 'magic'>('login');
    const [mfaType, setMfaType] = useState<'totp' | 'pushNotify' | 'voiceVerify' | 'secretQuestion' | 'email' | 'sms' | 'whatsapp' | 'tempQR' | 'securityKey'>('email');
    const [mfaStep, setMfaStep] = useState<'select' | 'verify'>('select');
    const [mfaData, setMfaData] = useState<any>(null);
    const [method, setMethod] = useState<'email' | 'phone' | 'social' | 'qr'>('social');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isTrusted, setIsTrusted] = useState(false);
    const [showBiometrics, setShowBiometrics] = useState(false);
    const [biometricType, setBiometricType] = useState<'face' | 'touch'>('face');

    const socialProviders = [
        { id: 'google', name: 'Google', icon: '🌐', color: 'bg-white text-black' },
        { id: 'github', name: 'GitHub', icon: '🐙', color: 'bg-zinc-800 text-white' },
        { id: 'apple', name: 'Apple', icon: '🍎', color: 'bg-black text-white' },
        { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500 text-white' },
    ];

    const toggleBiometrics = (type: 'face' | 'touch') => {
        setBiometricType(type);
        setShowBiometrics(true);
        setTimeout(() => {
            setShowBiometrics(false);
            setMode('success');
        }, 2000);
    };

    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length > 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const handleAuth = () => {
        startTransition(async () => {
            if (mode === 'register') {
                const res = await registerAction({ email, password, name });
                if (res.error) {
                    toast.error(typeof res.error === 'string' ? res.error : t('strongPasswordRequired'));
                } else {
                    toast.success(res.success);
                    setMode('login');
                }
            } else {
                // In a revolutionary system, we move to MFA after credentials
                setMode('mfa');
                setMfaStep('select');
            }
        });
    };

    const handleMFASend = (type: typeof mfaType) => {
        startTransition(async () => {
            let res: any;
            if (type === 'email') res = await sendEmailOTPAction(email);
            else if (type === 'sms') res = await sendSMSOTPAction(phone);
            else if (type === 'whatsapp') res = await sendWhatsAppOTPAction(phone);
            else if (type === 'pushNotify') res = await sendPushNotificationAction(email);
            else if (type === 'voiceVerify') res = await initiateVoiceVerificationAction(phone);
            else if (type === 'totp') res = await generateTOTPSecretAction(email);
            else if (type === 'tempQR') res = await generateTemporaryQRAction();
            else if (type === 'secretQuestion') res = { success: "Paradox Query retrieved" };
            else if (type === 'securityKey') res = { success: "Awaiting Hardware Signal" };

            if (res?.success || res?.secret || res?.qr) {
                if (res.qr) setMfaData(res.qr);
                if (res.qrCodeUrl) setMfaData(res.qrCodeUrl);
                toast.success(res.success || t('protocolTriggered'));
                setMfaStep('verify');
            }
        });
    };

    const handleMFAVerify = (code: string) => {
        startTransition(async () => {
            if (mfaType === 'securityKey') {
                try {
                    // Try to trigger a real WebAuthn prompt (simulated environment might ignore)
                    if (typeof navigator !== 'undefined' && (navigator as any).credentials) {
                        toast.info("Awaiting hardware token signal...");
                    }
                } catch (e) { }
                setTimeout(() => {
                    setMode('success');
                    toast.success(t('verified'));
                }, 3000);
                return;
            }

            let res: any;
            if (mfaType === 'secretQuestion') {
                res = await verifySecretQuestionAction(email, code);
            } else if (mfaType === 'totp') {
                res = await verifyTOTPAction(email, code);
            } else {
                // For other simulated methods
                res = { success: true };
            }

            if (res.success) {
                setMode('success');
                toast.success(t('verified'));
            } else {
                toast.error(res.error || "Verification failed");
            }
        });
    };

    /**
     * مراقبة تنبيهات الهوية (Identity Pulse Alerts)
     * Monitoring identity alerts from the session signal
     */
    useEffect(() => {
        // @ts-ignore
        if (session?.user?.identityAlert) {
            toast.warning(t('emailMismatchAlert'), {
                description: t('emailMismatchDesc'),
                duration: 10000,
                icon: '🛡️'
            });
        }
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
    }, [session, t]);

    /**
     * وظيفة للتعامل مع تسجيل الدخول بدون كلمة مرور (Magic Link)
     * Handling Passwordless Login
     */
    const handleMagicLogin = () => {
        startTransition(async () => {
            const res = await sendMagicLinkAction(email); // استدعاء الأكشن لإرسال الرابط
            if (res.success) {
                toast.success(res.success); // إظهار رسالة النجاح
                setMode('login'); // العودة لصفحة الدخول
            }
        });
    };

    /**
     * وظيفة لمزامنة الملف الشخصي يدوياً
     * Manually Sync Profile
     */
    const handleSync = async () => {
        if (!session?.user?.id) return;
        setSyncing(true); // بدء حالة المزامنة في Zustand
        const res = await syncUserProfileAction(session.user.id);
        if (res.success) {
            updateSyncTime(); // تحديث وقت المزامنة
            toast.success(res.success);
        }
        setSyncing(false); // انتهاء المزامنة
    };

    /**
     * وظيفة لإزالة رابط حساب اجتماعي
     * Unlink Social Account
     */
    const handleUnlink = async (provider: string) => {
        if (!session?.user?.id) return;
        const res = await unlinkAccountAction(session.user.id, provider);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(res.success);
            // إعادة تحديث الجلسة لتعكس التغييرات في الواجهة
            // Force session refresh or manual store update
            window.location.reload();
        }
    };

    const passwordStrength = calculatePasswordStrength(password);

    return (
        <div className="min-h-[600px] w-full max-w-xl p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-3xl flex flex-col relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <AnimatePresence mode="wait">
                {mode === 'mfa' ? (
                    <motion.div
                        key="mfa"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white mb-2">{t('mfaTitle')}</h2>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{t('mfaDesc')}</p>
                        </div>

                        {mfaStep === 'select' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'totp', icon: '🔐' },
                                    { id: 'pushNotify', icon: '📱' },
                                    { id: 'voiceVerify', icon: '🗣️' },
                                    { id: 'secretQuestion', icon: '❓' },
                                    { id: 'email', icon: '📧' },
                                    { id: 'sms', icon: '💬' },
                                    { id: 'whatsapp', icon: '🟢' },
                                    { id: 'tempQR', icon: '🔲' },
                                    { id: 'securityKey', icon: '🔑' },
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            setMfaType(m.id as any);
                                            handleMFASend(m.id as any);
                                        }}
                                        className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{m.icon}</span>
                                        <span className="text-[9px] uppercase font-bold text-white/40 group-hover:text-white transition-colors text-center leading-tight">{t(m.id)}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl text-center">
                                    {mfaType === 'secretQuestion' ? (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-white/80">{t('securityQuestionText')}</p>
                                            <input
                                                type="text"
                                                placeholder={t('securityQuestionHint')}
                                                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white text-center focus:outline-hidden focus:border-blue-500/50"
                                            />
                                        </div>
                                    ) : mfaType === 'totp' || mfaType === 'tempQR' ? (
                                        <div className="space-y-4 flex flex-col items-center">
                                            <div className="w-40 h-40 bg-white p-2 rounded-2xl">
                                                <img src={mfaData || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=DreamEngineMFA_${mfaType}`} alt="QR Code" className="w-full h-full" />
                                            </div>
                                            <p className="text-[10px] uppercase font-bold text-white/40">{t('scanWithApp')}</p>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-32 bg-black/20 border border-white/10 rounded-2xl p-2 text-white text-center text-xl tracking-[0.2em] focus:outline-hidden focus:border-blue-500/50"
                                                placeholder="••••••"
                                            />
                                        </div>
                                    ) : mfaType === 'securityKey' ? (
                                        <div className="py-8 space-y-4">
                                            <div className="text-5xl animate-bounce">🔑</div>
                                            <p className="text-sm text-white/60">{t('insertSecurityKey')}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-xs uppercase tracking-widest text-white/40 font-bold">{t('mfaEnterCode')}</p>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-hidden focus:border-blue-500/50"
                                                placeholder="••••••"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleMFAVerify(otp)}
                                    disabled={isPending || (otp.length < 4 && mfaType !== 'securityKey')}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-sm shadow-2xl disabled:opacity-50"
                                >
                                    {isPending ? '...' : t('verifyBtn')}
                                </button>
                                <button
                                    onClick={() => setMfaStep('select')}
                                    className="w-full text-[10px] uppercase font-bold text-white/20 hover:text-white transition-colors"
                                >
                                    {t('backToProtocols')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : mode === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-5xl">✅</div>
                        <h2 className="text-4xl font-black text-white">{t('welcomeBack')}</h2>
                        <p className="text-white/40">{t('secureSessionActive')}</p>
                        <motion.div className="h-1 w-32 bg-green-500 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </motion.div>
                        <div className="pt-10 space-y-4">
                            <button
                                onClick={() => {
                                    setMode('manage'); // الانتقال لمركز إدارة الحسابات
                                }}
                                className="w-full bg-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all mb-2"
                            >
                                {t('manageAccounts')}
                            </button>
                            <button
                                onClick={() => {
                                    setMode('mfa');
                                    setMfaStep('select');
                                    toast.info(t('mfaReactivationTip'));
                                }}
                                className="text-[10px] uppercase font-black text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400/20 pb-1"
                            >
                                {t('reactivateMFA')}
                            </button>
                        </div>
                    </motion.div>
                ) : mode === 'manage' ? (
                    <motion.div
                        key="manage"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">{t('manageAccounts')}</h2>
                            <p className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em]">{t('linkedAccounts')}</p>
                        </div>

                        <div className="flex-1 space-y-3">
                            {/* عرض الحسابات المرتبطة بشكل ديناميكي */}
                            {socialProviders.map(provider => {
                                // @ts-ignore
                                const isLinked = session?.user?.linkedProviders?.includes(provider.id);
                                return (
                                    <div key={provider.id} className={`p-4 bg-white/5 border rounded-2xl flex items-center justify-between group transition-all ${isLinked ? 'border-green-500/20 bg-green-500/5' : 'border-white/10 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{provider.icon}</span>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase">{provider.name}</p>
                                                <p className={`text-[9px] uppercase tracking-widest font-black ${isLinked ? 'text-green-400' : 'text-white/20'}`}>
                                                    {isLinked ? 'Neural Linked' : t('disconnected')}
                                                </p>
                                            </div>
                                        </div>
                                        {isLinked ? (
                                            <button
                                                onClick={() => handleUnlink(provider.id)}
                                                className="text-[9px] font-black p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase"
                                            >
                                                {t('unlink')}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => signIn(provider.id)}
                                                className="text-[9px] font-black p-2 bg-blue-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase"
                                            >
                                                {t('linkAccount')}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-4">
                            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-white/40">
                                <span>{t('lastSynced')}:</span>
                                <span className="text-blue-400">{lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'N/A'}</span>
                            </div>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={`w-full py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${isSyncing ? 'bg-blue-500/50 text-white/50' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                            >
                                {isSyncing ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-lg">🔄</motion.div>
                                ) : '✨'}
                                {t('syncNow')}
                            </button>
                        </div>

                        <button onClick={() => setMode('success')} className="text-center text-[10px] font-bold text-white/20 uppercase hover:text-white transition-colors">
                            {t('backBtn')}
                        </button>
                    </motion.div>
                ) : mode === 'magic' ? (
                    <motion.div
                        key="magic"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{t('passwordless')}</h2>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{t('secureSessionActive')}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('emailAddress')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your-signal@dream.ai"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            <button
                                onClick={handleMagicLogin}
                                disabled={isPending}
                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-sm shadow-2xl hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                            >
                                {isPending ? '...' : t('proceedBtn')}
                            </button>
                        </div>

                        <button onClick={() => setMode('login')} className="text-center text-[10px] font-bold text-white/20 uppercase hover:text-white transition-colors">
                            {t('backToLogin')}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-white mb-2">
                                {mode === 'login' ? t('loginTitle') : t('registerTitle')}
                            </h2>
                            <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
                                Revolutionary Auth Engine v4.0
                            </p>
                        </div>

                        {/* Method Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10 overflow-x-auto no-scrollbar">
                            {(['social', 'email', 'phone', 'qr', 'magic'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => m === 'magic' ? setMode('magic') : setMethod(m)}
                                    className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${method === m ? 'bg-white/15 text-white shadow-xl' : 'text-white/30 hover:text-white/60'
                                        }`}
                                >
                                    {t(m)}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1">
                            {method === 'social' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {socialProviders.map(provider => (
                                        <motion.button
                                            key={provider.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => signIn(provider.id)}
                                            className={`p-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all border border-white/5 ${provider.color}`}
                                        >
                                            <span className="text-xl">{provider.icon}</span>
                                            <span className="text-xs uppercase tracking-tight">{provider.name}</span>
                                        </motion.button>
                                    ))}
                                    <button className="col-span-2 mt-4 p-4 border border-white/10 rounded-2xl text-white/40 text-[10px] uppercase font-bold hover:bg-white/5 transition-all">
                                        {t('moreProviders')} +
                                    </button>
                                </div>
                            )}

                            {method === 'qr' && (
                                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                                    <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl relative group">
                                        <div className="absolute inset-0 bg-blue-500/10 scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DreamEngineAuth" alt="QR Code" className="w-full h-full" />
                                    </div>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{t('scanWithApp')}</p>
                                </div>
                            )}

                            {method === 'phone' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('phoneNumber')}</label>
                                        <div className="flex gap-2">
                                            <div className="w-20 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center">+966</div>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="5XXXXXXXX"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    {otp && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('verificationCode')}</label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="••••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-center text-2xl tracking-[1em] focus:outline-hidden focus:border-blue-500/50 transition-all font-black"
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setOtp('sent')}
                                        className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-sm shadow-2xl hover:scale-[1.02] transition-transform active:scale-95"
                                    >
                                        {otp ? t('verifyBtn') : t('sendOTP')}
                                    </button>
                                </div>
                            )}

                            {method === 'email' && (
                                <div className="space-y-4">
                                    {mode === 'register' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('fullName')}</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Alex Dream"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('emailAddress')}</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alex@dreamengine.ai"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end px-4">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('password')}</label>
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4].map((step) => (
                                                    <div
                                                        key={step}
                                                        className={`h-1 w-4 rounded-full transition-all ${passwordStrength >= step ? 'bg-blue-500' : 'bg-white/10'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <button
                                            onClick={() => setIsTrusted(!isTrusted)}
                                            className={`w-5 h-5 rounded-md border border-white/10 flex items-center justify-center transition-all ${isTrusted ? 'bg-blue-500 border-blue-500' : 'bg-white/5'}`}
                                        >
                                            {isTrusted && <span className="text-[10px]">✔</span>}
                                        </button>
                                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{t('trustedDevice')}</span>
                                    </div>

                                    <button
                                        onClick={handleAuth}
                                        disabled={isPending}
                                        className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-sm shadow-2xl hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                                    >
                                        {isPending ? '...' : (mode === 'login' ? t('proceedBtn') : t('registerBtn'))}
                                    </button>

                                    {mode === 'login' && (
                                        <button
                                            onClick={() => setMode('reset')}
                                            className="w-full text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-white/60 transition-colors"
                                        >
                                            {t('forgotPassword')}?
                                        </button>
                                    )}

                                    {mode === 'reset' && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-4 font-bold">{t('emailAddress')}</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="alex@dreamengine.ai"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    toast.success(t('loginAlert'));
                                                    setMode('login');
                                                }}
                                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-sm shadow-2xl hover:scale-[1.02] transition-transform active:scale-95"
                                            >
                                                {t('resetBtn')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Features */}
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-white/20">
                                <button onClick={() => toggleBiometrics('face')} className="flex items-center gap-2 hover:text-white transition-colors">
                                    <span>👣</span> {t('useFaceID')}
                                </button>
                                <button onClick={() => toggleBiometrics('touch')} className="flex items-center gap-2 hover:text-white transition-colors">
                                    <span>🔘</span> {t('useTouchID')}
                                </button>
                            </div>

                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-center text-[10px] uppercase tracking-[0.2em] font-black text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {mode === 'login' ? t('createAccount') : t('backToLogin')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Biometric Simulation Overlay */}
            <AnimatePresence>
                {showBiometrics && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
                    >
                        <motion.div
                            className="w-32 h-32 border-4 border-blue-500/50 rounded-full flex items-center justify-center mb-8 relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-2 border-2 border-blue-400/20 rounded-full" />
                            <span className="text-5xl">👤</span>
                        </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {biometricType === 'face' ? t('scanningFaceID') : t('scanningTouchID')}
                        </h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">{t('secureConnection')}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
