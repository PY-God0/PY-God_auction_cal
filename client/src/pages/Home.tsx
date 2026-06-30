import { useAuctionCalculator, formatToE } from '@/hooks/useAuctionCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, TrendingUp } from 'lucide-react';

/**
 * 拍賣場手續費折扣券計算器
 * 設計風格：玻璃擬態 (Glassmorphism)
 * 單位：以億 (E) 為基準
 */
export default function Home() {
  const {
    salePrice,
    setSalePrice,
    commissionRate,
    setCommissionRate,
    coupons,
    updateCouponPrice,
    result,
    resetToDefaults,
  } = useAuctionCalculator();

  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseFloat(value) || 0;
    setSalePrice(num);
  };

  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCommissionRate(Math.max(0, Math.min(1, value)));
  };

  const handleCouponPriceChange = (couponId: string, value: string) => {
    const num = parseFloat(value) || 0;
    updateCouponPrice(couponId, num);
  };

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.02 250) 0%, oklch(0.25 0.03 260) 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">拍賣場手續費計算器</h1>
          <p className="text-white/60">優化您的折扣券使用策略，最大化收益（單位：億 E）</p>
        </div>

        {/* 主容器 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：輸入面板 */}
          <div
            className="lg:col-span-1 rounded-3xl p-6 shadow-2xl"
            style={{
              background: 'rgba(30, 58, 90, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6">基本設置</h2>

            {/* 售價輸入 */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-semibold mb-2">
                售出價格 (E)
              </label>
              <Input
                type="number"
                value={salePrice}
                onChange={handleSalePriceChange}
                step="0.01"
                className="w-full bg-white/10 border-white/20 text-white placeholder-white/40"
                placeholder="例如：45"
              />
              <p className="text-white/50 text-xs mt-2">
                {formatToE(salePrice)}
              </p>
            </div>

            {/* 手續費率輸入 */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-semibold mb-2">
                手續費率 (%)
              </label>
              <Input
                type="number"
                value={(commissionRate * 100).toFixed(1)}
                onChange={handleCommissionRateChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full bg-white/10 border-white/20 text-white placeholder-white/40"
              />
            </div>

            {/* 折扣券價格設置 */}
            <div className="mb-6">
              <h3 className="text-white/80 text-sm font-semibold mb-3">折扣券價格 (E)</h3>
              {coupons.map((coupon) => (
                <div key={coupon.id} className="mb-3">
                  <label className="block text-white/60 text-xs mb-1">
                    {coupon.name} ({Math.round(coupon.discountRate * 100)}%)
                  </label>
                  <Input
                    type="number"
                    value={coupon.price}
                    onChange={(e) => handleCouponPriceChange(coupon.id, e.target.value)}
                    step="0.01"
                    className="w-full bg-white/10 border-white/20 text-white placeholder-white/40 text-sm"
                    placeholder="例如：0.17"
                  />
                </div>
              ))}
            </div>

            {/* 重置按鈕 */}
            <Button
              onClick={resetToDefaults}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl h-10"
              variant="ghost"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重置為預設值
            </Button>
          </div>

          {/* 右側：結果面板 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 原始計算結果 */}
            <div
              className="rounded-3xl p-6 shadow-2xl"
              style={{
                background: 'rgba(30, 58, 90, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-xl font-bold text-white mb-4">基本計算</h2>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <p className="text-white/60 text-sm mb-1">原始手續費</p>
                  <p className="text-white text-lg font-semibold">
                    {formatToE(result.originalCommission)}
                  </p>
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <p className="text-white/60 text-sm mb-1">不用折扣券收入</p>
                  <p className="text-white text-lg font-semibold">
                    {formatToE(result.incomeWithoutCoupon)}
                  </p>
                </div>
              </div>
            </div>

            {/* 折扣券對比 */}
            <div
              className="rounded-3xl p-6 shadow-2xl"
              style={{
                background: 'rgba(30, 58, 90, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-xl font-bold text-white mb-4">折扣券對比</h2>
              <div className="space-y-3">
                {result.coupons.map((coupon) => (
                  <div
                    key={coupon.couponId}
                    className="p-4 rounded-2xl border"
                    style={{
                      background: coupon.isProfit
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      borderColor: coupon.isProfit
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">{coupon.couponName}</p>
                        <p className="text-white/60 text-sm">
                          券價：{formatToE(coupon.couponPrice)}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          coupon.isProfit
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {coupon.isProfit ? '+' : ''}
                        {formatToE(coupon.netProfitLoss)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-white/60">手續費減少</p>
                        <p className="text-white font-semibold">
                          {formatToE(coupon.commissionReduction)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">最終收入</p>
                        <p className="text-white font-semibold">
                          {formatToE(coupon.finalIncome)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 最佳策略推薦 */}
            {result.bestStrategy && (
              <div
                className="rounded-3xl p-6 shadow-2xl border-2"
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                }}
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">最佳策略推薦</h3>
                    <p className="text-white/80 mb-3">
                      購買 <span className="font-semibold text-cyan-300">{result.bestStrategy.couponName}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-sm">最終收入</p>
                        <p className="text-white text-xl font-bold">
                          {formatToE(result.bestStrategy.finalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">相比無折扣增加</p>
                        <p className="text-green-300 text-xl font-bold">
                          +{formatToE(
                            result.bestStrategy.finalIncome - result.incomeWithoutCoupon
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部說明 */}
        <div className="text-center mt-8 text-white/40 text-sm">
          <p>根據您的售價和折扣券價格自動計算最優方案</p>
          <p className="mt-1">單位說明：1E = 1億 = 100,000,000</p>
        </div>
      </div>
    </div>
  );
}
