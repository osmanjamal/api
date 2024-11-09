import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // التحقق من وجود التوكن
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    // التحقق من صحة التوكن
    const decoded = verifyToken(token)

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        lastLogin: true,
        isActive: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'الحساب غير نشط' },
        { status: 403 }
      )
    }

    return NextResponse.json(user, { status: 200 })

  } catch (error) {
    console.error('خطأ في التحقق من المصادقة:', error)
    return NextResponse.json(
      { error: 'فشل التحقق من المصادقة' },
      { status: 401 }
    )
  }
}