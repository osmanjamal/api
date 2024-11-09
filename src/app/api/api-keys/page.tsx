'use client'

import { AddApiKeyForm } from '@/components/api-keys/AddApiKeyForm'

export default function ApiKeysPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">إدارة مفاتيح API</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddApiKeyForm />
      </div>
    </div>
  )
}