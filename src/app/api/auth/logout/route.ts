import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // الحصول على التوكن
    const token = cookies().get('token')?.value

    if (token) {
      try {
        // تسجيل عملية الخروج في سجل النشاط
        const decoded = verifyToken(token)
        await prisma.activityLog.create({
          data: {
            userId: decoded.userId,
            action: 'LOGOUT',
            details: 'تم تسجيل الخروج',
            ipAddress: request.ip
          }
        })
      } catch (error) {
        console.error('خطأ في تسجيل نشاط الخروج:', error)
      }
    }

    // إعداد الاستجابة
    const response = NextResponse.json(
      { message: 'تم تسجيل الخروج بنجاح' },
      { status: 200 }
    )

    // حذف التوكن من الكوكيز
    cookies().delete('token')

    return response

  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    )
  }
}