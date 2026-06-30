import { useState, useCallback } from 'react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  history: string[];
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    history: [],
  });

  const handleNumber = useCallback((num: string) => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: num,
          waitingForNewValue: false,
        };
      }
      return {
        ...prev,
        display: prev.display === '0' ? num : prev.display + num,
      };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: '0.',
          waitingForNewValue: false,
        };
      }
      if (prev.display.includes('.')) {
        return prev;
      }
      return {
        ...prev,
        display: prev.display + '.',
      };
    });
  }, []);

  const handleOperation = useCallback((op: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);

      if (prev.operation && !prev.waitingForNewValue) {
        const result = calculate(prev.previousValue!, prev.operation, currentValue);
        return {
          ...prev,
          display: String(result),
          previousValue: result,
          operation: op,
          waitingForNewValue: true,
        };
      }

      return {
        ...prev,
        previousValue: currentValue,
        operation: op,
        waitingForNewValue: true,
      };
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState((prev) => {
      if (!prev.operation || prev.previousValue === null) {
        return prev;
      }

      const currentValue = parseFloat(prev.display);
      const result = calculate(prev.previousValue, prev.operation, currentValue);
      const historyEntry = `${prev.previousValue} ${prev.operation} ${currentValue} = ${result}`;

      return {
        ...prev,
        display: String(result),
        previousValue: null,
        operation: null,
        waitingForNewValue: true,
        history: [historyEntry, ...prev.history.slice(0, 9)],
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      history: [],
    });
  }, []);

  const handleDelete = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return prev;
      }
      const newDisplay = prev.display.slice(0, -1) || '0';
      return {
        ...prev,
        display: newDisplay,
      };
    });
  }, []);

  const handlePercentage = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      const result = value / 100;
      return {
        ...prev,
        display: String(result),
      };
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      return {
        ...prev,
        display: String(-value),
      };
    });
  }, []);

  const handleKeyboard = useCallback((key: string) => {
    if (/[0-9]/.test(key)) {
      handleNumber(key);
    } else if (key === '.') {
      handleDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperation(key);
    } else if (key === 'Enter' || key === '=') {
      handleEquals();
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === 'Escape') {
      handleClear();
    }
  }, [handleNumber, handleDecimal, handleOperation, handleEquals, handleDelete, handleClear]);

  return {
    display: state.display,
    history: state.history,
    handleNumber,
    handleDecimal,
    handleOperation,
    handleEquals,
    handleClear,
    handleDelete,
    handlePercentage,
    handleToggleSign,
    handleKeyboard,
  };
}

function calculate(prev: number, operation: string, current: number): number {
  switch (operation) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '*':
      return prev * current;
    case '/':
      return current === 0 ? 0 : prev / current;
    default:
      return current;
  }
}
