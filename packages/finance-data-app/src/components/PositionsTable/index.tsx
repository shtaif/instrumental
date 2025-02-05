import React, { memo, useMemo, type ReactElement } from 'react';
import { range } from 'lodash-es';
import { Table, Skeleton, Typography } from 'antd';
import { of } from 'ix/Ix.asynciterable';
import { pipe } from 'shared-utils';
import { It, iterateFormatted, type MaybeAsyncIterable } from 'react-async-iterators';
import {
  asyncIterChannelize,
  type AsyncIterableChannelSubject,
} from '../../../../../../react-async-iterators/src/asyncIterChannelize/index.ts';
import { commonDecimalNumCurrencyFormat } from './utils/commonDecimalNumCurrencyFormat.tsx';
import { SymbolNameTag } from './components/SymbolNameTag/index.tsx';
import { PositionSizeDisplay } from './components/PositionSizeDisplay/index.tsx';
import { CurrentPriceDisplay } from './components/CurrentPriceDisplay/index.tsx';
import { MarketStateIndicatorIcon } from './components/MarketStateIndicatorIcon/index.tsx';
import { UnrealizedPnlDisplay } from '../common/UnrealizedPnlDisplay/index.tsx';
import {
  PositionExpandedLots,
  type PositionExpandedLotsProps,
} from './components/PositionExpandedLots/index.tsx';
import './style.css';

export { PositionsTableMemo as PositionsTable, type PositionRecord };

const PositionsTableMemo = memo(PositionsTable);

