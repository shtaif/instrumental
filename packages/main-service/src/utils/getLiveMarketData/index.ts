import { isEqual, values, compact, uniq } from 'lodash-es';
import { empty } from '@reactivex/ix-esnext-esm/asynciterable';
import { type DeepPartial } from 'utility-types';
import { pipe } from 'shared-utils';
import { itMap, itFilter, itLazyDefer, itShare, itCombineLatest } from 'iterable-operators';
import {
  type StatsObjectSpecifier,
  type StatsObjects,
} from '../observeStatsObjectChanges/index.js';
import { type HoldingStats, type Lot } from '../positionsService/index.js';
import { normalizeFloatImprecisions } from '../normalizeFloatImprecisions.js';
import { objectCreateNullProto } from '../objectCreateNullProto.js';
import { observeStatsWithMarketDataHelper } from './observeStatsWithMarketDataHelper.js';
import { type UpdatedSymbolPrice } from '../marketDataService/index.js';
import {
  observeCombinedPortfolioStats,
  type CombinedPortfolioStats,
} from './observeCombinedPortfolioStats/index.js';
// import { type AllLeafPropsIntoBools } from './AllLeafPropsIntoBools.js';
import { portfolioStatsCalcMarketStats } from './portfolioStatsCalcMarketStats.js';
import { calcPnlInTranslateCurrencies } from './calcPnlInTranslateCurrencies.js';
import { calcHoldingRevenue } from './calcHoldingRevenue.js';
import { calcPosDayUnrealizedPnl } from './calcPosDayUnrealizedPnl.js';
import { deepObjectPickFields, type DeepObjectFieldsPicked } from './deepObjectPickFields.js';

export {
  getLiveMarketData,
  type StatsObjectSpecifier,
  type MarketDataUpdate,
  type PortfolioMarketStatsUpdate,
  type HoldingMarketStatsUpdate,
  type HoldingStats,
  type LotMarketStatsUpdate,
  type Lot,
  type InstrumentMarketPriceInfo,
  type PnlInfo,
  observeCombinedPortfolioStats,
  type CombinedPortfolioStats,
};

// TODO: `combineLatest` from '@reactivex/ix-esnext-esm/asynciterable' becomes stuck indefinitely whenever any of its input iterables finishes empty of values - contribute to working this out through the public repo?

function getLiveMarketData<
  TTranslateCurrencies extends string,
  TSelectedFields extends SelectableFields,
>(params: {
  specifiers: StatsObjectSpecifier[];
  translateToCurrencies?: TTranslateCurrencies[];
  fields: TSelectedFields;
}): AsyncIterable<DeepObjectFieldsPicked<MarketDataUpdate<TTranslateCurrencies>, TSelectedFields>>;

