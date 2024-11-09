'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

interface WalletStatsProps {
  totalBalance: number
  todayProfit: number
  totalProfit: number
}

export default function WalletStats({ totalBalance, todayProfit, totalProfit }: WalletStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* إجمالي الرصيد */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي الرصيد</p>
            <h3 className="text-2xl font-bold mt-1">${totalBalance.toLocaleString()}</h3>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* ربح اليوم */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">ربح اليوم</p>
            <h3 className={`text-2xl font-bold mt-1 ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(todayProfit).toLocaleString()}
              {todayProfit >= 0 ? 
                <TrendingUp className="h-4 w-4 inline mr-1" /> : 
                <TrendingDown className="h-4 w-4 inline mr-1" />
              }
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            todayProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {todayProfit >= 0 ? 
              <TrendingUp className={`h-6 w-6 ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} /> :
              <TrendingDown className={`h-6 w-6 ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            }
          </div>
        </div>
      </Card>

      {/* إجمالي الربح */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي الربح</p>
            <h3 className={`text-2xl font-bold mt-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalProfit).toLocaleString()}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {totalProfit >= 0 ? 
              <TrendingUp className={`h-6 w-6 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} /> :
              <TrendingDown className={`h-6 w-6 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            }
          </div>
        </div>
      </Card>
    </div>
  )
}