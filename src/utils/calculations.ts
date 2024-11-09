interface Trade {
    symbol: string;
    price: number;
    quantity: number;
    commission: number;
    time: number;
  }
  
  // حساب أرباح اليوم
  export function calculateTodayProfit(trades: Trade[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return trades
      .filter(trade => new Date(trade.time).getTime() >= today.getTime())
      .reduce((profit, trade) => {
        const tradeValue = trade.price * trade.quantity;
        // نفترض أن العمولة بالدولار
        return profit + (tradeValue - trade.commission);
      }, 0);
  }
  
  // حساب إجمالي الأرباح
  export function calculateTotalProfit(trades: Trade[]): number {
    return trades.reduce((profit, trade) => {
      const tradeValue = trade.price * trade.quantity;
      return profit + (tradeValue - trade.commission);
    }, 0);
  }
  
  // حساب التغير في السعر
  export function calculatePriceChange(
    currentPrice: number,
    previousPrice: number
  ): number {
    if (previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }
  
  // تنسيق الرقم إلى عملة
  export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    decimals: number = 2
  ): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  }
  
  // تنسيق النسبة المئوية
  export function formatPercentage(value: number): string {
    const formatted = value.toFixed(2);
    return `${value >= 0 ? '+' : ''}${formatted}%`;
  }
  
  // تحويل التاريخ إلى نص نسبي
  export function formatRelativeTime(date: Date | number): string {
    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
    const now = new Date().getTime();
    const diff = now - (typeof date === 'number' ? date : date.getTime());
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return rtf.format(-days, 'day');
    } else if (hours > 0) {
      return rtf.format(-hours, 'hour');
    } else if (minutes > 0) {
      return rtf.format(-minutes, 'minute');
    } else {
      return rtf.format(-seconds, 'second');
    }
  }