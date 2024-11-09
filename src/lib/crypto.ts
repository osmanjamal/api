import crypto from 'crypto';

// الحصول على مفتاح التشفير من متغيرات البيئة
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-characters!'
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 64

// تشفير النص
export async function encrypt(text: string): Promise<string> {
  try {
    // إنشاء salt عشوائي
    const salt = crypto.randomBytes(SALT_LENGTH)
    
    // إنشاء مفتاح مشتق من مفتاح التشفير الرئيسي والـ salt
    const key = await deriveKey(ENCRYPTION_KEY, salt)
    
    // إنشاء IV عشوائي
    const iv = crypto.randomBytes(IV_LENGTH)
    
    // إنشاء cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    // تشفير النص
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    // الحصول على الـ auth tag
    const authTag = cipher.getAuthTag()
    
    // دمج جميع المكونات في نص واحد
    // الترتيب: salt + iv + authTag + encrypted
    const result = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'hex')
    ]).toString('base64')
    
    return result

  } catch (error) {
    console.error('خطأ في التشفير:', error)
    throw new Error('فشل تشفير البيانات')
  }
}

// فك تشفير النص
export async function decrypt(encryptedText: string): Promise<string> {
  try {
    // تحويل النص المشفر إلى buffer
    const buffer = Buffer.from(encryptedText, 'base64')
    
    // استخراج المكونات
    const salt = buffer.slice(0, SALT_LENGTH)
    const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const authTag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH).toString('hex')
    
    // اشتقاق المفتاح
    const key = await deriveKey(ENCRYPTION_KEY, salt)
    
    // إنشاء decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    
    // فك التشفير
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted

  } catch (error) {
    console.error('خطأ في فك التشفير:', error)
    throw new Error('فشل فك تشفير البيانات')
  }
}

// اشتقاق المفتاح من كلمة المرور والـ salt
async function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      100000, // عدد التكرارات
      32, // طول المفتاح بالبايت
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err)
        else resolve(derivedKey)
      }
    )
  })
}

// التحقق من صحة المفتاح
export function validateEncryptionKey(): boolean {
  try {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
      throw new Error('مفتاح التشفير غير صالح أو غير موجود')
    }
    return true
  } catch (error) {
    console.error('خطأ في التحقق من مفتاح التشفير:', error)
    return false
  }
}

// إنشاء مفتاح تشفير جديد
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('base64')
}