import { compact } from 'lodash-es';
import { pipe } from 'shared-utils';
import { itMap } from 'iterable-operators';
import { type Resolvers, type Subscription } from '../../../generated/graphql-schema.js';
import { getLiveMarketData } from '../../../utils/getLiveMarketData/index.js';
import { gqlFormattedFieldSelectionTree } from '../../../utils/gqlFormattedFieldSelectionTree/index.js';
import { authenticatedSessionResolverMiddleware } from '../../resolverMiddleware/authenticatedSessionResolverMiddleware.js';

export { resolvers };

const resolvers = {
  Subscription: {
    positions: {
      resolve: undefined,
      subscribe: authenticatedSessionResolverMiddleware((_, args, ctx, info) => {
        const requestedFields = gqlFormattedFieldSelectionTree<Subscription['positions']>(info);

        const specifiers = args.filters?.symbols?.length
          ? args.filters.symbols.map(symbol => ({
              type: 'POSITION' as const,
              holdingPortfolioOwnerId: ctx.activeSession.activeUserId,
              holdingSymbol: symbol,
            }))
          : [
              {
                type: 'POSITION' as const,
                holdingPortfolioOwnerId: ctx.activeSession.activeUserId,
              },
            ];

        const translateCurrency =
          requestedFields.data?.subFields.unrealizedPnl?.subFields.currencyAdjusted?.args.currency;

        return pipe(
          getLiveMarketData({
            specifiers,
            translateToCurrencies: compact([translateCurrency]),
            fields: {
              holdings: {
                type: !!requestedFields.type,
                holding: pipe(requestedFields.data?.subFields, fields => ({
                  symbol: !!fields?.symbol,
                  ownerId: !!fields?.ownerId,
                  lastRelatedTradeId: !!fields?.lastRelatedTradeId,
                  totalLotCount: !!fields?.totalLotCount,
                  totalQuantity: !!fields?.totalQuantity,
                  totalPresentInvestedAmount: !!fields?.totalPresentInvestedAmount,
                  totalRealizedAmount: !!fields?.totalRealizedAmount,
                  totalRealizedProfitOrLossAmount: !!fields?.totalRealizedProfitOrLossAmount,
                  totalRealizedProfitOrLossRate: !!fields?.totalRealizedProfitOrLossRate,
                  currentPortfolioPortion: !!fields?.currentPortfolioPortion,
                  breakEvenPrice: !!fields?.breakEvenPrice,
                  lastChangedAt: !!fields?.lastChangedAt,
                })),
                priceData: pipe(requestedFields.data?.subFields.priceData?.subFields, fields => ({
                  currency: !!fields?.currency,
                  marketState: !!fields?.marketState,
                  regularMarketTime: !!fields?.regularMarketTime,
                  regularMarketPrice: !!fields?.regularMarketPrice,
                  regularMarketChange: !!fields?.regularMarketChange,
                  regularMarketChangeRate: !!fields?.regularMarketChangeRate,
                })),
                marketValue: !!requestedFields.data?.subFields.marketValue,
                dayPnl: pipe(
                  requestedFields.data?.subFields.unrealizedDayPnl?.subFields,
                  fields => ({
                    amount: !!fields?.amount,
                    fraction: !!fields?.fraction,
                    percent: !!fields?.percent,
                    byTranslateCurrencies: pipe(fields?.currencyAdjusted?.subFields, fields => ({
                      amount: !!fields?.amount,
                      currency: !!fields?.currency,
                      exchangeRate: !!fields?.exchangeRate,
                    })),
                  })
                ),
                pnl: pipe(requestedFields.data?.subFields.unrealizedPnl?.subFields, fields => ({
                  amount: !!fields?.amount,
                  fraction: !!fields?.fraction,
                  percent: !!fields?.percent,
                  byTranslateCurrencies: pipe(fields?.currencyAdjusted?.subFields, fields => ({
                    amount: !!fields?.amount,
                    currency: !!fields?.currency,
                    exchangeRate: !!fields?.exchangeRate,
                  })),
                })),
              },
            },
          }),
          itMap(updates =>
            updates.holdings.map(({ type, holding: pos, priceData, marketValue, dayPnl, pnl }) => ({
              type,
              data: {
                ...pos,
                priceData,
                marketValue,
                unrealizedDayPnl: !dayPnl
                  ? undefined
                  : {
                      fraction: dayPnl.fraction,
                      percent: dayPnl.percent,
                      amount: dayPnl.amount,
                      currencyAdjusted: dayPnl.byTranslateCurrencies?.[0],
                    },
                unrealizedPnl: !pnl
                  ? undefined
                  : {
                      fraction: pnl.fraction,
                      percent: pnl.percent,
                      amount: pnl.amount,
                      currencyAdjusted: pnl.byTranslateCurrencies?.[0],
                    },
              },
            }))
          ),
          itMap(relevantPositionUpdates => ({
            positions: relevantPositionUpdates,
          }))
        );
      }),
    },
  },
} satisfies Resolvers;
