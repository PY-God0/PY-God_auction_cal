import { useState, useCallback, useMemo } from 'react';

export interface CouponOption {
  id: string;
  name: string;
  discountRate: number; // 0-1 之間的折扣率
  price: number; // 以 kw 為單位
}

export interface CalculationResult {
  salePrice: number; // 以 kw 為單位
  commissionRate: number;
  originalCommission: number; // 以 kw 為單位
  incomeWithoutCoupon: number; // 以 kw 為單位
  coupons: CouponResult[];
  bestStrategy: CouponResult | null;
}

export interface CouponResult {
  couponId: string;
  couponName: string;
  couponPrice: number; // 以 kw 為單位
  commissionReduction: number; // 以 kw 為單位
  discountedCommission: number; // 以 kw 為單位
  finalIncome: number; // 以 kw 為單位
  netProfitLoss: number; // 以 kw 為單位
  isProfit: boolean;
}

const DEFAULT_COUPONS: CouponOption[] = [
  { id: 'coupon30', name: '30% 折扣券', discountRate: 0.3, price: 1.71 }, // 1.71kw = 0.171E
  { id: 'coupon50', name: '50% 折扣券', discountRate: 0.5, price: 2.6 }, // 2.6kw = 0.26E
  { id: 'coupon100', name: '100% 折扣券', discountRate: 1, price: 5.99 }, // 5.99kw = 0.599E
];

export function useAuctionCalculator() {
  // 輸入單位是 E，內部計算使用 kw
  const [salePriceInE, setSalePriceInE] = useState<number>(45);
  const [commissionRate, setCommissionRate] = useState<number>(0.05); // 預設非 VIP (5%)
  const [coupons, setCoupons] = useState<CouponOption[]>(DEFAULT_COUPONS);
  
  // 上传給外部的 setter
  const setSalePrice = (valueInE: number) => setSalePriceInE(valueInE);

  const calculate = useCallback((): CalculationResult => {
    // 轉換为 kw 單位（E × 10 = kw）
    const salePrice = salePriceInE * 10;
    const originalCommission = salePrice * commissionRate;
    const incomeWithoutCoupon = salePrice - originalCommission;

    const couponResults: CouponResult[] = coupons.map((coupon) => {
      let commissionReduction: number;
      let discountedCommission: number;
      let finalIncome: number;
      let netProfitLoss: number;

      // 折扣券價格已經是 kw 單位，無需轉換

      if (coupon.discountRate === 1) {
        // 100% 折扣券：直接免除所有手續費
        commissionReduction = originalCommission;
        discountedCommission = 0;
        finalIncome = salePrice - coupon.price;
        netProfitLoss = originalCommission - coupon.price;
      } else {
        // 30% 和 50% 折扣券
        commissionReduction = originalCommission * coupon.discountRate;
        discountedCommission = originalCommission * (1 - coupon.discountRate);
        finalIncome = salePrice - discountedCommission - coupon.price;
        netProfitLoss = commissionReduction - coupon.price;
      }

      const isProfit = netProfitLoss >= 0;

      return {
        couponId: coupon.id,
        couponName: coupon.name,
        couponPrice: coupon.price, // 以 kw 為單位
        commissionReduction,
        discountedCommission,
        finalIncome,
        netProfitLoss,
        isProfit,
      };
    });

    // 找出最佳策略：最終收入最高的方案
    let bestStrategy: CouponResult | null = null;
    let maxIncome = incomeWithoutCoupon;

    couponResults.forEach((result) => {
      if (result.finalIncome > maxIncome) {
        maxIncome = result.finalIncome;
        bestStrategy = result;
      }
    });

    return {
      salePrice,
      commissionRate,
      originalCommission,
      incomeWithoutCoupon,
      coupons: couponResults,
      bestStrategy,
    };
    }, [salePriceInE, commissionRate, coupons]);

  const result = useMemo(() => calculate(), [calculate]);

  const updateCouponPrice = useCallback(
    (couponId: string, newPrice: number) => {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === couponId ? { ...coupon, price: newPrice } : coupon
        )
      );
    },
    []
  );

  const updateCouponDiscountRate = useCallback(
    (couponId: string, newRate: number) => {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === couponId ? { ...coupon, discountRate: newRate } : coupon
        )
      );
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setSalePriceInE(45);
    setCommissionRate(0.05);
    setCoupons(DEFAULT_COUPONS);
  }, []);

  return {
    salePrice: salePriceInE, // 輸出 E 單位
    setSalePrice,
    commissionRate,
    setCommissionRate,
    coupons,
    updateCouponPrice,
    updateCouponDiscountRate,
    result,
    resetToDefaults,
  };
}

/**
 * 格式化為多層級單位 (E/kw/w)
 * 輸入單位是 kw
 * 1E = 10kw
 * 1kw = 10w
 * 小數點後全為 0 則不顯示
 * 例如：450kw → "450kw", 45kw → "4.5E", 4.5kw → "4.5kw", 0.45kw → "4.5w"
 */
export function formatToE(numInKw: number): string {
  let formatted: string;
  
  // 轉換為 E 單位（kw ÷ 10 = E）
  const numInE = numInKw / 10;
  
  if (numInE >= 1) {
    formatted = numInE.toFixed(2);
    formatted = formatted.replace(/\.?0+$/, '');
    return `${formatted}E`;
  } else if (numInKw >= 1) {
    formatted = numInKw.toFixed(2);
    formatted = formatted.replace(/\.?0+$/, '');
    return `${formatted}kw`;
  } else {
    // numInKw < 1 時，轉換為 w（kw × 10 = w）
    const numInW = numInKw * 10;
    formatted = numInW.toFixed(0);
    return `${formatted}w`;
  }
}

/**
 * 格式化大數字為可讀的字符串
 * 例如：1355000000 → "1,355,000,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-TW');
}

/**
 * 格式化為萬元單位
 * 例如：1355000000 → "13,550 萬"
 */
export function formatToWan(num: number): string {
  const wan = Math.floor(num / 10000);
  const remainder = num % 10000;
  if (remainder === 0) {
    return `${formatNumber(wan)} 萬`;
  }
  return `${formatNumber(wan)}.${String(remainder).padStart(4, '0')} 萬`;
}

/**
 * 簡化顯示：如果是整數萬，只顯示萬數；否則顯示完整數字
 */
export function formatCompact(num: number): string {
  if (num % 10000 === 0) {
    return formatToWan(num);
  }
  return formatNumber(num);
}
