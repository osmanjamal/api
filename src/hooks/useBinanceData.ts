import { useState, useEffect } from 'react';
import { BinanceAPI } from '@/lib/binance';
import { prisma } from '@/lib/prisma';

interface BinanceData {
  balance: {
    total: number;
    assets: Array<{
      asset: string;
      free: number;
      locked: number;
      usdValue: number;
    }>;
  };
  trades: Array<{
    symbol: string;
    price: number;
    quantity: number;
    commission: number;
    time: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useBinanceData(userId: string) {
  const [data, setData] = useState<BinanceData>({
    balance: {
      total: 0,
      assets: [],
    },
    trades: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // جلب مفاتيح API من قاعدة البيانات
        const apiKeys = await prisma.apiKey.findFirst({
          where: {
            userId,
            isActive: true,
          },
        });

        if (!apiKeys) {
          throw new Error('لم يتم العثور على مفاتيح API نشطة');
        }

        // تهيئة Binance API
        const binanceApi = new BinanceAPI({
          apiKey: apiKeys.apiKey,
          apiSecret: apiKeys.apiSecret,
        });

        // جلب بيانات المحفظة
        const balances = await binanceApi.getWalletBalance();
        const prices = await binanceApi.getPrices();

        // حساب قيمة كل عملة بالدولار
        const assets = balances.map((balance: any) => {
          const price = prices.find((p: any) => p.symbol === `${balance.asset}USDT`)?.lastPrice || 0;
          const total = parseFloat(balance.free) + parseFloat(balance.locked);
          const usdValue = total * parseFloat(price);

          return {
            asset: balance.asset,
            free: parseFloat(balance.free),
            locked: parseFloat(balance.locked),
            usdValue,
          };
        });

        // حساب إجمالي القيمة بالدولار
        const totalUsdValue = assets.reduce((total, asset) => total + asset.usdValue, 0);

        if (mounted) {
          setData({
            balance: {
              total: totalUsdValue,
              assets,
            },
            trades: [], // سيتم إضافة سجل الصفقات لاحقاً
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setData(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'حدث خطأ غير معروف',
          }));
        }
      }
    };

    fetchData();
    
    // تحديث البيانات كل دقيقة
    const interval = setInterval(fetchData, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  const refresh = () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
  };

  return {
    ...data,
    refresh,
  };
}