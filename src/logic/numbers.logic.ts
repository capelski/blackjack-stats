export const getNumericKeys = (target: {}) => {
  return Object.keys(target)
    .map(parseFloat)
    .sort((a, b) => a - b);
};

export const toDecimal = (value: number, decimals = 2) => {
  return value.toFixed(decimals).replace(/\.0+$/, '');
};

export const toPercentage = (value: number) => {
  return `${toDecimal(value * 100)}%`;
};
