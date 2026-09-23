const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

// Netokogus = brutokogus × (1 − kao% / 100)
export const calculateNetQuantity = (
  grossQuantity?: number,
  coldProcessingLoss?: number
): number | undefined => {
  if (!grossQuantity || coldProcessingLoss === undefined) {
    return undefined;
  }

  return round(grossQuantity * (1 - coldProcessingLoss / 100), 3);
};

// Kao % = (brutokogus − netokogus) / brutokogus × 100
export const calculateColdProcessingLoss = (
  grossQuantity?: number,
  netQuantity?: number
): number | undefined => {
  if (!grossQuantity || !netQuantity) {
    return undefined;
  }

  return round(((grossQuantity - netQuantity) / grossQuantity) * 100, 2);
};
