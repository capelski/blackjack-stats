export const getSortedNumericKeys = <T extends object>(target: T) => {
  return Object.keys(target)
    .map(parseFloat)
    .sort((a, b) => a - b);
};

export const toDecimal = (value: number, decimals: number) => {
  return value.toFixed(decimals).replace(/\.0+$/, '');
};

export function toPercentage(probability: number, decimals: number): string {
  const percentage = probability * 100;

  const threshold = 1 / Math.pow(10, decimals);
  if (percentage === 0 || Math.abs(percentage) >= threshold) {
    return `${percentage.toFixed(decimals)}%`;
  }

  return `${percentage.toExponential(1)}%`;
}