function getLiveMarketData(params: {
  specifiers: StatsObjectSpecifier[];
  translateToCurrencies?: string[];
  fields: SelectableFields;
}): AsyncIterable<DeepPartial<MarketDataUpdate<string>>> {
  // TODO: Need to enhance logic such that empty holding stats and empty lots symbols are excluded from the price observations, and are only reported once in the initial message with their zero stats

  const paramsNorm = {
    specifiers: params.specifiers,
    translateToCurrencies: params.translateToCurrencies ?? [],
    fields: {
      portfolios: params.fields?.portfolios ?? {},
      holdings: params.fields?.holdings ?? {},
      lots: params.fields?.lots ?? {},
    },
  };

  if (!paramsNorm.specifiers.length) {
    return empty();
  }

  const [
    requestedSomePortfolioStatsMarketDataFields,
    requestedSomeHoldingStatsMarketDataFields,
    requestedSomeLotsMarketDataFields,
  ] = [
    pipe(paramsNorm.fields.portfolios, ({ pnl, marketValue }) => [
      pnl,
      pnl?.byTranslateCurrencies,
      marketValue,
    ])
      .flatMap(fields => values(fields))
      .some(val => val === true),

    pipe(paramsNorm.fields.holdings, ({ pnl, dayPnl, priceData, marketValue }) => [
      pnl,
      pnl?.byTranslateCurrencies,
      dayPnl,
      dayPnl?.byTranslateCurrencies,
      priceData,
      marketValue,
    ])
      .flatMap(fields => values(fields))
      .some(val => val === true),

    pipe(paramsNorm.fields.lots, ({ pnl, dayPnl, priceData, marketValue }) => [
      pnl,
      pnl?.byTranslateCurrencies,
      dayPnl,
      dayPnl?.byTranslateCurrencies,
      priceData,
      marketValue,
    ])
      .flatMap(fields => values(fields))
      .some(val => val === true),
  ];

  const requestedSomeMarketDataFields =
    requestedSomePortfolioStatsMarketDataFields ||
    requestedSomeHoldingStatsMarketDataFields ||
    requestedSomeLotsMarketDataFields;

  const requestedSomePriceDataFields = [
    paramsNorm.fields.holdings.priceData,
    paramsNorm.fields.lots.priceData,
  ].some(
    priceData =>
      priceData?.currency ||
      priceData?.marketState ||
      priceData?.regularMarketTime ||
      priceData?.regularMarketPrice ||
      priceData?.regularMarketChange ||
      priceData?.regularMarketChangeRate
  );

  const requestedSomeUnrealizedPnlFields = [
    paramsNorm.fields.portfolios.pnl,
    paramsNorm.fields.holdings.pnl,
    paramsNorm.fields.lots.pnl,
    // paramsNorm.fields.portfolios.dayPnl,
    paramsNorm.fields.holdings.dayPnl,
    paramsNorm.fields.lots.dayPnl,
  ].some(
    pnl =>
      pnl?.amount ||
      pnl?.fraction ||
      pnl?.percent ||
      pnl?.byTranslateCurrencies?.amount ||
      pnl?.byTranslateCurrencies?.currency ||
      pnl?.byTranslateCurrencies?.exchangeRate
  );

  const statsWithMarketDataIter = observeStatsWithMarketDataHelper({
    forStatsObjects: paramsNorm.specifiers,
    symbolExtractor: {
      ignoreClosedObjectStats: !requestedSomePriceDataFields,
      includeMarketDataFor: {
        portfolios: requestedSomePortfolioStatsMarketDataFields,
        holdings: requestedSomeHoldingStatsMarketDataFields,
        lots: requestedSomeLotsMarketDataFields,
      },
      translateToCurrencies: compact(paramsNorm.translateToCurrencies),
    },
  });

  return pipe(
    itCombineLatest(statsWithMarketDataIter),
    itMap(([{ changedStats, currentMarketData }]) => {
      // TODO: Need to refactor all calculations that follow to be decimal-accurate (with `pnpm add decimal.js-light`)

      const portfolioUpdates = (
        [
          [{ type: 'SET' }, changedStats.portfolioStats.set],
          [{ type: 'REMOVE' }, changedStats.portfolioStats.remove],
        ] as const
      ).flatMap(([{ type }, changed]) =>
        changed.map(pStats => {
          const { marketValue, pnl } =
            !requestedSomeUnrealizedPnlFields && !paramsNorm.fields.portfolios.marketValue
              ? {
                  marketValue: undefined,
                  pnl: undefined,
                }
              : (() => {
                  const { marketValue, pnlAmount, pnlPercent } = portfolioStatsCalcMarketStats(
                    pStats,
                    currentMarketData
                  );

                  const pnlByTranslateCurrencies = calcPnlInTranslateCurrencies(
                    pStats.forCurrency,
                    paramsNorm.translateToCurrencies,
                    pnlAmount,
                    currentMarketData
                  );

                  return {
                    marketValue: normalizeFloatImprecisions(marketValue),
                    pnl: {
                      amount: normalizeFloatImprecisions(pnlAmount),
                      percent: normalizeFloatImprecisions(pnlPercent),
                      byTranslateCurrencies: pnlByTranslateCurrencies,
                    },
                  };
                })();

          return {
            type,
            portfolio: pStats,
            marketValue,
            pnl,
          };
        })
      );

      const holdingUpdates = (
        [
          [{ type: 'SET' }, changedStats.holdingStats.set],
          [{ type: 'REMOVE' }, changedStats.holdingStats.remove],
        ] as const
      ).flatMap(([{ type }, changed]) =>
        changed.map(holding => {
          const priceUpdateForSymbol = currentMarketData[holding.symbol];

          const priceData = !requestedSomePriceDataFields
            ? undefined
            : {
                marketState: priceUpdateForSymbol.marketState,
                currency: priceUpdateForSymbol.currency,
                regularMarketTime: priceUpdateForSymbol.regularMarketTime,
                regularMarketPrice: priceUpdateForSymbol.regularMarketPrice,
                regularMarketChange: priceUpdateForSymbol.regularMarketChange,
                regularMarketChangeRate: priceUpdateForSymbol.regularMarketChangeRate,
              };

          const marketValue = (() => {
            if (!requestedSomeHoldingStatsMarketDataFields) {
              return;
            }
            return holding.totalQuantity === 0
              ? 0
              : holding.totalQuantity * priceUpdateForSymbol.regularMarketPrice;
          })();

          const dayPnl = !requestedSomeUnrealizedPnlFields
            ? undefined
            : (() => {
                const pnl = calcPosDayUnrealizedPnl({
                  position: holding,
                  priceInfo: priceUpdateForSymbol,
                });

                const pnlByTranslateCurrencies = calcPnlInTranslateCurrencies(
                  holding.symbolInfo.currency,
                  paramsNorm.translateToCurrencies,
                  pnl.amount,
                  currentMarketData
                );

                return {
                  amount: normalizeFloatImprecisions(pnl.amount),
                  fraction: normalizeFloatImprecisions(pnl.fraction),
                  get percent() {
                    return normalizeFloatImprecisions(pnl.fraction * 100);
                  },
                  byTranslateCurrencies: pnlByTranslateCurrencies,
                };
              })();

          const pnl = !requestedSomeUnrealizedPnlFields
            ? undefined
            : (() => {
                const { amount: pnlAmount, fraction: pnlFraction } = calcHoldingRevenue({
                  holding,
                  priceInfo: priceUpdateForSymbol,
                });

                const pnlByTranslateCurrencies = calcPnlInTranslateCurrencies(
                  holding.symbolInfo.currency,
                  paramsNorm.translateToCurrencies,
                  pnlAmount,
                  currentMarketData
                );

                return {
                  amount: normalizeFloatImprecisions(pnlAmount),
                  fraction: normalizeFloatImprecisions(pnlFraction),
                  get percent() {
                    return normalizeFloatImprecisions(pnlFraction * 100);
                  },
                  byTranslateCurrencies: pnlByTranslateCurrencies,
                };
              })();

          return {
            type,
            holding,
            priceData,
            marketValue,
            dayPnl,
            pnl,
          };
        })
      );

      const lotUpdates = (
        [
          [{ type: 'SET' }, changedStats.lots.set],
          [{ type: 'REMOVE' }, changedStats.lots.remove],
        ] as const
      ).flatMap(([{ type }, changed]) =>
        changed.map(lot => {
          const priceUpdateForSymbol = currentMarketData[lot.symbol];

          const priceData = !requestedSomePriceDataFields
            ? undefined
            : {
                currency: priceUpdateForSymbol.currency,
                marketState: priceUpdateForSymbol.marketState,
                regularMarketTime: priceUpdateForSymbol.regularMarketTime,
                regularMarketPrice: priceUpdateForSymbol.regularMarketPrice,
                regularMarketChange: priceUpdateForSymbol.regularMarketChange,
                regularMarketChangeRate: priceUpdateForSymbol.regularMarketChangeRate,
              };

          const marketValue = (() => {
            if (!requestedSomeLotsMarketDataFields) {
              return;
            }
            return lot.remainingQuantity === 0
              ? 0
              : lot.remainingQuantity * priceUpdateForSymbol.regularMarketPrice;
          })();

          const dayPnl = !requestedSomeUnrealizedPnlFields
            ? undefined
            : (() => {
                const [pnlAmount, pnlFraction] =
                  lot.remainingQuantity === 0
                    ? [0, 0]
                    : (() => {
                        const amount =
                          lot.remainingQuantity * priceUpdateForSymbol.regularMarketChange;
                        const fraction = amount / lot.openingTrade.price;
                        return [amount, fraction];
                      })();

                const pnlByTranslateCurrencies = calcPnlInTranslateCurrencies(
                  lot.symbolInfo.currency,
                  paramsNorm.translateToCurrencies,
                  pnlAmount,
                  currentMarketData
                );

                return {
                  amount: normalizeFloatImprecisions(pnlAmount),
                  fraction: normalizeFloatImprecisions(pnlFraction),
                  get percent() {
                    return normalizeFloatImprecisions(pnlFraction * 100);
                  },
                  byTranslateCurrencies: pnlByTranslateCurrencies,
                };
              })();

          const pnl = !requestedSomeUnrealizedPnlFields
            ? undefined
            : (() => {
                const [pnlAmount, pnlFraction] =
                  lot.remainingQuantity === 0
                    ? [0, 0]
                    : [
                        lot.remainingQuantity *
                          (priceUpdateForSymbol.regularMarketPrice - lot.openingTrade.price),
                        priceUpdateForSymbol.regularMarketPrice / lot.openingTrade.price - 1,
                      ];

                const pnlByTranslateCurrencies = calcPnlInTranslateCurrencies(
                  lot.symbolInfo.currency,
                  paramsNorm.translateToCurrencies,
                  pnlAmount,
                  currentMarketData
                );

                return {
                  amount: normalizeFloatImprecisions(pnlAmount),
                  fraction: normalizeFloatImprecisions(pnlFraction),
                  get percent() {
                    return normalizeFloatImprecisions(pnlFraction * 100);
                  },
                  byTranslateCurrencies: pnlByTranslateCurrencies,
                };
              })();

          return {
            type,
            lot,
            priceData,
            marketValue,
            dayPnl,
            pnl,
          };
        })
      );

      return {
        portfolios: portfolioUpdates,
        holdings: holdingUpdates,
        lots: lotUpdates,
      };
    }),
    source =>
      itLazyDefer(() => {
        const [allCurrPortfolioUpdates, allCurrHoldingUpdates, allCurrLotUpdates] = [
          objectCreateNullProto<{
            [ownerIdAndCurrency: string]: DeepPartial<PortfolioMarketStatsUpdate>;
          }>(),
          objectCreateNullProto<{
            [ownerIdAndSymbol: string]: DeepPartial<HoldingMarketStatsUpdate>;
          }>(),
          objectCreateNullProto<{
            [lotId: string]: DeepPartial<LotMarketStatsUpdate>;
          }>(),
        ];

        return pipe(
          source,
          itMap(({ portfolios, holdings, lots }) => {
            const [
              portfolioUpdatesRelevantToRequestor,
              holdingUpdatesRelevantToRequestor,
              lotUpdatesRelevantToRequestor,
            ] = [
              portfolios
                .map(update => ({
                  orig: update,
                  formatted: deepObjectPickFields(update, paramsNorm.fields.portfolios),
                }))
                .filter(({ orig, formatted }) => {
                  const ownerIdAndCurrency = `${orig.portfolio.ownerId}_${orig.portfolio.forCurrency ?? ''}`;
                  return (
                    orig.type === 'REMOVE' ||
                    !isEqual(allCurrPortfolioUpdates[ownerIdAndCurrency], formatted)
                  );
                }),

              holdings
                .map(update => ({
                  orig: update,
                  formatted: deepObjectPickFields(update, paramsNorm.fields.holdings),
                }))
                .filter(({ orig, formatted }) => {
                  const ownerIdAndSymbol = `${orig.holding.ownerId}_${orig.holding.symbol}`;
                  return (
                    orig.type === 'REMOVE' ||
                    !isEqual(allCurrHoldingUpdates[ownerIdAndSymbol], formatted)
                  );
                }),

              lots
                .map(update => ({
                  orig: update,
                  formatted: deepObjectPickFields(update, paramsNorm.fields.lots),
                }))
                .filter(
                  ({ orig, formatted }) =>
                    orig.type === 'REMOVE' || !isEqual(allCurrLotUpdates[orig.lot.id], formatted)
                ),
            ];

            for (const { orig, formatted } of portfolioUpdatesRelevantToRequestor) {
              const key = `${orig.portfolio.ownerId}_${orig.portfolio.forCurrency ?? ''}`;
              ({
                ['SET']: () => (allCurrPortfolioUpdates[key] = formatted),
                ['REMOVE']: () => delete allCurrPortfolioUpdates[key],
              })[orig.type]();
            }

            for (const { orig, formatted } of holdingUpdatesRelevantToRequestor) {
              const key = `${orig.holding.ownerId}_${orig.holding.symbol}`;
              ({
                ['SET']: () => (allCurrHoldingUpdates[key] = formatted),
                ['REMOVE']: () => delete allCurrHoldingUpdates[key],
              })[orig.type]();
            }

            for (const { orig, formatted } of lotUpdatesRelevantToRequestor) {
              const key = orig.lot.id;
              ({
                ['SET']: () => (allCurrLotUpdates[key] = formatted),
                ['REMOVE']: () => delete allCurrLotUpdates[key],
              })[orig.type]();
            }

            return {
              portfolios: portfolioUpdatesRelevantToRequestor.map(u => u.formatted),
              holdings: holdingUpdatesRelevantToRequestor.map(u => u.formatted),
              lots: lotUpdatesRelevantToRequestor.map(u => u.formatted),
            };
          })
        );
      }),
    itFilter(
      ({ portfolios, holdings, lots }, i) =>
        i === 0 || portfolios.length + holdings.length + lots.length > 0
    ),
    itShare()
  );
}

