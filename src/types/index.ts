// نوع المستخدم
export interface User {
    id: string;
    username: string;
    email: string;
    twoFactorEnabled: boolean;
    createdAt: Date;
    lastLogin: Date;
  }
  
  // نوع مفتاح API
  export interface ApiKey {
    id: string;
    userId: string;
    exchange: 'binance_spot' | 'binance_futures';
    apiKey: string;
    apiSecret: string;
    createdAt: Date;
    lastUsed: Date;
  }
  
  // نوع عنوان IP المسموح به
  export interface WhitelistedIP {
    id: string;
    userId: string;
    ipAddress: string;
    description: string;
    createdAt: Date;
  }
  
  // نوع المحفظة
  export interface WalletBalance {
    asset: string;
    free: number;
    locked: number;
    total: number;
  }
  
  // نوع رد تسجيل الدخول
  export interface LoginResponse {
    token: string;
    user: User;
  }