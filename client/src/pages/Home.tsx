import { useAuctionCalculator, formatToE } from '@/hooks/useAuctionCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, TrendingUp } from 'lucide-react';
import { useState } from 'react';

/**
 * PY之神 - 拍賣場手續費折扣券計算器
 * 設計風格：專業深色主題
 */
export default function Home() {
  const {
    salePrice,
    setSalePrice,
    commissionRate,
    setCommissionRate,
    coupons,
    result,
    updateCouponPrice,
    resetToDefaults,
  } = useAuctionCalculator();

  const updateSalePrice = (value: number) => setSalePrice(value);

  const [vipEnabled, setVipEnabled] = useState(false);

  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseFloat(value) || 0;
    updateSalePrice(num);
  };

  const handleCommissionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseFloat(value) || 0;
    setCommissionRate(num / 100);
  };

  const handleCouponPriceChange = (couponId: string, value: string) => {
    const num = parseFloat(value) || 0;
    updateCouponPrice(couponId, num);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 頂部導航欄 */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 左側：品牌標識 */}
          <div className="flex items-center gap-4">
            <img
              src="/manus-storage/lucky_cat_9ebc78c7.png"
              alt="PY之神"
              className="w-20 h-20 object-contain flex-shrink-0"
            />
            <div>
              <span className="text-white font-semibold text-2xl">PY之神</span>
              <span className="text-gray-400 text-sm ml-2">v1.0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主容器 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mabi拍賣手續費計算器</h1>
          <p className="text-gray-400 text-sm">
            優化您的折扣券使用策略，最大化收益。輸入售價、手續費率、折扣券價格即可自動推薦最優方案。
          </p>
        </div>

        {/* 內容區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側面板：基本設置 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-emerald-400">≡</span>
                基本設置
              </h2>

              {/* 售價輸入 */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  拍出價格 (E)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={handleSalePriceChange}
                    step="0.01"
                    className="w-full bg-gray-800 border-gray-700 text-white pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">E</span>
                </div>
                <div className="text-gray-400 text-xs mt-2">{formatToE(salePrice)}</div>
              </div>

              {/* VIP 服務 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-lg">👤</span>
                  <div>
                    <div className="text-gray-300 text-sm font-medium">VIP 服務</div>
                    <div className="text-gray-500 text-xs">手續費 5%</div>
                  </div>
                </div>
                <Switch checked={vipEnabled} onCheckedChange={setVipEnabled} />
              </div>

              {/* 折扣券價格設置 */}
              <div>
                <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="text-emerald-400">◻</span>
                  折扣券價格 (kw)
                </h3>
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div key={coupon.id}>
                      <label className="block text-gray-400 text-xs mb-2">
                        {coupon.name} (手續費優惠 {coupon.name === '30% 折扣券' ? '30%' : coupon.name === '50% 折扣券' ? '50%' : '100%'})
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={coupon.price}
                          onChange={(e) => handleCouponPriceChange(coupon.id, e.target.value)}
                          step="0.01"
                          className="w-full bg-gray-800 border-gray-700 text-white pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">kw</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 重置按鈕 */}
              <Button
                onClick={resetToDefaults}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg h-10"
                variant="ghost"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重置為預設值
              </Button>
            </div>
          </div>

          {/* 右側面板：結果 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本計算 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span className="text-emerald-400">◻</span>
                基本計算
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">原始手續費</div>
                  <div className="text-2xl font-bold text-white">{formatToE(result.originalCommission)}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">不用折扣券收入</div>
                  <div className="text-2xl font-bold text-white">{formatToE(result.incomeWithoutCoupon)}</div>
                </div>
              </div>
            </div>

            {/* 折扣券對比 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span className="text-emerald-400">◻</span>
                折扣券對比
              </h2>
              <div className="space-y-3">
                {result.coupons.map((coupon, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-emerald-400 font-semibold">{coupon.couponName}</div>
                        <div className="text-gray-400 text-xs">券價：{formatToE(coupon.couponPrice)}</div>
                      </div>
                      <div className={`text-lg font-bold ${coupon.netProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {coupon.netProfitLoss >= 0 ? '+' : ''}{formatToE(coupon.netProfitLoss)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs">手續費減少</div>
                        <div className="text-gray-300">{formatToE(coupon.commissionReduction)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">最終收入</div>
                        <div className="text-gray-300">{formatToE(coupon.finalIncome)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 最佳策略 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                最佳策略
              </h2>
              {result.bestStrategy && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-2">推薦方案</div>
                <div className="text-emerald-400 font-semibold mb-3">{result.bestStrategy.couponName}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-xs">最終收入</div>
                    <div className="text-white font-semibold">{formatToE(result.bestStrategy.finalIncome)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">淨獲利</div>
                    <div className={`font-semibold ${result.bestStrategy.netProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.bestStrategy.netProfitLoss >= 0 ? '+' : ''}{formatToE(result.bestStrategy.netProfitLoss)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* 底部說明 */}
        <div className="mt-8 text-center text-gray-500 text-xs space-y-1">
          <p>單位轉換規則：1E = 1 億 | 1kw = 1000 萬 | 1w = 100 萬</p>
          <p>© 2026 PY之神 - Mabi拍賣手續費計算器</p>
        </div>
      </div>
    </div>
  );
}
