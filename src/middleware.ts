import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// المسارات التي لا تحتاج إلى مصادقة
const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function middleware(request: NextRequest) {
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  const token = request.cookies.get('token')?.value

  // إذا كان المسار عام، نسمح بالوصول
  if (isPublicPath) {
    return NextResponse.next()
  }

  // إذا لم يكن هناك توكن، نوجه إلى صفحة تسجيل الدخول
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    // التحقق من صحة التوكن
    verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    // إذا كان التوكن غير صالح، نحذفه ونوجه إلى صفحة تسجيل الدخول
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('token')
    return response
  }
}

// تحديد المسارات التي سيتم تطبيق الـ middleware عليها
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api-keys/:path*',
    '/settings/:path*',
    '/api/:path*',
  ]
}