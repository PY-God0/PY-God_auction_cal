import { useAuctionCalculator, formatToE } from '@/hooks/useAuctionCalculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, TrendingUp, Settings, Moon, Sun, BookmarkPlus, Copy, Check } from 'lucide-react';
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
    updateCouponPrice,
    result,
    resetToDefaults,
  } = useAuctionCalculator();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 頂部導航欄 */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 左側：品牌標識 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">PY之神</span>
              <span className="text-gray-400 text-xs ml-2">v1.0</span>
            </div>
          </div>

          {/* 右側：功能按鈕 */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 綠色提示條 */}
      <div className="bg-emerald-900/30 border-b border-emerald-800/50 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-emerald-300 text-sm">
          <BookmarkPlus className="w-4 h-4" />
          <span>收藏最佳折扣方案</span>
        </div>
      </div>

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
                <Input
                  type="number"
                  value={salePrice}
                  onChange={handleSalePriceChange}
                  step="0.01"
                  className="w-full bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* 手續費率輸入 */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  VIP 等級
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={(commissionRate * 100).toFixed(1)}
                    onChange={handleCommissionRateChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                  <span className="text-gray-400 text-sm">%</span>
                </div>
              </div>

              {/* 折扣券價格設置 */}
              <div>
                <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="text-emerald-400">◻</span>
                  折扣券價格 (kw)
                </h3>
                <div className="space-y-2">
                  {coupons.map((coupon) => (
                    <div key={coupon.id}>
                      <label className="block text-gray-400 text-xs mb-1">
                        {coupon.name}
                      </label>
                      <Input
                        type="number"
                        value={coupon.price}
                        onChange={(e) => handleCouponPriceChange(coupon.id, e.target.value)}
                        step="0.01"
                        className="w-full bg-gray-800 border-gray-700 text-white text-sm"
                      />
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
                <div className="bg-gray-800/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">原始手續費</p>
                  <p className="text-white text-2xl font-semibold">
                    {formatToE(result.originalCommission)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">不用折扣券收入</p>
                  <p className="text-white text-2xl font-semibold">
                    {formatToE(result.incomeWithoutCoupon)}
                  </p>
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
                {result.coupons.map((coupon) => (
                  <div
                    key={coupon.couponId}
                    className="bg-gray-800/50 border border-gray-700 rounded p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-semibold flex items-center gap-2">
                          <span className="text-emerald-400">◻</span>
                          {coupon.couponName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          券價：{formatToE(coupon.couponPrice)}
                        </p>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          coupon.isProfit ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {coupon.isProfit ? '+' : ''}
                        {formatToE(coupon.netProfitLoss)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">手續費減少</p>
                        <p className="text-white font-semibold">
                          {formatToE(coupon.commissionReduction)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">最終收入</p>
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
              <div className="bg-gray-900 border border-emerald-800/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <span className="text-emerald-400">⊙</span>
                  建議下單資訊折扣
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded p-4">
                    <p className="text-gray-400 text-sm mb-1">最終收入</p>
                    <p className="text-white text-xl font-semibold">
                      {formatToE(result.bestStrategy.finalIncome)}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded p-4">
                    <p className="text-gray-400 text-sm mb-1">購買折扣券</p>
                    <p className="text-emerald-400 text-xl font-semibold">
                      {result.bestStrategy.couponName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部說明 */}
        <div className="mt-12 text-center text-gray-500 text-xs space-y-1 border-t border-gray-800 pt-6">
          <p>根據您的售價和折扣券價格自動計算最優方案</p>
          <p>單位：1E = 1億 | 1kw = 1000萬 | 1w = 100萬</p>
          <p className="mt-4">© 2026 PY之神 - Mabi拍賣手續費計算器</p>
        </div>
      </div>
    </div>
  );
}
