import React, { useMemo } from 'react';
import { Skeleton, Tag, Typography } from 'antd';
import { pipe } from 'shared-utils';
import { useAsyncIter, type MaybeAsyncIterable } from 'react-async-iterators';
import { PnlArrowIcon } from '../../PnlArrowIcon/index.tsx';
import './style.css';

export { UnrealizedPnlDisplay };

function UnrealizedPnlDisplay(props: {
  input?: MaybeAsyncIterable<{
    unrealizedPnlAmount?: number;
    unrealizedPnlFraction?: number;
    currency?: string;
  }>;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const next = useAsyncIter(props.input);

  const unrealizedPnlAmount = next.value?.unrealizedPnlAmount ?? 0;
  const unrealizedPnlFraction = next.value?.unrealizedPnlFraction ?? 0;
  const currency = next.value?.currency;

  const pnlValueFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        ...(currency && { style: 'currency', currency }),
        signDisplay: 'always',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }),
    [currency]
  );

  return (
    <div className={`cmp-unrealized-pnl-display ${props.className ?? ''}`} style={props.style}>
      {next.pendingFirst || props.loading ? (
        <div className="loading-state-container">
          <div className="pnl-amount-skel">
            <Skeleton.Button active block={true} style={{ width: '', height: '100%' }} />
          </div>
          <Typography.Text className="slash-divider">/</Typography.Text>
          <div className="pnl-percentage-skel">
            <Skeleton.Button active block={true} style={{ width: '', height: '100%' }} />
          </div>
        </div>
      ) : (
        <Tag
          className="tag-wrapper"
          bordered={false}
          color={pipe(unrealizedPnlAmount, amount => (!amount ? '' : amount > 0 ? 'green' : 'red'))}
        >
          {unrealizedPnlAmount !== 0 && (
            <PnlArrowIcon
              className="profit-or-loss-indicator-arrow"
              isPositive={unrealizedPnlAmount > 0}
            />
          )}
          <Typography.Text className="pnl-amount-value">
            {unrealizedPnlAmount === undefined || currency === undefined ? (
              <>-</>
            ) : (
              <>{pnlValueFormatter.format(unrealizedPnlAmount)}</>
            )}
          </Typography.Text>
          <Typography.Text className="slash-divider">/</Typography.Text>
          <Typography.Text
            className={`pnl-percentage-value ${unrealizedPnlAmount > 0 ? 'has-profit' : unrealizedPnlAmount < 0 ? 'has-loss' : ''}`}
          >
            {unrealizedPnlFraction === undefined ? (
              <>-</>
            ) : (
              <>{percentFormatter.format(unrealizedPnlFraction)}</>
            )}
          </Typography.Text>
        </Tag>
      )}
    </div>
  );
}

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  signDisplay: 'always',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});
