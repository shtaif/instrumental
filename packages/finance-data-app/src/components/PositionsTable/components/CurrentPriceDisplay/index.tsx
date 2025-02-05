import { memo, type ReactElement } from 'react';
import { LivePriceDisplay } from '../../../LivePriceDisplay';
import { commonDecimalNumCurrencyFormat } from '../../utils/commonDecimalNumCurrencyFormat';
import { SymbolPriceUpdatedAt } from './components/SymbolPriceUpdatedAt';
import './style.css';

export { CurrentPriceDisplay };

const CurrentPriceDisplay = memo(
  (props: {
    marketPrice?: number;
    currency?: string;
    timeOfPrice?: number | string | Date;
  }): ReactElement => {
    return (
      <div className="cmp-current-price-display">
        {props.marketPrice === undefined ? (
          <> - </>
        ) : (
          <div className="price-display">
            <div>
              <LivePriceDisplay className="" price={props.marketPrice}>
                {marketPrice => <>{commonDecimalNumCurrencyFormat(marketPrice, props.currency)}</>}
              </LivePriceDisplay>
            </div>
            {props.timeOfPrice && (
              <SymbolPriceUpdatedAt className="last-updated-at" at={props.timeOfPrice} />
            )}
          </div>
        )}
      </div>
    );
  }
);