const unifiedCurrencyForPortfolioTotalValueCalcs = 'USD';

type SelectableFields = {
  lots?: LotsSelectableFields;
  holdings?: HoldingsSelectableFields;
  portfolios?: PortfoliosSelectableFields;
};

type LotsSelectableFields = {
  type?: boolean;
  lot?: {
    id?: boolean;
    ownerId?: boolean;
    openingTradeId?: boolean;
    symbol?: boolean;
    originalQuantity?: boolean;
    remainingQuantity?: boolean;
    realizedProfitOrLoss?: boolean;
    openedAt?: boolean;
    recordCreatedAt?: boolean;
    recordUpdatedAt?: boolean;
  };
  priceData?: {
    currency?: boolean;
    marketState?: boolean;
    regularMarketTime?: boolean;
    regularMarketPrice?: boolean;
    regularMarketChange?: boolean;
    regularMarketChangeRate?: boolean;
  };
  marketValue?: boolean;
  dayPnl?: {
    amount?: boolean;
    fraction?: boolean;
    percent?: boolean;
    byTranslateCurrencies?: {
      amount?: boolean;
      currency?: boolean;
      exchangeRate?: boolean;
    };
  };
  pnl?: {
    amount?: boolean;
    fraction?: boolean;
    percent?: boolean;
    byTranslateCurrencies?: {
      amount?: boolean;
      currency?: boolean;
      exchangeRate?: boolean;
    };
  };
};

