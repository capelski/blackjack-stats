export const toDecimal = (value: number, decimals = 2) => {
  return value.toFixed(decimals).replace(/\.0+$/, '');
};

export function toPercentage(probability: number): string {
  const percentage = probability * 100;

  if (percentage >= 0.01) {
    return `${percentage.toFixed(4)}%`;
  }

  return `${percentage.toExponential(1)}%`;
}
