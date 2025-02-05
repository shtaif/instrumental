import { type HoldingStats } from '../positionsService/index.js';
import { type UpdatedSymbolPrice } from '../marketDataService/index.js';

export { calcPosDayUnrealizedPnl };

function calcPosDayUnrealizedPnl(input: {
  position: HoldingStats;
  priceInfo: UpdatedSymbolPrice;
}): {
  amount: number;
  fraction: number;
} {
  const { position, priceInfo } = input;

  if (position.breakEvenPrice === null || priceInfo === null) {
    return { amount: 0, fraction: 0 };
  }

  const amount = priceInfo.regularMarketChange * position.totalQuantity;
  const fraction = priceInfo.regularMarketChange / position.breakEvenPrice;

  return { amount, fraction };
}