type HoldingsSelectableFields = {
  type?: boolean;
  holding?: {
    symbol?: boolean;
    ownerId?: boolean;
    lastRelatedTradeId?: boolean;
    totalLotCount?: boolean;
    totalQuantity?: boolean;
    totalPresentInvestedAmount?: boolean;
    totalRealizedAmount?: boolean;
    totalRealizedProfitOrLossAmount?: boolean;
    totalRealizedProfitOrLossRate?: boolean;
    breakEvenPrice?: boolean;
    lastChangedAt?: boolean;
  };
  priceData?: {
    currency?: boolean;
    marketState?: boolean;
    regularMarketTime?: boolean;
    regularMarketPrice?: boolean;
    regularMarketChange?: boolean;
    regularMarketChangeRate?: boolean;
  };
  marketValue?: boolean;
  dayPnl?: {
    amount?: boolean;
    fraction?: boolean;
    percent?: boolean;
    byTranslateCurrencies?: {
      amount?: boolean;
      currency?: boolean;
      exchangeRate?: boolean;
    };
  };
  pnl?: {
    amount?: boolean;
    fraction?: boolean;
    percent?: boolean;
    byTranslateCurrencies?: {
      amount?: boolean;
      currency?: boolean;
      exchangeRate?: boolean;
    };
  };
};

