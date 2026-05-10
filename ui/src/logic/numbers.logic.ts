export const getSortedNumericKeys = <T extends object>(target: T) => {
  return Object.keys(target)
    .map(parseFloat)
    .sort((a, b) => a - b);
};

export const toDecimal = (value: number, decimals = 2) => {
  return value.toFixed(decimals).replace(/\.0+$/, '');
};

export function toPercentage(probability: number): string {
  const percentage = probability * 100;

  if (percentage === 0 || Math.abs(percentage) >= 0.0001) {
    return `${percentage.toFixed(4)}%`;
  }

  return `${percentage.toExponential(1)}%`;
}
