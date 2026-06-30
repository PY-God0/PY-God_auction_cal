import { useState, useCallback, useMemo } from 'react';

export interface CouponOption {
  id: string;
  name: string;
  discountRate: number; // 0-1 之間的折扣率
  price: number; // 以億為單位
}

export interface CalculationResult {
  salePrice: number; // 以億為單位
  commissionRate: number;
  originalCommission: number; // 以億為單位
  incomeWithoutCoupon: number; // 以億為單位
  coupons: CouponResult[];
  bestStrategy: CouponResult | null;
}

export interface CouponResult {
  couponId: string;
  couponName: string;
  couponPrice: number; // 以億為單位
  commissionReduction: number; // 以億為單位
  discountedCommission: number; // 以億為單位
  finalIncome: number; // 以億為單位
  netProfitLoss: number; // 以億為單位
  isProfit: boolean;
}

const DEFAULT_COUPONS: CouponOption[] = [
  { id: 'coupon30', name: '30% 折扣券', discountRate: 0.3, price: 0.17 },
  { id: 'coupon50', name: '50% 折扣券', discountRate: 0.5, price: 0.25 },
  { id: 'coupon100', name: '100% 折扣券', discountRate: 1, price: 0.57 },
];

export function useAuctionCalculator() {
  const [salePrice, setSalePrice] = useState<number>(45);
  const [commissionRate, setCommissionRate] = useState<number>(0.04);
  const [coupons, setCoupons] = useState<CouponOption[]>(DEFAULT_COUPONS);

  const calculate = useCallback((): CalculationResult => {
    const originalCommission = salePrice * commissionRate;
    const incomeWithoutCoupon = salePrice - originalCommission;

    const couponResults: CouponResult[] = coupons.map((coupon) => {
      let commissionReduction: number;
      let discountedCommission: number;
      let finalIncome: number;
      let netProfitLoss: number;

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
        couponPrice: coupon.price,
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
  }, [salePrice, commissionRate, coupons]);

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
    setSalePrice(45);
    setCommissionRate(0.04);
    setCoupons(DEFAULT_COUPONS);
  }, []);

  return {
    salePrice,
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
 * 1E = 100,000,000
 * 1kw = 10,000,000
 * 1w = 1,000,000
 * 例如：45 → "45.00E", 0.55 → "5.50kw", 0.0094 → "94.00w"
 */
export function formatToE(num: number): string {
  if (num >= 1) {
    return `${num.toFixed(2)}E`;
  } else if (num >= 0.1) {
    return `${(num * 10).toFixed(2)}kw`;
  } else {
    return `${(num * 100).toFixed(2)}w`;
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