type PortfoliosSelectableFields = {
  type?: boolean;
  portfolio?: {
    relatedTradeId?: boolean;
    ownerId?: boolean;
    forCurrency?: boolean;
    totalPresentInvestedAmount?: boolean;
    totalRealizedAmount?: boolean;
    totalRealizedProfitOrLossAmount?: boolean;
    totalRealizedProfitOrLossRate?: boolean;
    lastChangedAt?: boolean;
  };
  marketValue?: boolean;
  pnl?: {
    amount?: boolean;
    fraction?: boolean;
    percent?: boolean;
    byTranslateCurrencies?: {
      amount?: boolean;
      currency?: boolean;
      exchangeRate?: boolean;
    };
  };
};

type MarketDataUpdate<TTranslateCurrencies extends string = string> = {
  portfolios: PortfolioMarketStatsUpdate<TTranslateCurrencies>[];
  holdings: HoldingMarketStatsUpdate<TTranslateCurrencies>[];
  lots: LotMarketStatsUpdate<TTranslateCurrencies>[];
};

type PortfolioMarketStatsUpdate<TTranslateCurrencies extends string = string> = {
  type: 'SET' | 'REMOVE';
  portfolio: StatsObjects['portfolioStatsChanges'][string];
  marketValue: number;
  pnl: PnlInfo<TTranslateCurrencies>; // TODO: Rename this prop into `unrealizedPnl`
};

