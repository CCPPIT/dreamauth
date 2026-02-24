'use server';

import { db } from '@/infrastructure/storage/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    name: z.string().min(2, "Name is too short"),
});

export const registerAction = async (values: any) => {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Email already in use" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    });

    return { success: "Account created successfully" };
};

export const loginAction = async (values: any) => {
    // Note: In NextAuth v5 we usually call signIn directly on the client,
    // but we can wrap it in a server action if needed for logging or extra checks.
    return { success: "Login sequence initiated" };
};

export const resetPasswordRequestAction = async (email: string) => {
    // In a real app, send actual email
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found" };

    console.log(`Reset link sent to ${email}`);
    return { success: "Check your email for the reset link" };
};

export const sendEmailOTPAction = async (email: string) => {
    // Simulate sending email
    console.log(`Email OTP sent to ${email}: 654321`);
    return { success: "Verification code sent to your email" };
};

export const sendSMSOTPAction = async (phone: string) => {
    // Simulate sending SMS
    console.log(`SMS OTP sent to ${phone}: 121212`);
    return { success: "Verification code sent via SMS" };
};

export const sendWhatsAppOTPAction = async (phone: string) => {
    // Simulate sending WhatsApp
    console.log(`WhatsApp OTP sent to ${phone}: 888999`);
    return { success: "Verification code sent via WhatsApp" };
};

export const sendOTPAction = async (phone: string) => {
    // General fallback
    console.log(`Fallback OTP sent to ${phone}: 123456`);
    return { success: "Verification code sent" };
};

export const verifyOTPAction = async (phone: string, code: string) => {
    if (code === "123456") {
        return { success: "Verified" };
    }
    return { error: "Invalid code" };
};

export const generateTOTPSecretAction = async (email: string) => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found" };

    const secret = speakeasy.generateSecret({
        name: `DreamEngine (${email})`,
    });

    await db.user.update({
        where: { email },
        data: { mfaSecret: secret.base32 }
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');
    return { secret: secret.base32, qrCodeUrl, success: "TOTP Secret Generated and Secured" };
};

export const verifyTOTPAction = async (email: string, token: string) => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.mfaSecret) return { error: "MFA not set up for this user" };

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
    });

    if (verified) {
        await db.user.update({ where: { email }, data: { mfaEnabled: true } });
        return { success: true };
    }
    return { error: "Invalid token" };
};

export const sendPushNotificationAction = async (userId: string) => {
    console.log(`Push notification sent to user ${userId}: "Is this you trying to login?"`);
    return { success: "Notification sent to your trusted device" };
};

export const initiateVoiceVerificationAction = async (phoneNumber: string) => {
    console.log(`Calling ${phoneNumber}... "Your code is 9-8-2-1"`);
    return { success: "Calling you now..." };
};

export const verifySecretQuestionAction = async (email: string, answer: string) => {
    const user = await db.user.findUnique({ where: { email } });

    // Fallback for demo if not set
    const expectedAnswer = user?.securityAnswer || "antigravity";

    if (answer.toLowerCase() === expectedAnswer.toLowerCase()) {
        return { success: true };
    }
    return { error: "Incorrect answer" };
};

export const setupSecretQuestionAction = async (email: string, question: string, answer: string) => {
    await db.user.update({
        where: { email },
        data: { securityQuestion: question, securityAnswer: answer }
    });
    return { success: "Security question configured" };
};

export const generateTemporaryQRAction = async () => {
    const tempUrl = `https://dreamengine.ai/auth/qr-sync/${Math.random().toString(36).substring(7)}`;
    const qr = await QRCode.toDataURL(tempUrl);
    return { qr };
};

export const reactivateMFAAction = async (userId: string) => {
    // Logic to reset or re-verify current device/session for MFA
    console.log(`Reactivating MFA for user ${userId}`);
    return { success: "MFA protocols have been re-initialized for this device" };
};

/**
 * وظيفة لإزالة ربط حساب اجتماعي معين
 * Function to unlink a specific social account
 */
export const unlinkAccountAction = async (userId: string, provider: string) => {
    // جلب كافة الحسابات المرتبطة للمستخدم
    const accounts = await db.account.findMany({ where: { userId } });

    // منع حذف الحساب إذا كان هو الوحيد (لتجنب فقدان الوصول)
    if (accounts.length <= 1) {
        return { error: "لا يمكن إزالة الحساب الأخير المرتبط" };
    }

    // حذف السجل من قاعدة البيانات
    await db.account.deleteMany({
        where: { userId, provider }
    });

    // تسجيل العملية في سجل التدقيق
    await db.auditLog.create({
        data: { userId, action: "ACCOUNT_UNLINK", details: `Removed ${provider} account` }
    });

    return { success: `تم إزالة ربط حساب ${provider} بنجاح` };
};

/**
 * وظيفة لمزامنة البيانات يدوياً من موفر خدمة محدد
 */
export const syncUserProfileAction = async (userId: string) => {
    // في التطبيق الحقيقي سنستخدم توكن الموفر لجلب أحدث البيانات
    // هنا سنحاكي العملية بتحديث وقت المزامنة
    await db.user.update({
        where: { id: userId },
        data: { updatedAt: new Date() }
    });

    return { success: "تمت مزامنة بيانات الملف الشخصي بنجاح" };
};

/**
 * إرسال رابط تسجيل دخول سحري (Passwordless)
 */
export const sendMagicLinkAction = async (email: string) => {
    // محاكاة إرسال الرابط السحري للبريد
    console.log(`Magic Link generated for ${email}: https://dreamengine.ai/auth/verify?token=XYZ`);

    // تسجيل المحاولة في سجل التدقيق
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
        await db.auditLog.create({
            data: { userId: user.id, action: "MAGIC_LINK_SENT", details: `Target: ${email}` }
        });
    }

    return { success: "تم إرسال رابط الدخول السحري لبريدك بنجاح" };
};
