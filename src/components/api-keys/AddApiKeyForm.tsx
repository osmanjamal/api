'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BinanceAPI } from '@/lib/binance'

export default function AddApiKeyForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const apiKey = formData.get('apiKey') as string
    const apiSecret = formData.get('apiSecret') as string
    const description = formData.get('description') as string
    const exchange = formData.get('exchange') as string

    try {
      // التحقق من صحة المفاتيح
      const binanceApi = new BinanceAPI({
        apiKey,
        apiSecret,
        testnet: false
      })

      const isValid = await binanceApi.validateApiKey()
      if (!isValid) {
        throw new Error('مفاتيح API غير صالحة')
      }

      // إضافة المفاتيح إلى قاعدة البيانات
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          apiSecret,
          description,
          exchange
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'حدث خطأ أثناء حفظ المفاتيح')
      }

      setSuccess('تم إضافة مفاتيح API بنجاح')
      e.currentTarget.reset()
      onSuccess()

    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">إضافة مفاتيح API جديدة</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="exchange" className="block text-sm font-medium text-gray-700">
            المنصة
          </label>
          <select
            id="exchange"
            name="exchange"
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="binance_spot">Binance Spot</option>
            <option value="binance_futures">Binance Futures</option>
          </select>
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل API Key"
          />
        </div>

        <div>
          <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700">
            API Secret
          </label>
          <input
            type="password"
            id="apiSecret"
            name="apiSecret"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل API Secret"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            الوصف
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="وصف اختياري"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'جاري الإضافة...' : 'إضافة مفاتيح API'}
          </button>
        </div>
      </form>
    </Card>
  )
}