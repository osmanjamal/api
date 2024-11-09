'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Wallet,
  Key,
  Shield,
  Settings,
  LogOut,
  Activity
} from 'lucide-react'

const menuItems = [
  {
    name: 'الرئيسية',
    icon: Home,
    path: '/dashboard'
  },
  {
    name: 'المحفظة',
    icon: Wallet,
    path: '/wallet'
  },
  {
    name: 'إدارة API',
    icon: Key,
    path: '/api-keys'
  },
  {
    name: 'عناوين IP',
    icon: Shield,
    path: '/ip-whitelist'
  },
  {
    name: 'سجل النشاط',
    icon: Activity,
    path: '/activity'
  },
  {
    name: 'الإعدادات',
    icon: Settings,
    path: '/settings'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* رأس القائمة */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 text-right">لوحة التحكم</h2>
        </div>

        {/* القائمة */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              // سيتم إضافة منطق تسجيل الخروج لاحقاً
              console.log('تسجيل الخروج')
            }}
            className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-2 w-full rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  )
}