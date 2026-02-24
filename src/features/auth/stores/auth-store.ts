import { create } from 'zustand';

// تعريف واجهة الحالة لمتجر المصادقة
// Defining the state interface for the Auth Store
interface AuthState {
    linkedAccounts: string[]; // قائمة الحسابات المرتبطة (مثل google, github)
    isSyncing: boolean; // حالة المزامنة الحالية
    lastSyncTime: string | null; // وقت آخر مزامنة ناجحة

    // وظائف لتحديث الحالة
    setLinkedAccounts: (accounts: string[]) => void; // تعيين الحسابات المرتبطة
    setSyncing: (status: boolean) => void; // تعيين حالة المزامنة
    updateSyncTime: () => void; // تحديث وقت المزامنة إلى الوقت الحالي
    addLinkedAccount: (provider: string) => void; // إضافة حساب مرتبط جديد
    removeLinkedAccount: (provider: string) => void; // إزالة حساب مرتبط
}

// إنشاء متجر Zustand مع التعليقات العربية لكل سطر
// Creating the Zustand store with Arabic comments for each line
export const useAuthStore = create<AuthState>((set) => ({
    linkedAccounts: [], // الحالة الابتدائية للحسابات المرتبطة هي قائمة فارغة
    isSyncing: false, // الحالة الابتدائية للمزامنة هي "خامل"
    lastSyncTime: null, // لا يوجد وقت مزامنة ابتدائي

    // تعيين كافة الحسابات المرتبطة مرة واحدة
    setLinkedAccounts: (accounts) => set({ linkedAccounts: accounts }),

    // تحديث حالة عملية المزامنة (بدء أو انتهاء)
    setSyncing: (status) => set({ isSyncing: status }),

    // تسجيل الوقت الحالي كآخر وقت تمت فيه المزامنة بنجاح
    updateSyncTime: () => set({ lastSyncTime: new Date().toISOString() }),

    // إضافة موفر خدمة جديد إلى القائمة إذا لم يكن موجوداً
    addLinkedAccount: (provider) => set((state) => ({
        linkedAccounts: state.linkedAccounts.includes(provider)
            ? state.linkedAccounts
            : [...state.linkedAccounts, provider]
    })),

    // إزالة موفر خدمة معين من قائمة الحسابات المرتبطة
    removeLinkedAccount: (provider) => set((state) => ({
        linkedAccounts: state.linkedAccounts.filter(a => a !== provider)
    })),
}));
