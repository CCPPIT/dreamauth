import NextAuth from "next-auth";
import { type JWT } from "next-auth/jwt"; // استيراد صريح لمساعد النوع في الاكتشاف
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/infrastructure/storage/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import Apple from "next-auth/providers/apple";
import Twitter from "next-auth/providers/twitter";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * توسيع أنواع NextAuth لدعم الحقول المخصصة للحساب ومزامنة الهوية العصبية
 * Extending NextAuth types for account custom fields and Neural Sync Identity Pulse
 */
declare module "next-auth" {
    interface User {
        role?: string;
        phone?: string | null; // دعم رقم الهاتف في واجهة المستخدم لاستكمال المزامنة العصبية
        identityAlert?: boolean;
        linkedProviders?: string[];
    }
    // إضافة الدعم لـ AdapterUser لضمان توافق signIn callback في الإصدار الخامس
    interface AdapterUser extends User { }

    interface Session {
        user: {
            id: string;
            role: string;
            phone?: string | null;
            identityAlert?: boolean;
            linkedProviders: string[];
        } & import("next-auth").DefaultSession["user"]
    }
}

// @ts-ignore - تعطيل خطأ التعرف على الموديل في بعض البيئات مع الحفاظ على توسيع النوع
declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        phone?: string | null;
        identityAlert?: boolean;
        linkedProviders?: string[];
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // السماح بربط الحسابات تلقائياً إذا تطابق البريد الإلكتروني
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // تفعيل الربط التلقائي لحسابات جيت هاب
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // تفعيل الربط التلقائي لحسابات فيسبوك
        }),
        Apple({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // تفعيل الربط التلقائي لحسابات آبل
        }),
        Twitter({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // تفعيل الربط التلقائي لحسابات تويتر
        }),
        LinkedIn({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true, // تفعيل الربط التلقائي لحسابات لينكد إن
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValid) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // منطق المزامنة التلقائية عند تسجيل الدخول - Pulse Identity Sync
            // Auto-sync logic on sign-in
            if (account && user.id) {
                // جلب بيانات المستخدم الحالية من القاعدة للمقارنة
                // Fetch current user data from DB for comparison
                const dbUser = await db.user.findUnique({ where: { id: user.id } });

                // اكتشاف التغييرات لإرسال إشعارات أو تسجيلها في النظام
                // Detecting identity changes to trigger notifications or logs
                const nameChanged = profile?.name && profile.name !== dbUser?.name;
                const imageChanged = (profile?.image || profile?.picture) && (profile.image || profile.picture) !== dbUser?.image;

                // تنبيه حرج عند تسجيل دخول ببريد مختلف لنفس الحساب المرتبط (Neural Alert)
                // Critical alert if profile email differs from the primary DB email
                const emailInProfile = profile?.email;
                const emailChanged = emailInProfile && emailInProfile !== dbUser?.email;

                // محاولة مزامنة رقم الهاتف إذا توفر في البروفايل الاجتماعي (Biometric Sync)
                // Attempt to sync phone number from social profile signals
                const phoneInProfile = (profile as any)?.phone || (profile as any)?.mobile || (profile as any)?.phone_number;

                // تحديث بيانات المستخدم في القاعدة - المزامنة الحقيقية والشاملة
                // Updating user record in DB - Real multi-dimensional synchronization
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        name: profile?.name || user.name, // مزامنة الاسم الكامل
                        image: profile?.image || profile?.picture || user.image, // مزامنة صورة الملف الشخصي
                        phone: phoneInProfile || user.phone, // مزامنة رقم الهاتف إن وجد في الإشارة الاجتماعية
                        // لا نحدث البريد الأساسي تلقائياً لحماية الهوية، بل نسجل التغيير فقط للتنبيه
                    }
                });

                // تسجيل الحدث في سجل التدقيق مع تفاصيل المزامنة والتنبيهات العصبية
                // Log the synchronization event with deep details and neural alerts
                await db.auditLog.create({
                    data: {
                        userId: user.id,
                        action: "IDENTITY_PULSE_SYNC",
                        details: `Synced from ${account.provider}.${nameChanged ? ' Name updated.' : ''}${imageChanged ? ' Image updated.' : ''}${emailChanged ? ' CRITICAL: Profile email mismatch detected!' : ''}${phoneInProfile ? ' Phone signal linked.' : ''}`,
                    }
                });

                // إذا تغير البريد، نقوم بوسم الجلسة بتنبيه
                // If email changed, we flag the session with an alert
                if (emailChanged) {
                    // @ts-ignore - إضافة وسم مؤقت للتنبيه
                    user.identityAlert = true;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // إضافة معرف المستخدم والأدوار للجلسة - استخراج من التوكن
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            if (token.linkedProviders && session.user) {
                // @ts-ignore
                session.user.linkedProviders = token.linkedProviders;
            }
            if (token.identityAlert && session.user) {
                // @ts-ignore
                session.user.identityAlert = true;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (!token.sub) return token;

            // جلب بيانات المستخدم من القاعدة لضمان التحديث المستمر ومزامنة الموفرين
            const dbUser = await db.user.findUnique({
                where: { id: token.sub },
                include: { accounts: true } // جلب الحسابات المرتبطة أيضاً
            });

            if (!dbUser) return token;

            token.role = dbUser.role;
            // إضافة قائمة الموفرين المرتبطين للتوكن لسهولة العرض في الواجهة (Account Linking)
            token.linkedProviders = dbUser.accounts.map(acc => acc.provider);

            // تمرير تنبيه الهوية إذا وجد (Identity Alert Signal)
            if ((user as any)?.identityAlert) {
                token.identityAlert = true;
            }

            return token;
        }
    }
});

