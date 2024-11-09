import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { encrypt } from '@/lib/crypto' // سنقوم بإنشاء هذا الملف لاحقاً

// جلب جميع مفاتيح API للمستخدم الحالي
export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // إخفاء API Secret قبل إرسال البيانات
    const sanitizedApiKeys = apiKeys.map(key => ({
      ...key,
      apiSecret: undefined
    }))

    return NextResponse.json(sanitizedApiKeys)

  } catch (error) {
    console.error('خطأ في جلب مفاتيح API:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب مفاتيح API' },
      { status: 500 }
    )
  }
}

// إضافة مفتاح API جديد
export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    const body = await request.json()
    const { apiKey, apiSecret, description, exchange } = body

    // التحقق من المدخلات
    if (!apiKey || !apiSecret || !exchange) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة غير مكتملة' },
        { status: 400 }
      )
    }

    // تشفير البيانات الحساسة
    const encryptedApiKey = await encrypt(apiKey)
    const encryptedApiSecret = await encrypt(apiSecret)

    // إضافة المفتاح الجديد
    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: decoded.userId,
        exchange,
        apiKey: encryptedApiKey,
        apiSecret: encryptedApiSecret,
        description,
        isActive: true,
      },
    })

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: decoded.userId,
        action: 'API_KEY_ADDED',
        details: `تمت إضافة مفتاح API جديد: ${exchange}`,
        ipAddress: request.ip,
      },
    })

    return NextResponse.json(
      { 
        id: newApiKey.id,
        message: 'تم إضافة مفتاح API بنجاح' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('خطأ في إضافة مفتاح API:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة مفتاح API' },
      { status: 500 }
    )
  }
}