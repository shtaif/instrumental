import { type HoldingStats } from '../positionsService/index.js';
import { type UpdatedSymbolPrice } from '../marketDataService/index.js';

export { calcHoldingRevenue };

function calcHoldingRevenue(input: { holding: HoldingStats; priceInfo: UpdatedSymbolPrice }): {
  fraction: number;
  amount: number;
} {
  const { holding, priceInfo } = input;

  if (holding.breakEvenPrice === null || priceInfo === null) {
    return { amount: 0, fraction: 0 };
  }

  // const breakEvenPrice = new Decimal(holding.totalPresentInvestedAmount).div(holding.totalQuantity);

  // const amount = new Decimal(priceInfo.regularMarketPrice)
  //   .minus(breakEvenPrice)
  //   .times(holding.totalQuantity)
  //   .toNumber();
  // const percent = new Decimal(priceInfo.regularMarketPrice)
  //   .div(breakEvenPrice)
  //   .minus(1)
  //   .times(100)
  //   .toNumber();

  const amount = (priceInfo.regularMarketPrice - holding.breakEvenPrice) * holding.totalQuantity;
  const fraction = priceInfo.regularMarketPrice / holding.breakEvenPrice - 1;

  return { amount, fraction };
}