type HoldingMarketStatsUpdate<TTranslateCurrencies extends string = string> = {
  type: 'SET' | 'REMOVE';
  holding: HoldingStats;
  priceData: InstrumentMarketPriceInfo;
  marketValue: number;
  dayPnl: PnlInfo<TTranslateCurrencies>; // TODO: Rename this prop into `unrealizedDayPnl`
  pnl: PnlInfo<TTranslateCurrencies>; // TODO: Rename this prop into `unrealizedPnl`
};

type LotMarketStatsUpdate<TTranslateCurrencies extends string = string> = {
  type: 'SET' | 'REMOVE';
  lot: Lot;
  priceData: InstrumentMarketPriceInfo;
  marketValue: number;
  dayPnl: PnlInfo<TTranslateCurrencies>; // TODO: Rename this prop into `unrealizedDayPnl`
  pnl: PnlInfo<TTranslateCurrencies>; // TODO: Rename this prop into `unrealizedPnl`
};

type InstrumentMarketPriceInfo = Pick<
  NonNullable<UpdatedSymbolPrice>,
  | 'marketState'
  | 'currency'
  | 'regularMarketTime'
  | 'regularMarketPrice'
  | 'regularMarketChange'
  | 'regularMarketChangeRate'
>;

type PnlInfo<TTranslateCurrencies extends string> = {
  fraction: number;
  amount: number;
  byTranslateCurrencies: {
    currency: TTranslateCurrencies;
    exchangeRate: number;
    amount: number;
  }[];
  /** @deprecated use the `fraction` property instead */
  percent: number;
};
