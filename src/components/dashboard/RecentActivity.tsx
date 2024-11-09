'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Activity, ArrowUpRight, ArrowDownRight, Key, Shield } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'LOGIN' | 'API_KEY' | 'IP_WHITELIST' | 'TRADE'
  details: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'LOGIN':
        return <Activity className="h-4 w-4" />
      case 'API_KEY':
        return <Key className="h-4 w-4" />
      case 'IP_WHITELIST':
        return <Shield className="h-4 w-4" />
      case 'TRADE':
        return <ArrowUpRight className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700'
      case 'error':
        return 'bg-red-100 text-red-700'
    }
  }

  return (
    <Card className="mt-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">آخر النشاطات</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {getIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.details}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status === 'success' && 'ناجح'}
                {activity.status === 'warning' && 'تحذير'}
                {activity.status === 'error' && 'خطأ'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}