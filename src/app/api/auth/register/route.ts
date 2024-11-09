import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash('admin', 10)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        email: 'admin',
        username: 'admin',
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح', userId: user.id },
      { status: 201 }
    )

  } catch (error) {
    console.error('خطأ في التسجيل:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    )
  }
}