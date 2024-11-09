'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers'
import { useBinanceData } from '@/hooks/useBinanceData'
import WalletStats from '@/components/dashboard/WalletStats'
import AssetsList from '@/components/dashboard/AssetsList'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { calculateTodayProfit, calculateTotalProfit } from '@/utils/calculations'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { 
    balance, 
    trades, 
    isLoading, 
    error, 
    refresh 
  } = useBinanceData(user?.id || '')

  // حالة الإحصائيات
  const [stats, setStats] = useState({
    totalBalance: 0,
    todayProfit: 0,
    totalProfit: 0
  })

  // تحديث الإحصائيات عند تغير البيانات
  useEffect(() => {
    if (balance && trades) {
      setStats({
        totalBalance: balance.total,
        todayProfit: calculateTodayProfit(trades),
        totalProfit: calculateTotalProfit(trades)
      })
    }
  }, [balance, trades])

  // تحويل بيانات الأصول إلى التنسيق المطلوب للجدول
  const formattedAssets = balance?.assets.map(asset => ({
    symbol: asset.asset,
    balance: asset.free + asset.locked,
    usdValue: asset.usdValue,
    priceChange24h: 0 // سيتم تحديثه لاحقاً مع بيانات الأسعار
  })) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مرحباً، {user?.username}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
          </p>
        </div>
        
        {/* زر التحديث */}
        <button
          onClick={refresh}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث
        </button>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* إحصائيات المحفظة */}
      <WalletStats
        totalBalance={stats.totalBalance}
        todayProfit={stats.todayProfit}
        totalProfit={stats.totalProfit}
      />

      {/* القسم الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* قائمة الأصول */}
        <div className="lg:col-span-2">
          <AssetsList assets={formattedAssets} />
        </div>

        {/* آخر النشاطات */}
        <div className="lg:col-span-1">
          <RecentActivity 
            activities={[
              {
                id: '1',
                type: 'LOGIN',
                details: 'تم تحديث المحفظة',
                timestamp: new Date().toLocaleString('ar-SA'),
                status: error ? 'error' : 'success'
              },
              // يمكن إضافة المزيد من النشاطات هنا
            ]}
          />
        </div>
      </div>

      {/* تذييل الصفحة */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>تأكد من تحديث بياناتك بشكل دوري للحصول على أحدث المعلومات</p>
      </div>
    </div>
  )
}