function PositionsTable(props: {
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  loadingStatePlaceholderRowsCount?: number;
  positions: MaybeAsyncIterable<PositionRecord[]>;
}): ReactElement {
  const {
    className = '',
    style,
    loading = false,
    loadingStatePlaceholderRowsCount = 3,
    positions,
  } = props;

  const splitPositionsIter = useMemo(
    () =>
      pipe(
        Symbol.asyncIterator in positions ? positions : of(positions),
        asyncIterChannelize({ key: p => p.symbol })
      ),
    [positions]
  );

  return (
    <It value={splitPositionsIter}>
      {({ pendingFirst: pendingFirstPositions, value: nextPositions = [] }) => {
        const dataSource: PositionTableRecord[] =
          loading || (pendingFirstPositions && !nextPositions?.length)
            ? range(loadingStatePlaceholderRowsCount).map((_, idx) => ({
                isLoading: true as const,
                idx,
              }))
            : nextPositions.map(({ /*key,*/ values }) => ({
                isLoading: false as const,
                values,
              }));

        return (
          <Table
            className={`cmp-positions-table ${className}`}
            style={style}
            size="small"
            scroll={{ x: 'max-content' }}
            pagination={false}
            rowKey={item => (item.isLoading ? `${item.idx}` : item.values.value.current.symbol)}
            dataSource={dataSource}
            expandable={{
              expandedRowClassName: () => 'comprising-lots-container',
              rowExpandable: () => true,
              expandedRowRender: (item, _i, _indent, expanded) =>
                expanded &&
                (item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <It value={item.values}>
                    {({ value: p }) => (
                      <PositionExpandedLots
                        lots={
                          !p.comprisingLots
                            ? undefined
                            : (() => {
                                const [iterFn, deps] = p.comprisingLots;
                                return [
                                  () =>
                                    iterateFormatted(iterFn(), lots =>
                                      lots.map(lot => ({ ...lot, currency: p.currency }))
                                    ),
                                  deps,
                                ];
                              })()
                        }
                      />
                    )}
                  </It>
                )),
            }}
          >
            <Column<PositionTableRecord>
              title={<span className="col-header">Symbol</span>}
              className="symbol-cell"
              fixed="left"
              render={(_, item) =>
                item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <div className="symbol-cell-content">
                    <It value={item.values}>
                      {({ value: p }) =>
                        p.marketState && (
                          <MarketStateIndicatorIcon
                            className="market-state-indicator"
                            marketState={p.marketState}
                          />
                        )
                      }
                    </It>
                    <SymbolNameTag symbol={item.values.value.current.symbol} />
                  </div>
                )
              }
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Current Price</span>}
              className="current-price-cell"
              render={(_, item) =>
                item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <It>
                    {iterateFormatted(item.values, p => (
                      <CurrentPriceDisplay
                        marketPrice={p.marketPrice}
                        currency={p.currency}
                        timeOfPrice={p.timeOfPrice}
                      />
                    ))}
                  </It>
                )
              }
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Break-even Price</span>}
              className="break-even-price-cell"
              render={(_, item) =>
                item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <It value={item.values}>
                    {({ value: p }) =>
                      p.breakEvenPrice === undefined ? (
                        <>-</>
                      ) : (
                        <>{commonDecimalNumCurrencyFormat(p.breakEvenPrice, p.currency)}</>
                      )
                    }
                  </It>
                )
              }
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Position</span>}
              className="quantity-cell"
              render={(_, item) =>
                item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <It>
                    {iterateFormatted(item.values, p => (
                      <PositionSizeDisplay
                        quantity={p.quantity}
                        marketValue={p.marketValue}
                        currency={p.currency}
                      />
                    ))}
                  </It>
                )
              }
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Daily Unrealized P&L</span>}
              className="daily-unrealized-pnl-cell"
              render={(_, item) => (
                <UnrealizedPnlDisplay
                  className="unrealized-pnl-display"
                  loading={item.isLoading}
                  input={
                    item.isLoading
                      ? undefined
                      : iterateFormatted(item.values, p => ({
                          unrealizedPnlAmount: p.unrealizedDayPnl?.amount,
                          unrealizedPnlFraction: p.unrealizedDayPnl?.fraction,
                          currency: p.currency,
                        }))
                  }
                />
              )}
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Unrealized P&L</span>}
              className="total-unrealized-pnl-cell"
              render={(_, item) => (
                <UnrealizedPnlDisplay
                  className="unrealized-pnl-display"
                  loading={item.isLoading}
                  input={
                    item.isLoading
                      ? undefined
                      : iterateFormatted(item.values, p => ({
                          unrealizedPnlAmount: p.unrealizedPnl?.amount,
                          unrealizedPnlFraction: p.unrealizedPnl?.fraction,
                          currency: p.currency,
                        }))
                  }
                />
              )}
            />

            <Column<PositionTableRecord>
              title={<span className="col-header">Portfolio portion</span>}
              className="portfolio-portion-cell"
              render={(_, item) =>
                item.isLoading ? (
                  <CellSkeleton />
                ) : (
                  <It value={item.values}>
                    {({ value: p }) => (
                      <Typography.Text className="portion">
                        {!p.portfolioValuePortion ? (
                          <>-</>
                        ) : (
                          p.portfolioValuePortion.toLocaleString(undefined, {
                            style: 'percent',
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })
                        )}
                      </Typography.Text>
                    )}
                  </It>
                )
              }
            />
          </Table>
        );
      }}
    </It>
  );
}

const { Column } = Table;

type PositionRecord = {
  symbol: string;
  currency?: string;
  portfolioValuePortion?: number;
  quantity?: number;
  breakEvenPrice?: number;
  marketValue?: number;
  marketState?: 'REGULAR' | 'CLOSED' | 'PRE' | 'PREPRE' | 'POST' | 'POSTPOST';
  marketPrice?: number;
  timeOfPrice?: Date | string | number;
  unrealizedDayPnl?: {
    amount?: number;
    fraction?: number;
  };
  unrealizedPnl?: {
    amount?: number;
    fraction?: number;
  };
  rawPositions?: {
    date: string;
    quantity: number;
    price: number;
    unrealizedPnl?: {
      amount?: number;
      fraction?: number;
    };
  }[];
  comprisingLots?: PositionExpandedLotsProps['lots'];
};

type PositionTableRecord =
  | { isLoading: true; idx: number }
  | { isLoading: false; values: AsyncIterableChannelSubject<PositionRecord, PositionRecord> };

const CellSkeleton = memo(() => {
  return <Skeleton active title={false} paragraph={{ rows: 1 }} />;
});
