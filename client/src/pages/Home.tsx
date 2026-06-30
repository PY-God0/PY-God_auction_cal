import { useEffect } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { Button } from '@/components/ui/button';
import { Delete, RotateCcw } from 'lucide-react';

/**
 * 計算機應用程式主頁面
 * 設計風格：玻璃擬態 (Glassmorphism)
 * - 深色漸變背景
 * - 毛玻璃卡片效果
 * - 青色強調色和流暢動畫
 */
export default function Home() {
  const {
    display,
    handleNumber,
    handleDecimal,
    handleOperation,
    handleEquals,
    handleClear,
    handleDelete,
    handlePercentage,
    handleToggleSign,
    handleKeyboard,
  } = useCalculator();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyboard(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyboard]);

  const buttonClass = `
    h-16 text-lg font-semibold rounded-xl
    bg-white/10 hover:bg-white/20 active:scale-95
    text-white border border-white/20
    transition-all duration-200 ease-out
    hover:shadow-lg hover:shadow-cyan-500/20
    active:shadow-md
  `;

  const operationButtonClass = `
    ${buttonClass}
    bg-gradient-to-br from-cyan-500/30 to-blue-500/20
    hover:from-cyan-500/40 hover:to-blue-500/30
    hover:shadow-cyan-500/30
  `;

  const equalsButtonClass = `
    ${buttonClass}
    bg-gradient-to-br from-cyan-500 to-blue-500
    hover:from-cyan-600 hover:to-blue-600
    hover:shadow-cyan-500/50
    text-white font-bold
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 計算機卡片容器 */}
      <div
        className="w-full max-w-sm"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="rounded-3xl p-6 shadow-2xl"
          style={{
            background: 'rgba(30, 58, 90, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* 標題 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">計算機</h1>
            <p className="text-white/50 text-sm">精確計算，優雅體驗</p>
          </div>

          {/* 顯示屏 */}
          <div
            className="mb-6 p-4 rounded-2xl text-right"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div
              className="display-number text-5xl text-white break-words"
              style={{
                wordBreak: 'break-all',
                minHeight: '3rem',
              }}
            >
              {display}
            </div>
          </div>

          {/* 按鈕網格 */}
          <div className="grid grid-cols-4 gap-3">
            {/* 第一行：清除、刪除、百分比、除法 */}
            <Button
              onClick={handleClear}
              className={`${buttonClass} col-span-1`}
              variant="ghost"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleDelete}
              className={`${buttonClass} col-span-1`}
              variant="ghost"
            >
              <Delete className="w-5 h-5" />
            </Button>
            <Button
              onClick={handlePercentage}
              className={buttonClass}
              variant="ghost"
            >
              %
            </Button>
            <Button
              onClick={() => handleOperation('/')}
              className={operationButtonClass}
              variant="ghost"
            >
              ÷
            </Button>

            {/* 第二行：7、8、9、乘法 */}
            <Button
              onClick={() => handleNumber('7')}
              className={buttonClass}
              variant="ghost"
            >
              7
            </Button>
            <Button
              onClick={() => handleNumber('8')}
              className={buttonClass}
              variant="ghost"
            >
              8
            </Button>
            <Button
              onClick={() => handleNumber('9')}
              className={buttonClass}
              variant="ghost"
            >
              9
            </Button>
            <Button
              onClick={() => handleOperation('*')}
              className={operationButtonClass}
              variant="ghost"
            >
              ×
            </Button>

            {/* 第三行：4、5、6、減法 */}
            <Button
              onClick={() => handleNumber('4')}
              className={buttonClass}
              variant="ghost"
            >
              4
            </Button>
            <Button
              onClick={() => handleNumber('5')}
              className={buttonClass}
              variant="ghost"
            >
              5
            </Button>
            <Button
              onClick={() => handleNumber('6')}
              className={buttonClass}
              variant="ghost"
            >
              6
            </Button>
            <Button
              onClick={() => handleOperation('-')}
              className={operationButtonClass}
              variant="ghost"
            >
              −
            </Button>

            {/* 第四行：1、2、3、加法 */}
            <Button
              onClick={() => handleNumber('1')}
              className={buttonClass}
              variant="ghost"
            >
              1
            </Button>
            <Button
              onClick={() => handleNumber('2')}
              className={buttonClass}
              variant="ghost"
            >
              2
            </Button>
            <Button
              onClick={() => handleNumber('3')}
              className={buttonClass}
              variant="ghost"
            >
              3
            </Button>
            <Button
              onClick={() => handleOperation('+')}
              className={operationButtonClass}
              variant="ghost"
            >
              +
            </Button>

            {/* 第五行：0、小數點、正負號、等於 */}
            <Button
              onClick={() => handleNumber('0')}
              className={`${buttonClass} col-span-2`}
              variant="ghost"
            >
              0
            </Button>
            <Button
              onClick={handleDecimal}
              className={buttonClass}
              variant="ghost"
            >
              .
            </Button>
            <Button
              onClick={handleEquals}
              className={equalsButtonClass}
              variant="ghost"
            >
              =
            </Button>
          </div>

          {/* 正負號按鈕 */}
          <Button
            onClick={handleToggleSign}
            className={`${buttonClass} w-full mt-3`}
            variant="ghost"
          >
            +/−
          </Button>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-6 text-white/40 text-sm">
          <p>使用鍵盤或滑鼠進行計算</p>
          <p>按 ESC 清除 | 按 Backspace 刪除</p>
        </div>
      </div>
    </div>
  );
}
