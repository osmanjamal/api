import crypto from 'crypto';

interface BinanceConfig {
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
}

export class BinanceAPI {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: BinanceConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.testnet
      ? 'https://testnet.binance.vision/api'
      : 'https://api.binance.com/api';
  }

  // إنشاء توقيع للطلب
  private createSignature(queryString: string): string {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
  }

  // إضافة معلومات الأمان للطلب
  private async signRequest(endpoint: string, params: Record<string, string> = {}) {
    const timestamp = Date.now();
    const queryStringParams = new URLSearchParams({
      ...params,
      timestamp: timestamp.toString(),
    });
    
    const queryString = queryStringParams.toString();
    const signature = this.createSignature(queryString);
    
    const signedUrl = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
    
    return {
      url: signedUrl,
      headers: {
        'X-MBX-APIKEY': this.apiKey,
      },
    };
  }

  // جلب معلومات الحساب
  async getAccountInformation() {
    const { url, headers } = await this.signRequest('/v3/account');
    
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`فشل جلب معلومات الحساب: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب معلومات الحساب:', error);
      throw error;
    }
  }

  // جلب أسعار العملات
  async getPrices() {
    try {
      const response = await fetch(`${this.baseUrl}/v3/ticker/24hr`);
      if (!response.ok) {
        throw new Error(`فشل جلب الأسعار: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الأسعار:', error);
      throw error;
    }
  }

  // جلب بيانات المحفظة
  async getWalletBalance() {
    const { url, headers } = await this.signRequest('/v3/account');
    
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`فشل جلب معلومات المحفظة: ${response.statusText}`);
      }
      const data = await response.json();
      return data.balances.filter((balance: any) => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0);
    } catch (error) {
      console.error('خطأ في جلب معلومات المحفظة:', error);
      throw error;
    }
  }

  // جلب سجل الصفقات
  async getTradeHistory(symbol: string) {
    const { url, headers } = await this.signRequest('/v3/myTrades', { symbol });
    
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`فشل جلب سجل الصفقات: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب سجل الصفقات:', error);
      throw error;
    }
  }

  // تحقق من صحة API Key
  async validateApiKey() {
    try {
      await this.getAccountInformation();
      return true;
    } catch (error) {
      console.error('خطأ في التحقق من API Key:', error);
      return false;
    }
  }
}