import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // قائمة المسارات التي لا تحتاج إلى مصادقة
  const publicPaths = ['/login', '/register', '/forgot-password'];
  
  // التحقق مما إذا كنا في صفحة عامة
  const isPublicPage = publicPaths.includes(router.pathname);

  // إذا كان التحميل جارياً، نعرض شاشة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول وليست صفحة عامة، نوجه إلى صفحة تسجيل الدخول
  if (!user && !isPublicPage) {
    router.push('/login');
    return null;
  }

  // إذا كان المستخدم مسجل الدخول وفي صفحة عامة، نوجه إلى لوحة التحكم
  if (user && isPublicPage) {
    router.push('/dashboard');
    return null;
  }

  // إذا كانت صفحة عامة، نعرض المحتوى بدون القائمة الجانبية
  if (isPublicPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  // التخطيط الرئيسي مع القائمة الجانبية
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pr-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;