import { useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import { keyBy } from 'lodash-es';
import { print as gqlPrint, type GraphQLError } from 'graphql';
// import { useQuery, useSubscription } from '@apollo/client';
import { useAsyncIterState, It, iterateFormatted } from 'react-async-iterators';
import { pipe } from 'shared-utils';
import {
  itCatch,
  itCombineLatest,
  itLazyDefer,
  itMap,
  itShare,
  itSwitchMap,
  itTap,
  myIterableCleanupPatcher,
} from 'iterable-operators';
import { graphql, type DocumentType } from '../../generated/gql/index.ts';
import { gqlClient, gqlWsClient } from '../../utils/gqlClient/index.ts';
import { PositionsTable } from '../PositionsTable/index.tsx';
import { getCurrentPortfolioCurrencySetting } from './utils/getCurrentPortfolioCurrencySetting.ts';
import { MainStatsStrip } from './components/MainStatsStrip/index.tsx';
import { CurrencySelect } from './components/CurrencySelect/index.tsx';
import { PositionDataErrorPanel } from './components/PositionDataErrorPanel/index.tsx';
import { AccountMainMenu } from './components/AccountMainMenu/index.tsx';
import { PositionDataRealTimeActivityStatus } from './components/PositionDataRealTimeActivityStatus/index.tsx';
import { UploadTrades } from './components/UploadTrades/index.tsx';
import { useServerConnectionErrorNotification } from './notifications/useServerConnectionErrorNotification.tsx';
import './style.css';

export { UserMainScreen };

// TODO: Links like the following must be displayed somehow for credit as the Yahoo Finance site does for Crypto instruments
// <svg class="" height="15" viewBox="0 0 88 15" width="88" xmlns="http://www.w3.org/2000/svg"><path d="M12.8488 8.96802C12.5872 9.12791 12.282 9.15698 12.0494 9.02616C11.7587 8.85174 11.5843 8.4593 11.5843 7.92151V6.27907C11.5843 5.49419 11.2791 4.92732 10.7558 4.78198C9.86918 4.52035 9.20058 5.61046 8.95349 6.01744L7.38372 8.53198V5.43604C7.36918 4.72384 7.13663 4.30233 6.70058 4.17151C6.40988 4.0843 5.97384 4.12791 5.55232 4.76744L2.04942 10.3779C1.5843 9.49128 1.33721 8.50291 1.33721 7.5C1.33721 4.11337 4.05523 1.36628 7.38372 1.36628C10.7122 1.36628 13.4302 4.11337 13.4302 7.5V7.51454V7.52907C13.4593 8.18314 13.2558 8.7064 12.8488 8.96802ZM14.7674 7.5V7.48546V7.47093C14.7529 3.35756 11.439 0 7.38372 0C3.31395 0 0 3.35756 0 7.5C0 11.6279 3.31395 15 7.38372 15C9.25872 15 11.032 14.2878 12.3983 12.9942C12.6744 12.7326 12.689 12.311 12.4273 12.0349C12.1802 11.7587 11.7587 11.7442 11.4826 11.9913C11.4826 11.9913 11.4826 11.9913 11.468 12.0058C10.3634 13.0523 8.88081 13.6483 7.35465 13.6483C5.56686 13.6483 3.96802 12.8634 2.86337 11.6134L6.01744 6.55523V8.89535C6.01744 10.0145 6.45349 10.3779 6.81686 10.4797C7.18023 10.5814 7.73256 10.5087 8.32849 9.56395L10.0581 6.75872C10.1163 6.67151 10.1599 6.5843 10.218 6.52616V7.95058C10.218 8.99709 10.6395 9.84011 11.3663 10.2471C12.0203 10.625 12.8488 10.5814 13.532 10.1599C14.375 9.60756 14.8256 8.64826 14.7674 7.5ZM25.0581 4.94186C25.2326 5.0436 25.3924 5.2907 25.3924 5.50872C25.3924 5.85756 25.1017 6.14826 24.7674 6.14826C24.6802 6.14826 24.6076 6.11918 24.5349 6.10465C24.1424 5.81395 23.6483 5.625 23.125 5.625C21.8895 5.625 21.0465 6.62791 21.0465 7.87791C21.0465 9.12791 21.9041 10.1163 23.125 10.1163C23.7355 10.1163 24.2878 9.86919 24.6948 9.47674C24.7965 9.40407 24.9273 9.36046 25.0581 9.36046C25.3924 9.36046 25.6541 9.62209 25.6541 9.95639C25.6541 10.1744 25.5233 10.3634 25.3634 10.4651C24.7674 10.9738 23.968 11.3081 23.1395 11.3081C21.25 11.3081 19.7093 9.7529 19.7093 7.8343C19.7093 5.9157 21.25 4.36046 23.1395 4.36046C23.8372 4.34593 24.5058 4.56395 25.0581 4.94186ZM28.5174 6.39535C29.811 6.39535 30.8866 7.48547 30.8866 8.83721C30.8866 10.1744 29.7965 11.3227 28.5174 11.3227C27.1657 11.3227 26.0465 10.189 26.0465 8.83721C26.0465 7.48547 27.1657 6.39535 28.5174 6.39535ZM28.5029 10.1163C29.0698 10.1163 29.5494 9.57849 29.5494 8.85174C29.5494 8.125 29.0698 7.65988 28.5029 7.65988C27.8924 7.65988 27.3837 8.11046 27.3837 8.85174C27.3837 9.56395 27.8924 10.1163 28.5029 10.1163ZM31.7006 10.5669V7.13663C31.7006 6.75872 31.9913 6.45349 32.3692 6.45349C32.7326 6.45349 33.0378 6.75872 33.0378 7.13663V10.5669C33.0378 10.9448 32.7326 11.25 32.3692 11.25C32.0058 11.25 31.7006 10.9302 31.7006 10.5669ZM31.5988 5.15988C31.5988 4.7093 31.9477 4.36046 32.3692 4.36046C32.8052 4.36046 33.1541 4.72384 33.1541 5.15988C33.1541 5.59593 32.8052 5.94477 32.3692 5.94477C31.9331 5.93023 31.5988 5.58139 31.5988 5.15988ZM35.5959 8.70639V10.5669C35.5959 10.9448 35.2907 11.25 34.9273 11.25C34.5639 11.25 34.2587 10.9448 34.2587 10.5669V6.97674C34.2587 6.68605 34.4913 6.45349 34.782 6.45349C35.0727 6.45349 35.2907 6.70058 35.2907 6.97674C35.8285 6.46802 36.3081 6.39535 36.7587 6.39535C38.0959 6.39535 38.6919 7.39826 38.6919 8.54651V10.5669C38.6919 10.9448 38.3866 11.25 38.0232 11.25C37.6599 11.25 37.3546 10.9448 37.3546 10.5669V8.70639C37.3546 8.125 37.282 7.63081 36.4389 7.63081C35.843 7.63081 35.5959 8.125 35.5959 8.70639ZM43.0233 9.41861C42.8634 9.41861 42.7616 9.34593 42.6744 9.24419L41.1192 7.55814V10.5669C41.1192 10.9448 40.8139 11.25 40.4506 11.25C40.0872 11.25 39.782 10.9448 39.782 10.5669V4.60756C39.8256 4.50582 39.9273 4.43314 40.0291 4.43314C40.1453 4.43314 40.2471 4.53488 40.3198 4.60756L42.8052 7.39825C42.8779 7.48546 42.9651 7.52907 43.0233 7.52907C43.0669 7.52907 43.1686 7.48546 43.2413 7.39825L45.7267 4.60756C45.7994 4.53488 45.8866 4.43314 46.0174 4.43314C46.1337 4.43314 46.2355 4.50582 46.2645 4.60756V10.5669C46.2645 10.9448 45.9738 11.25 45.5959 11.25C45.2325 11.25 44.9273 10.9448 44.9273 10.5669V7.55814L43.3721 9.24419C43.2558 9.34593 43.1541 9.41861 43.0233 9.41861ZM49.4477 10.1163C50.0436 10.1163 50.5523 9.57849 50.5523 8.85174C50.5523 8.125 50.0291 7.64535 49.4477 7.64535C48.8663 7.64535 48.3866 8.13953 48.3866 8.85174C48.3866 9.54942 48.8517 10.1163 49.4477 10.1163ZM50.8721 10.7267L50.843 10.5669C50.5814 11.0756 49.7529 11.3081 49.2296 11.3081C47.9796 11.3081 47.0494 10.1744 47.0494 8.82267C47.0494 7.48547 47.9942 6.38081 49.3023 6.38081C49.5203 6.38081 50.2762 6.43895 50.8576 7.12209L50.8866 6.96221C50.8866 6.67151 51.1046 6.43896 51.3953 6.43896C51.686 6.43896 51.9186 6.68604 51.9186 6.96221V10.7122C51.9186 11.0029 51.686 11.2355 51.3953 11.2355C51.0901 11.25 50.8721 11.0029 50.8721 10.7267ZM55.5959 7.63081H55.4506C54.6076 7.67442 54.4477 8.15407 54.4477 8.70639V10.5669C54.4477 10.9448 54.1424 11.25 53.7791 11.25C53.4157 11.25 53.1105 10.9448 53.1105 10.5669V6.97674C53.1105 6.68605 53.343 6.45349 53.6337 6.45349C53.9244 6.45349 54.1424 6.70058 54.1424 6.97674C54.6366 6.51163 55.0436 6.40988 55.4506 6.39535H55.5814C55.9012 6.39535 56.1918 6.67151 56.1918 7.02035C56.2064 7.34012 55.9157 7.63081 55.5959 7.63081ZM60.7558 10.2471C60.8139 10.3488 60.8575 10.4506 60.8575 10.5669C60.8575 10.9157 60.5378 11.2355 60.1889 11.2355C59.9564 11.2355 59.7529 11.061 59.593 10.8576L58.0523 9.06977V10.5523C58.0523 10.9302 57.7471 11.2355 57.3837 11.2355C57.0203 11.2355 56.7151 10.9302 56.7151 10.5523V5.10174C56.7151 4.72384 57.0058 4.4186 57.3837 4.4186C57.7616 4.4186 58.0523 4.72384 58.0523 5.10174V8.50291L59.593 6.80233C59.7529 6.62791 59.9419 6.43896 60.1744 6.43896C60.5087 6.43896 60.8139 6.74419 60.8139 7.09302C60.8139 7.19477 60.7849 7.31104 60.7267 7.39825L59.5058 8.73547L60.7558 10.2471ZM63.3721 7.64535C63.0087 7.64535 62.4128 7.8343 62.4128 8.40116H64.3459C64.3314 7.8343 63.7209 7.64535 63.3721 7.64535ZM65.1163 9.25872H62.4128C62.4128 10.0581 63.1831 10.189 63.5174 10.189C63.7645 10.189 64.1134 10.1453 64.3895 10.0145C64.4767 9.95639 64.6076 9.91279 64.7384 9.91279C65.0291 9.91279 65.2762 10.1599 65.2762 10.4651C65.2762 10.6686 65.1453 10.843 64.9855 10.9448C64.5785 11.25 64.0407 11.3227 63.532 11.3227C62.1802 11.3227 61.061 10.5959 61.061 8.89535C61.061 7.55814 61.7442 6.39535 63.343 6.39535C64.6366 6.39535 65.6105 7.23837 65.6395 8.73547C65.6395 9.01163 65.407 9.25872 65.1163 9.25872ZM68.8372 11.3081H68.4738C67.4564 11.3081 66.8605 10.8576 66.8605 9.27326V7.63081H66.5116C66.1918 7.63081 65.9157 7.34012 65.9157 7.02035C65.9157 6.67151 66.2064 6.39535 66.5116 6.39535H66.8605V5.13082C66.8605 4.75291 67.1512 4.44767 67.5291 4.44767C67.8924 4.44767 68.1977 4.75291 68.1977 5.13082V6.39535H68.75C69.0698 6.39535 69.3459 6.67151 69.3459 7.02035C69.3459 7.34012 69.0552 7.63081 68.75 7.63081H68.1977V9.01163C68.1977 9.92732 68.2413 10.1163 68.6482 10.1163H68.8372C69.157 10.1163 69.4331 10.3779 69.4331 10.7122C69.4331 11.032 69.157 11.3081 68.8372 11.3081ZM75.3052 4.94186C75.4796 5.0436 75.6395 5.2907 75.6395 5.50872C75.6395 5.85756 75.3488 6.14826 75.0145 6.14826C74.9273 6.14826 74.8546 6.11918 74.782 6.10465C74.3895 5.81395 73.8953 5.625 73.3721 5.625C72.1366 5.625 71.2936 6.62791 71.2936 7.87791C71.2936 9.12791 72.1512 10.1163 73.3721 10.1163C73.9825 10.1163 74.5349 9.86919 74.9418 9.47674C75.0436 9.40407 75.1744 9.36046 75.3052 9.36046C75.6395 9.36046 75.9012 9.62209 75.9012 9.95639C75.9012 10.1744 75.7703 10.3634 75.6105 10.4651C75.0145 10.9738 74.2151 11.3081 73.3866 11.3081C71.4971 11.3081 69.9564 9.7529 69.9564 7.8343C69.9564 5.9157 71.4971 4.36046 73.3866 4.36046C74.0843 4.34593 74.7674 4.56395 75.3052 4.94186ZM78.6918 10.1163C79.2878 10.1163 79.7965 9.57849 79.7965 8.85174C79.7965 8.125 79.2732 7.64535 78.6918 7.64535C78.0959 7.64535 77.6308 8.13953 77.6308 8.85174C77.6308 9.54942 78.1105 10.1163 78.6918 10.1163ZM80.1163 10.7267L80.0872 10.5669C79.8256 11.0756 78.9971 11.3081 78.4738 11.3081C77.2238 11.3081 76.2936 10.1744 76.2936 8.82267C76.2936 7.48547 77.2384 6.38081 78.5465 6.38081C78.7645 6.38081 79.5203 6.43895 80.1017 7.12209L80.1308 6.96221C80.1308 6.67151 80.3488 6.43896 80.6395 6.43896C80.9302 6.43896 81.1628 6.68604 81.1628 6.96221V10.7122C81.1628 11.0029 80.9302 11.2355 80.6395 11.2355C80.3343 11.25 80.1163 11.0029 80.1163 10.7267ZM84.811 10.1163C85.407 10.1163 85.8721 9.54942 85.8721 8.85174C85.8721 8.125 85.3924 7.64535 84.811 7.64535C84.2151 7.64535 83.7064 8.125 83.7064 8.85174C83.7064 9.57849 84.2151 10.1163 84.811 10.1163ZM83.7064 10.9157V12.6163C83.7064 12.9942 83.4011 13.2994 83.0378 13.2994C82.6744 13.2994 82.3692 12.9942 82.3692 12.6163V6.97674C82.3692 6.68605 82.6017 6.45349 82.8924 6.45349C83.1831 6.45349 83.4011 6.70058 83.4011 7.03488C83.8953 6.52616 84.5058 6.39535 84.9709 6.39535C86.2645 6.39535 87.2238 7.48547 87.2238 8.83721C87.2238 10.1744 86.3081 11.3227 85.0436 11.3227C84.6511 11.3081 84.0697 11.1919 83.7064 10.9157Z" fill="var(--text2)" fill-opacity="1"></path></svg>
// coinMarketCapLink: "https://coinmarketcap.com/currencies/bitcoin"

function UserMainScreen() {
  const serverConnectionErrorNotification = useServerConnectionErrorNotification();

  const [lastFetchedPositionCount, setLastFetchedPositionCount] = useLocalStorage<
    number | undefined
  >('last_fetched_positions_count', undefined);

  const [portfolioCurrencySettingIterBase, setPortfolioCurrencySetting] =
    useAsyncIterState<string>();

  const portfolioCurrencySettingIter = useMemo(() => {
    const initialPortfolioCurrencySetting = getCurrentPortfolioCurrencySetting();

    let currVal =
      initialPortfolioCurrencySetting instanceof Promise
        ? undefined
        : initialPortfolioCurrencySetting;

    return pipe(
      portfolioCurrencySettingIterBase,
      myIterableCleanupPatcher(async function* (source) {
        if (initialPortfolioCurrencySetting instanceof Promise) {
          currVal = await initialPortfolioCurrencySetting;
        }
        yield currVal!;
        for await (const nextCurrency of source) {
          currVal = nextCurrency;
          window.localStorage.setItem('portfolio_currency', JSON.stringify(nextCurrency));
          yield nextCurrency;
        }
      }),
      itShare(),
      $ =>
        Object.assign($, {
          get value() {
            return !currVal ? undefined : { current: currVal };
          },
        })
    );
  }, [portfolioCurrencySettingIterBase, setPortfolioCurrencySetting]);

  const portfolioStatsIters = useMemo(
    () =>
      pipe(
        portfolioCurrencySettingIter,
        itMap(currencyCode => ({
          statsInModifiedCurrency: createPortfolioStatsIter({ currencyCode }),
        })),
        itShare()
      ),
    []
  );

  const positionsIter = useMemo(() => {
    const portfolioStatsIter = pipe(
      portfolioStatsIters,
      itSwitchMap(next => next.statsInModifiedCurrency)
    );
    return pipe(
      itCombineLatest(createCombinedPositionsIter(), portfolioStatsIter),
      itMap(([nextPositionUpdate, nextPortfolioUpdate]) => {
        const compositionBySymbol = keyBy(
          nextPortfolioUpdate.stats?.compositionByHoldings,
          c => c.symbol
        );

        const positionsWithPortfolioPortions = nextPositionUpdate.positions.map(update => ({
          ...update,
          portionOfPortfolioMarketValue: compositionBySymbol[update.symbol]
            ? compositionBySymbol[update.symbol].portionOfPortfolioMarketValue
            : undefined,
        }));

        const errors =
          !nextPositionUpdate.errors?.length && !nextPortfolioUpdate.errors?.length
            ? undefined
            : [...(nextPositionUpdate.errors ?? []), ...(nextPortfolioUpdate.errors ?? [])];

        return {
          errors,
          positions: positionsWithPortfolioPortions,
        };
      }),
      itTap((next, i) => {
        if (i === 0) {
          setLastFetchedPositionCount(next.positions.length);
        }
      }),
      itCatch(err => {
        serverConnectionErrorNotification.show();
        throw err;
      }),
      itShare()
    );
  }, []);

  return (
    <div className="cmp-user-main-screen">
      <>{serverConnectionErrorNotification.placement}</>

      <header>
        <AccountMainMenu />
      </header>

      <UploadTrades
        className="upload-trades"
        onUploadSuccess={() => {}}
        onUploadFailure={_err => {}}
      />

      <div>
        <PositionDataRealTimeActivityStatus input={positionsIter} />

        <section className="portfolio-top-strip">
          <It value={portfolioStatsIters}>
            {next => (
              <MainStatsStrip
                className="portfolio-stats-area"
                data={iterateFormatted(next.value?.statsInModifiedCurrency, next =>
                  !next?.stats
                    ? undefined
                    : {
                        currencyShownIn: next.stats.currencyCombinedBy,
                        marketValue: next.stats.marketValue,
                        unrealizedPnl: {
                          amount: next.stats.unrealizedPnl.amount,
                          fraction: next.stats.unrealizedPnl.fraction,
                        },
                      }
                )}
              />
            )}
          </It>

          <div className="portfolio-options-area">
            <It value={portfolioCurrencySettingIter}>
              {next => (
                <CurrencySelect
                  loading={next.pendingFirst}
                  currency={next.value}
                  onCurrencyChange={setPortfolioCurrencySetting}
                />
              )}
            </It>
          </div>
        </section>

        <PositionDataErrorPanel errors={iterateFormatted(positionsIter, p => p.errors)} />

        <PositionsTable
          className="positions-table"
          loadingStatePlaceholderRowsCount={lastFetchedPositionCount}
          positions={iterateFormatted(positionsIter, next =>
            next.positions.map(h => ({
              symbol: h.symbol,
              currency: h.priceData.currency ?? undefined,
              portfolioValuePortion: h.portionOfPortfolioMarketValue,
              quantity: h.totalQuantity,
              breakEvenPrice: h.breakEvenPrice ?? undefined,
              marketPrice: h.priceData.regularMarketPrice,
              timeOfPrice: h.priceData.regularMarketTime,
              marketState: h.priceData.marketState,
              marketValue: h.marketValue,
              unrealizedDayPnl: {
                amount: h.unrealizedDayPnl.amount,
                fraction: h.unrealizedDayPnl.fraction,
              },
              unrealizedPnl: {
                amount: h.unrealizedPnl.amount,
                fraction: h.unrealizedPnl.fraction,
              },
              comprisingLots: [
                () =>
                  pipe(
                    createLotDataIter({ symbol: h.symbol }),
                    itMap(({ lots }) =>
                      lots.map(l => ({
                        ...l,
                        date: l.openedAt,
                        originalQty: l.originalQuantity,
                        remainingQty: l.remainingQuantity,
                      }))
                    )
                  ),
                [h.symbol],
              ],
            }))
          )}
        />
      </div>
    </div>
  );
}

function createCombinedPositionsIter(): AsyncIterable<{
  errors: readonly GraphQLError[] | undefined;
  positions: PositionItem[];
}> {
  return pipe(
    itLazyDefer(() =>
      gqlWsClient.iterate<PositionDataSubscriptionResult>({
        query: gqlPrint(positionDataSubscription),
      })
    ),
    $ =>
      itLazyDefer(() => {
        const allCurrPositions = {} as { [symbol: string]: PositionItem };

        return pipe(
          $,
          itTap(next => {
            for (const update of next.data?.positions ?? []) {
              ({
                ['SET']: () => (allCurrPositions[update.data.symbol] = update.data),
                ['REMOVE']: () => delete allCurrPositions[update.data.symbol],
              })[update.type]();
            }
          }),
          itMap(next => ({
            positions: Object.values(allCurrPositions),
            errors: next.errors,
          }))
        );
      }),
    itShare()
  );
}

const positionDataSubscription = graphql(/* GraphQL */ `
  subscription PositionDataSubscription {
    positions {
      type
      data {
        symbol
        totalQuantity
        breakEvenPrice
        marketValue
        priceData {
          marketState
          currency
          regularMarketTime
          regularMarketPrice
        }
        unrealizedDayPnl {
          amount
          fraction
        }
        unrealizedPnl {
          amount
          fraction
        }
      }
    }
  }
`);

type PositionDataSubscriptionResult = DocumentType<typeof positionDataSubscription>;
type PositionItem = PositionDataSubscriptionResult['positions'][number]['data'];

function createPortfolioStatsIter(params: { currencyCode: string }): AsyncIterable<{
  errors: readonly GraphQLError[] | undefined;
  stats: undefined | PortfolioStatsUpdate;
}> {
  return pipe(
    gqlWsClient.iterate<PortfolioStatsSubscriptionResults>({
      variables: { currencyToCombineIn: params.currencyCode },
      query: gqlPrint(portfolioStatsDataSubscription),
    }),
    itMap(next => ({
      stats: next.data?.combinedPortfolioStats,
      errors: next.errors,
    })),
    itShare()
  );
}

const portfolioStatsDataSubscription = graphql(/* GraphQL */ `
  subscription PortfolioStatsDataSubscription($currencyToCombineIn: String!) {
    combinedPortfolioStats(currencyToCombineIn: $currencyToCombineIn) {
      currencyCombinedBy
      costBasis
      marketValue
      unrealizedPnl {
        amount
        fraction
      }
      compositionByHoldings {
        symbol
        portionOfPortfolioMarketValue
      }
    }
  }
`);

type PortfolioStatsSubscriptionResults = DocumentType<typeof portfolioStatsDataSubscription>;
type PortfolioStatsUpdate = PortfolioStatsSubscriptionResults['combinedPortfolioStats'];

function createLotDataIter({ symbol }: { symbol: string }): AsyncIterable<{
  errors: readonly GraphQLError[] | undefined;
  lots: {
    id: string;
    openedAt: Date;
    originalQuantity: number;
    remainingQuantity: number;
    unrealizedPnl: {
      amount: number;
      fraction: number;
    };
  }[];
}> {
  return pipe(
    itLazyDefer(async () => {
      await gqlClient.clearStore();

      const queriedLots = await gqlClient.query({
        variables: { symbol },
        query: lotQuery,
      });

      const queriedLotsById = keyBy(queriedLots.data.lots, l => l.id);

      const lotIds = queriedLots.data.lots.map(({ id }) => id);

      const allCurrLots = {} as {
        [lotId: string]: {
          id: string;
          openedAt: Date;
          originalQuantity: number;
          remainingQuantity: number;
          unrealizedPnl: { amount: number; fraction: number };
        };
      };

      return pipe(
        gqlWsClient.iterate<LotDataSubscriptionResult>({
          variables: { ids: lotIds },
          query: gqlPrint(lotDataSubscription),
        }),
        itTap(next => {
          for (const update of next.data?.lots ?? []) {
            ({
              ['SET']: () =>
                (allCurrLots[update.data.id] = {
                  ...queriedLotsById[update.data.id],
                  originalQuantity: update.data.originalQuantity,
                  remainingQuantity: update.data.remainingQuantity,
                  unrealizedPnl: {
                    amount: update.data.unrealizedPnl.amount,
                    fraction: update.data.unrealizedPnl.fraction,
                  },
                }),
              ['REMOVE']: () => delete allCurrLots[update.data.id],
            })[update.type]();
          }
        }),
        itMap(next => ({
          lots: Object.values(allCurrLots),
          errors: next.errors,
        }))
      );
    }),
    itShare()
  );
}

const lotQuery = graphql(/* GraphQL */ `
  query LotsQuery($symbol: ID!) {
    lots(filters: { symbols: [$symbol] }) {
      id
      openedAt
    }
  }
`);

const lotDataSubscription = graphql(/* GraphQL */ `
  subscription LotDataSubscription($ids: [ID!]!) {
    lots(filters: { ids: $ids }) {
      type
      data {
        id
        originalQuantity
        remainingQuantity
        unrealizedPnl {
          amount
          fraction
        }
      }
    }
  }
`);

type LotDataSubscriptionResult = DocumentType<typeof lotDataSubscription>;
