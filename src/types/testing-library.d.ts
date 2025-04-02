// src/types/testing-library.d.ts
import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      // Add dom matchers
      toBeInTheDocument(): AsymmetricMatcher;
      toHaveTextContent(text: string | RegExp): AsymmetricMatcher;
      toHaveStyle(css: Record<string, string | number>): AsymmetricMatcher;
      // You can add other matchers you use here
    }

    interface ExpectStatic {
      // Add dom matchers
      toBeInTheDocument(): void;
      toHaveTextContent(text: string | RegExp): void;
      toHaveStyle(css: Record<string, string | number>): void;
      // You can add other matchers you use here
    }
  }
}
