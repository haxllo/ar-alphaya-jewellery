import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeVisible(): R
      toBeEmptyDOMElement(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveAttribute(attr: string, value?: unknown): R
      toHaveClass(...classNames: string[]): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, unknown>): R
      toHaveStyle(css: string | Record<string, unknown>): R
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R
      toHaveValue(value: string | string[] | number): R
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
      toBeChecked(): R
      toHaveAccessibleDescription(text?: string | RegExp): R
      toHaveAccessibleName(text?: string | RegExp): R
      toHaveErrorMessage(text?: string | RegExp): R
    }
  }
}
