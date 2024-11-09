import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    const { id } = params

    // التحقق من وجود المفتاح وملكيته
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true, exchange: true }
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'مفتاح API غير موجود' },
        { status: 404 }
      )
    }

    if (apiKey.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بحذف هذا المفتاح' },
        { status: 403 }
      )
    }

    // حذف المفتاح
    await prisma.apiKey.delete({
      where: { id }
    })

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: decoded.userId,
        action: 'API_KEY_DELETED',
        details: `تم حذف مفتاح API: ${apiKey.exchange}`,
        ipAddress: request.ip,
      },
    })

    return NextResponse.json(
      { message: 'تم حذف مفتاح API بنجاح' },
      { status: 200 }
    )

  } catch (error) {
    console.error('خطأ في حذف مفتاح API:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف مفتاح API' },
      { status: 500 }
    )
  }
}