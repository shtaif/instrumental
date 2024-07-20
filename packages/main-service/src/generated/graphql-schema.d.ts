import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AppGqlContextValue } from '../initGqlSchema/appGqlContext.ts';
import { DeepPartial } from 'utility-types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AggregatePnlChangeResult = {
  __typename?: 'AggregatePnlChangeResult';
  aggregates: Array<AggregatePnlResultItem>;
  translatedAggregates: Array<AggregatePnlResultItemTranslated>;
};


export type AggregatePnlChangeResultTranslatedAggregatesArgs = {
  currencies: Array<Scalars['ID']['input']>;
};

export type AggregatePnlHoldingSpecifier = {
  symbol: Scalars['ID']['input'];
};

export type AggregatePnlPositionSpecifier = {
  positionId: Scalars['ID']['input'];
};

export type AggregatePnlResultItem = {
  __typename?: 'AggregatePnlResultItem';
  currency?: Maybe<Scalars['ID']['output']>;
  pnlAmount: Scalars['Float']['output'];
  pnlPercent: Scalars['Float']['output'];
};

export type AggregatePnlResultItemTranslated = {
  __typename?: 'AggregatePnlResultItemTranslated';
  currency: Scalars['ID']['output'];
  pnlAmount: Scalars['Float']['output'];
};

export type CurrencyAdjustedPnlInfo = {
  __typename?: 'CurrencyAdjustedPnlInfo';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  exchangeRate: Scalars['Float']['output'];
};

export type ExchangeInfo = {
  __typename?: 'ExchangeInfo';
  acronym?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  mic?: Maybe<Scalars['String']['output']>;
};

export type HoldingRevenueChange = {
  __typename?: 'HoldingRevenueChange';
  holding: SymbolHolding;
  priceData: SymbolPriceData;
  revenue: RevenueInfo;
  symbol: Scalars['ID']['output'];
  userAlias: Scalars['ID']['output'];
};

export type HoldingRevenueChangeNotification = {
  __typename?: 'HoldingRevenueChangeNotification';
  changes: Array<HoldingRevenueChange>;
};

export type HoldingStats = {
  __typename?: 'HoldingStats';
  breakEvenPrice?: Maybe<Scalars['Float']['output']>;
  currentPortfolioPortion?: Maybe<Scalars['Float']['output']>;
  instrument: InstrumentInfo;
  lastChangedAt: Scalars['DateTime']['output'];
  lastRelatedTradeId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  relatedPortfolioStats: PortfolioStats;
  symbol: Scalars['ID']['output'];
  totalPositionCount: Scalars['Int']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalQuantity: Scalars['Int']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type HoldingStatsChange = {
  __typename?: 'HoldingStatsChange';
  changedAt: Scalars['DateTime']['output'];
  ownerId: Scalars['ID']['output'];
  portfolioPortion: Scalars['Float']['output'];
  portfolioStatsChangeId: Scalars['ID']['output'];
  relatedPortfolioStatsChange: PortfolioStatsChange;
  relatedTradeId: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
  totalPositionCount: Scalars['Int']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalQuantity: Scalars['Int']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
};

export type HoldingStatsChangesFilters = {
  symbols?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type HoldingStatsFilters = {
  symbols?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type HoldingStatsMarketState =
  | 'CLOSED'
  | 'POST'
  | 'POSTPOST'
  | 'PRE'
  | 'PREPRE'
  | 'REGULAR';

export type HoldingStatsSubscriptionFilters = {
  symbols?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type InstrumentInfo = {
  __typename?: 'InstrumentInfo';
  currency?: Maybe<Scalars['String']['output']>;
  exchange: ExchangeInfo;
  marketState: HoldingStatsMarketState;
  name?: Maybe<Scalars['String']['output']>;
  regularMarketPrice: Scalars['Float']['output'];
  regularMarketTime: Scalars['DateTime']['output'];
  symbol: Scalars['ID']['output'];
};

export type InstrumentMarketData = {
  __typename?: 'InstrumentMarketData';
  currency?: Maybe<Scalars['String']['output']>;
  marketState: HoldingStatsMarketState;
  regularMarketPrice: Scalars['Float']['output'];
  regularMarketTime: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setTrades: SetTradesResult;
};


export type MutationSetTradesArgs = {
  input: SetTradesInput;
};

export type ObserveHoldingRevenueInput = {
  userAlias: Scalars['ID']['input'];
};

export type ObservePricesDataInput = {
  symbols: Array<Scalars['String']['input']>;
};

export type ObservedHoldingStats = {
  __typename?: 'ObservedHoldingStats';
  breakEvenPrice?: Maybe<Scalars['Float']['output']>;
  currentPortfolioPortion?: Maybe<Scalars['Float']['output']>;
  lastChangedAt: Scalars['DateTime']['output'];
  lastRelatedTradeId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  priceData: InstrumentMarketData;
  symbol: Scalars['ID']['output'];
  totalPositionCount: Scalars['Int']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalQuantity: Scalars['Int']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type ObservedHoldingStatsUpdate = {
  __typename?: 'ObservedHoldingStatsUpdate';
  data: ObservedHoldingStats;
  type: ObservedHoldingStatsUpdateType;
};

export type ObservedHoldingStatsUpdateType =
  | 'REMOVE'
  | 'SET';

export type ObservedPortfolioStats = {
  __typename?: 'ObservedPortfolioStats';
  forCurrency?: Maybe<Scalars['String']['output']>;
  lastChangedAt: Scalars['DateTime']['output'];
  ownerId: Scalars['ID']['output'];
  relatedTradeId: Scalars['ID']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type ObservedPortfolioStatsUpdate = {
  __typename?: 'ObservedPortfolioStatsUpdate';
  data: ObservedPortfolioStats;
  type: ObservedPortfolioStatsUpdateType;
};

export type ObservedPortfolioStatsUpdateType =
  | 'REMOVE'
  | 'SET';

export type ObservedPosition = {
  __typename?: 'ObservedPosition';
  id: Scalars['ID']['output'];
  openedAt: Scalars['DateTime']['output'];
  openingTradeId: Scalars['ID']['output'];
  originalQuantity: Scalars['Float']['output'];
  ownerId: Scalars['ID']['output'];
  priceData: InstrumentMarketData;
  realizedProfitOrLoss: Scalars['Float']['output'];
  recordCreatedAt: Scalars['DateTime']['output'];
  recordUpdatedAt: Scalars['DateTime']['output'];
  remainingQuantity: Scalars['Float']['output'];
  symbol: Scalars['ID']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type ObservedPositionUpdate = {
  __typename?: 'ObservedPositionUpdate';
  data: ObservedPosition;
  type: ObservedPositionUpdateType;
};

export type ObservedPositionUpdateType =
  | 'REMOVE'
  | 'SET';

export type PnlInfo = {
  __typename?: 'PnlInfo';
  amount: Scalars['Float']['output'];
  currencyAdjusted: CurrencyAdjustedPnlInfo;
  percent: Scalars['Float']['output'];
};


export type PnlInfoCurrencyAdjustedArgs = {
  currency: Scalars['String']['input'];
};

export type PortfolioStats = {
  __typename?: 'PortfolioStats';
  composition: Array<SymbolPortfolioPortion>;
  forCurrency?: Maybe<Scalars['String']['output']>;
  lastChangedAt: Scalars['DateTime']['output'];
  ownerId: Scalars['ID']['output'];
  relatedHoldingStats: HoldingStats;
  relatedTradeId: Scalars['ID']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type PortfolioStatsChange = {
  __typename?: 'PortfolioStatsChange';
  changedAt: Scalars['DateTime']['output'];
  composition: Array<SymbolPortfolioPortion>;
  forCurrency?: Maybe<Scalars['String']['output']>;
  ownerId: Scalars['ID']['output'];
  relatedHoldingStatsChange: HoldingStatsChange;
  relatedTradeId: Scalars['ID']['output'];
  totalPresentInvestedAmount: Scalars['Float']['output'];
  totalRealizedAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossAmount: Scalars['Float']['output'];
  totalRealizedProfitOrLossRate: Scalars['Float']['output'];
};

export type Position = {
  __typename?: 'Position';
  id: Scalars['ID']['output'];
  instrument: InstrumentInfo;
  openedAt: Scalars['DateTime']['output'];
  openingTradeId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  priceData: InstrumentMarketData;
  realizedProfitOrLoss: Scalars['Float']['output'];
  recordCreatedAt: Scalars['DateTime']['output'];
  recordUpdatedAt: Scalars['DateTime']['output'];
  remainingQuantity: Scalars['Float']['output'];
  symbol: Scalars['ID']['output'];
  unrealizedPnl: ProfitOrLoss;
};

export type PositionProfitInfo = {
  __typename?: 'PositionProfitInfo';
  amount: Scalars['Float']['output'];
  percent: Scalars['Float']['output'];
};

export type PositionsFilters = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  symbols?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type PositionsSubscriptionFilters = {
  ids: Array<Scalars['ID']['input']>;
};

export type PriceDataChangeNotification = {
  __typename?: 'PriceDataChangeNotification';
  priceUpdates: Array<SymbolPriceData>;
};

/** Deprecated; use `PnlInfo` type instead */
export type ProfitOrLoss = {
  __typename?: 'ProfitOrLoss';
  amount: Scalars['Float']['output'];
  currencyAdjusted: CurrencyAdjustedPnlInfo;
  percent: Scalars['Float']['output'];
};


/** Deprecated; use `PnlInfo` type instead */
export type ProfitOrLossCurrencyAdjustedArgs = {
  currency: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getSymbolHoldingForTest: HoldingRevenueChangeNotification;
  getSymbolPriceDataForTest: SymbolPriceData;
  hello: Scalars['String']['output'];
  holdingStats: Array<HoldingStats>;
  holdingStatsChanges: Array<HoldingStatsChange>;
  portfolioStats: PortfolioStats;
  portfolioStatsChanges: Array<PortfolioStatsChange>;
  positions: Array<Position>;
};


export type QueryHoldingStatsArgs = {
  filters?: InputMaybe<HoldingStatsFilters>;
};


export type QueryHoldingStatsChangesArgs = {
  filters?: InputMaybe<HoldingStatsChangesFilters>;
};


export type QueryPositionsArgs = {
  filters?: InputMaybe<PositionsFilters>;
};

export type RevenueInfo = {
  __typename?: 'RevenueInfo';
  amount: Scalars['Float']['output'];
  percent: Scalars['Float']['output'];
};

export type SetTradesInput = {
  data: SetTradesInputData;
  mode: SetTradesInputMode;
};

export type SetTradesInputData = {
  csv: Scalars['String']['input'];
};

export type SetTradesInputMode =
  | 'MERGE'
  | 'REPLACE';

export type SetTradesResult = {
  __typename?: 'SetTradesResult';
  tradesAddedCount: Scalars['Int']['output'];
  tradesModifiedCount: Scalars['Int']['output'];
  tradesRemovedCount: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  aggregatePnl: AggregatePnlChangeResult;
  holdingStats: Array<ObservedHoldingStatsUpdate>;
  observeHoldingRevenue: HoldingRevenueChangeNotification;
  observePricesData: PriceDataChangeNotification;
  portfolioStats: Array<ObservedPortfolioStatsUpdate>;
  positions: Array<ObservedPositionUpdate>;
};


export type SubscriptionAggregatePnlArgs = {
  holdings?: InputMaybe<Array<AggregatePnlHoldingSpecifier>>;
  positions?: InputMaybe<Array<AggregatePnlPositionSpecifier>>;
};


export type SubscriptionHoldingStatsArgs = {
  filters?: InputMaybe<HoldingStatsSubscriptionFilters>;
};


export type SubscriptionObserveHoldingRevenueArgs = {
  input: ObserveHoldingRevenueInput;
};


export type SubscriptionObservePricesDataArgs = {
  input: ObservePricesDataInput;
};


export type SubscriptionPositionsArgs = {
  filters: PositionsSubscriptionFilters;
};

export type SymbolHolding = {
  __typename?: 'SymbolHolding';
  breakEvenPrice: Scalars['Float']['output'];
  positions: Array<SymbolPosition>;
  symbol: Scalars['ID']['output'];
  totalQuantity: Scalars['Float']['output'];
  unrealizedProfit: PositionProfitInfo;
  userAlias: Scalars['ID']['output'];
};

export type SymbolPortfolioPortion = {
  __typename?: 'SymbolPortfolioPortion';
  portion: Scalars['Float']['output'];
  symbol: Scalars['ID']['output'];
};

export type SymbolPosition = {
  __typename?: 'SymbolPosition';
  createdAt: Scalars['DateTime']['output'];
  isRealized: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  realizedQuantity: Scalars['Int']['output'];
};

export type SymbolPriceData = {
  __typename?: 'SymbolPriceData';
  regularMarketPrice: Scalars['Float']['output'];
  regularMarketTime: Scalars['DateTime']['output'];
  symbol: Scalars['ID']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AggregatePnlChangeResult: ResolverTypeWrapper<DeepPartial<AggregatePnlChangeResult>>;
  AggregatePnlHoldingSpecifier: ResolverTypeWrapper<DeepPartial<AggregatePnlHoldingSpecifier>>;
  AggregatePnlPositionSpecifier: ResolverTypeWrapper<DeepPartial<AggregatePnlPositionSpecifier>>;
  AggregatePnlResultItem: ResolverTypeWrapper<DeepPartial<AggregatePnlResultItem>>;
  AggregatePnlResultItemTranslated: ResolverTypeWrapper<DeepPartial<AggregatePnlResultItemTranslated>>;
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars['Boolean']['output']>>;
  CurrencyAdjustedPnlInfo: ResolverTypeWrapper<DeepPartial<CurrencyAdjustedPnlInfo>>;
  DateTime: ResolverTypeWrapper<DeepPartial<Scalars['DateTime']['output']>>;
  ExchangeInfo: ResolverTypeWrapper<DeepPartial<ExchangeInfo>>;
  Float: ResolverTypeWrapper<DeepPartial<Scalars['Float']['output']>>;
  HoldingRevenueChange: ResolverTypeWrapper<DeepPartial<HoldingRevenueChange>>;
  HoldingRevenueChangeNotification: ResolverTypeWrapper<DeepPartial<HoldingRevenueChangeNotification>>;
  HoldingStats: ResolverTypeWrapper<DeepPartial<HoldingStats>>;
  HoldingStatsChange: ResolverTypeWrapper<DeepPartial<HoldingStatsChange>>;
  HoldingStatsChangesFilters: ResolverTypeWrapper<DeepPartial<HoldingStatsChangesFilters>>;
  HoldingStatsFilters: ResolverTypeWrapper<DeepPartial<HoldingStatsFilters>>;
  HoldingStatsMarketState: ResolverTypeWrapper<DeepPartial<HoldingStatsMarketState>>;
  HoldingStatsSubscriptionFilters: ResolverTypeWrapper<DeepPartial<HoldingStatsSubscriptionFilters>>;
  ID: ResolverTypeWrapper<DeepPartial<Scalars['ID']['output']>>;
  InstrumentInfo: ResolverTypeWrapper<DeepPartial<InstrumentInfo>>;
  InstrumentMarketData: ResolverTypeWrapper<DeepPartial<InstrumentMarketData>>;
  Int: ResolverTypeWrapper<DeepPartial<Scalars['Int']['output']>>;
  Mutation: ResolverTypeWrapper<{}>;
  ObserveHoldingRevenueInput: ResolverTypeWrapper<DeepPartial<ObserveHoldingRevenueInput>>;
  ObservePricesDataInput: ResolverTypeWrapper<DeepPartial<ObservePricesDataInput>>;
  ObservedHoldingStats: ResolverTypeWrapper<DeepPartial<ObservedHoldingStats>>;
  ObservedHoldingStatsUpdate: ResolverTypeWrapper<DeepPartial<ObservedHoldingStatsUpdate>>;
  ObservedHoldingStatsUpdateType: ResolverTypeWrapper<DeepPartial<ObservedHoldingStatsUpdateType>>;
  ObservedPortfolioStats: ResolverTypeWrapper<DeepPartial<ObservedPortfolioStats>>;
  ObservedPortfolioStatsUpdate: ResolverTypeWrapper<DeepPartial<ObservedPortfolioStatsUpdate>>;
  ObservedPortfolioStatsUpdateType: ResolverTypeWrapper<DeepPartial<ObservedPortfolioStatsUpdateType>>;
  ObservedPosition: ResolverTypeWrapper<DeepPartial<ObservedPosition>>;
  ObservedPositionUpdate: ResolverTypeWrapper<DeepPartial<ObservedPositionUpdate>>;
  ObservedPositionUpdateType: ResolverTypeWrapper<DeepPartial<ObservedPositionUpdateType>>;
  PnlInfo: ResolverTypeWrapper<DeepPartial<PnlInfo>>;
  PortfolioStats: ResolverTypeWrapper<DeepPartial<PortfolioStats>>;
  PortfolioStatsChange: ResolverTypeWrapper<DeepPartial<PortfolioStatsChange>>;
  Position: ResolverTypeWrapper<DeepPartial<Position>>;
  PositionProfitInfo: ResolverTypeWrapper<DeepPartial<PositionProfitInfo>>;
  PositionsFilters: ResolverTypeWrapper<DeepPartial<PositionsFilters>>;
  PositionsSubscriptionFilters: ResolverTypeWrapper<DeepPartial<PositionsSubscriptionFilters>>;
  PriceDataChangeNotification: ResolverTypeWrapper<DeepPartial<PriceDataChangeNotification>>;
  ProfitOrLoss: ResolverTypeWrapper<DeepPartial<ProfitOrLoss>>;
  Query: ResolverTypeWrapper<{}>;
  RevenueInfo: ResolverTypeWrapper<DeepPartial<RevenueInfo>>;
  SetTradesInput: ResolverTypeWrapper<DeepPartial<SetTradesInput>>;
  SetTradesInputData: ResolverTypeWrapper<DeepPartial<SetTradesInputData>>;
  SetTradesInputMode: ResolverTypeWrapper<DeepPartial<SetTradesInputMode>>;
  SetTradesResult: ResolverTypeWrapper<DeepPartial<SetTradesResult>>;
  String: ResolverTypeWrapper<DeepPartial<Scalars['String']['output']>>;
  Subscription: ResolverTypeWrapper<{}>;
  SymbolHolding: ResolverTypeWrapper<DeepPartial<SymbolHolding>>;
  SymbolPortfolioPortion: ResolverTypeWrapper<DeepPartial<SymbolPortfolioPortion>>;
  SymbolPosition: ResolverTypeWrapper<DeepPartial<SymbolPosition>>;
  SymbolPriceData: ResolverTypeWrapper<DeepPartial<SymbolPriceData>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AggregatePnlChangeResult: DeepPartial<AggregatePnlChangeResult>;
  AggregatePnlHoldingSpecifier: DeepPartial<AggregatePnlHoldingSpecifier>;
  AggregatePnlPositionSpecifier: DeepPartial<AggregatePnlPositionSpecifier>;
  AggregatePnlResultItem: DeepPartial<AggregatePnlResultItem>;
  AggregatePnlResultItemTranslated: DeepPartial<AggregatePnlResultItemTranslated>;
  Boolean: DeepPartial<Scalars['Boolean']['output']>;
  CurrencyAdjustedPnlInfo: DeepPartial<CurrencyAdjustedPnlInfo>;
  DateTime: DeepPartial<Scalars['DateTime']['output']>;
  ExchangeInfo: DeepPartial<ExchangeInfo>;
  Float: DeepPartial<Scalars['Float']['output']>;
  HoldingRevenueChange: DeepPartial<HoldingRevenueChange>;
  HoldingRevenueChangeNotification: DeepPartial<HoldingRevenueChangeNotification>;
  HoldingStats: DeepPartial<HoldingStats>;
  HoldingStatsChange: DeepPartial<HoldingStatsChange>;
  HoldingStatsChangesFilters: DeepPartial<HoldingStatsChangesFilters>;
  HoldingStatsFilters: DeepPartial<HoldingStatsFilters>;
  HoldingStatsSubscriptionFilters: DeepPartial<HoldingStatsSubscriptionFilters>;
  ID: DeepPartial<Scalars['ID']['output']>;
  InstrumentInfo: DeepPartial<InstrumentInfo>;
  InstrumentMarketData: DeepPartial<InstrumentMarketData>;
  Int: DeepPartial<Scalars['Int']['output']>;
  Mutation: {};
  ObserveHoldingRevenueInput: DeepPartial<ObserveHoldingRevenueInput>;
  ObservePricesDataInput: DeepPartial<ObservePricesDataInput>;
  ObservedHoldingStats: DeepPartial<ObservedHoldingStats>;
  ObservedHoldingStatsUpdate: DeepPartial<ObservedHoldingStatsUpdate>;
  ObservedPortfolioStats: DeepPartial<ObservedPortfolioStats>;
  ObservedPortfolioStatsUpdate: DeepPartial<ObservedPortfolioStatsUpdate>;
  ObservedPosition: DeepPartial<ObservedPosition>;
  ObservedPositionUpdate: DeepPartial<ObservedPositionUpdate>;
  PnlInfo: DeepPartial<PnlInfo>;
  PortfolioStats: DeepPartial<PortfolioStats>;
  PortfolioStatsChange: DeepPartial<PortfolioStatsChange>;
  Position: DeepPartial<Position>;
  PositionProfitInfo: DeepPartial<PositionProfitInfo>;
  PositionsFilters: DeepPartial<PositionsFilters>;
  PositionsSubscriptionFilters: DeepPartial<PositionsSubscriptionFilters>;
  PriceDataChangeNotification: DeepPartial<PriceDataChangeNotification>;
  ProfitOrLoss: DeepPartial<ProfitOrLoss>;
  Query: {};
  RevenueInfo: DeepPartial<RevenueInfo>;
  SetTradesInput: DeepPartial<SetTradesInput>;
  SetTradesInputData: DeepPartial<SetTradesInputData>;
  SetTradesResult: DeepPartial<SetTradesResult>;
  String: DeepPartial<Scalars['String']['output']>;
  Subscription: {};
  SymbolHolding: DeepPartial<SymbolHolding>;
  SymbolPortfolioPortion: DeepPartial<SymbolPortfolioPortion>;
  SymbolPosition: DeepPartial<SymbolPosition>;
  SymbolPriceData: DeepPartial<SymbolPriceData>;
};

export type AggregatePnlChangeResultResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['AggregatePnlChangeResult'] = ResolversParentTypes['AggregatePnlChangeResult']> = {
  aggregates?: Resolver<Array<ResolversTypes['AggregatePnlResultItem']>, ParentType, ContextType>;
  translatedAggregates?: Resolver<Array<ResolversTypes['AggregatePnlResultItemTranslated']>, ParentType, ContextType, RequireFields<AggregatePnlChangeResultTranslatedAggregatesArgs, 'currencies'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregatePnlResultItemResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['AggregatePnlResultItem'] = ResolversParentTypes['AggregatePnlResultItem']> = {
  currency?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pnlAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pnlPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregatePnlResultItemTranslatedResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['AggregatePnlResultItemTranslated'] = ResolversParentTypes['AggregatePnlResultItemTranslated']> = {
  currency?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pnlAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrencyAdjustedPnlInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['CurrencyAdjustedPnlInfo'] = ResolversParentTypes['CurrencyAdjustedPnlInfo']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exchangeRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ExchangeInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ExchangeInfo'] = ResolversParentTypes['ExchangeInfo']> = {
  acronym?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mic?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoldingRevenueChangeResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['HoldingRevenueChange'] = ResolversParentTypes['HoldingRevenueChange']> = {
  holding?: Resolver<ResolversTypes['SymbolHolding'], ParentType, ContextType>;
  priceData?: Resolver<ResolversTypes['SymbolPriceData'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['RevenueInfo'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userAlias?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoldingRevenueChangeNotificationResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['HoldingRevenueChangeNotification'] = ResolversParentTypes['HoldingRevenueChangeNotification']> = {
  changes?: Resolver<Array<ResolversTypes['HoldingRevenueChange']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoldingStatsResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['HoldingStats'] = ResolversParentTypes['HoldingStats']> = {
  breakEvenPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  currentPortfolioPortion?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  instrument?: Resolver<ResolversTypes['InstrumentInfo'], ParentType, ContextType>;
  lastChangedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastRelatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  relatedPortfolioStats?: Resolver<ResolversTypes['PortfolioStats'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HoldingStatsChangeResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['HoldingStatsChange'] = ResolversParentTypes['HoldingStatsChange']> = {
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  portfolioPortion?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  portfolioStatsChangeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  relatedPortfolioStatsChange?: Resolver<ResolversTypes['PortfolioStatsChange'], ParentType, ContextType>;
  relatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstrumentInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['InstrumentInfo'] = ResolversParentTypes['InstrumentInfo']> = {
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exchange?: Resolver<ResolversTypes['ExchangeInfo'], ParentType, ContextType>;
  marketState?: Resolver<ResolversTypes['HoldingStatsMarketState'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  regularMarketPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  regularMarketTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstrumentMarketDataResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['InstrumentMarketData'] = ResolversParentTypes['InstrumentMarketData']> = {
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  marketState?: Resolver<ResolversTypes['HoldingStatsMarketState'], ParentType, ContextType>;
  regularMarketPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  regularMarketTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setTrades?: Resolver<ResolversTypes['SetTradesResult'], ParentType, ContextType, RequireFields<MutationSetTradesArgs, 'input'>>;
};

export type ObservedHoldingStatsResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedHoldingStats'] = ResolversParentTypes['ObservedHoldingStats']> = {
  breakEvenPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  currentPortfolioPortion?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastChangedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastRelatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceData?: Resolver<ResolversTypes['InstrumentMarketData'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalPositionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ObservedHoldingStatsUpdateResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedHoldingStatsUpdate'] = ResolversParentTypes['ObservedHoldingStatsUpdate']> = {
  data?: Resolver<ResolversTypes['ObservedHoldingStats'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ObservedHoldingStatsUpdateType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ObservedPortfolioStatsResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedPortfolioStats'] = ResolversParentTypes['ObservedPortfolioStats']> = {
  forCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastChangedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  relatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ObservedPortfolioStatsUpdateResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedPortfolioStatsUpdate'] = ResolversParentTypes['ObservedPortfolioStatsUpdate']> = {
  data?: Resolver<ResolversTypes['ObservedPortfolioStats'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ObservedPortfolioStatsUpdateType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ObservedPositionResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedPosition'] = ResolversParentTypes['ObservedPosition']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  openedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  openingTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  originalQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceData?: Resolver<ResolversTypes['InstrumentMarketData'], ParentType, ContextType>;
  realizedProfitOrLoss?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  recordCreatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  recordUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  remainingQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ObservedPositionUpdateResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ObservedPositionUpdate'] = ResolversParentTypes['ObservedPositionUpdate']> = {
  data?: Resolver<ResolversTypes['ObservedPosition'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ObservedPositionUpdateType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PnlInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['PnlInfo'] = ResolversParentTypes['PnlInfo']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currencyAdjusted?: Resolver<ResolversTypes['CurrencyAdjustedPnlInfo'], ParentType, ContextType, RequireFields<PnlInfoCurrencyAdjustedArgs, 'currency'>>;
  percent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioStatsResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['PortfolioStats'] = ResolversParentTypes['PortfolioStats']> = {
  composition?: Resolver<Array<ResolversTypes['SymbolPortfolioPortion']>, ParentType, ContextType>;
  forCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastChangedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  relatedHoldingStats?: Resolver<ResolversTypes['HoldingStats'], ParentType, ContextType>;
  relatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioStatsChangeResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['PortfolioStatsChange'] = ResolversParentTypes['PortfolioStatsChange']> = {
  changedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  composition?: Resolver<Array<ResolversTypes['SymbolPortfolioPortion']>, ParentType, ContextType>;
  forCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  relatedHoldingStatsChange?: Resolver<ResolversTypes['HoldingStatsChange'], ParentType, ContextType>;
  relatedTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalPresentInvestedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRealizedProfitOrLossRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PositionResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instrument?: Resolver<ResolversTypes['InstrumentInfo'], ParentType, ContextType>;
  openedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  openingTradeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceData?: Resolver<ResolversTypes['InstrumentMarketData'], ParentType, ContextType>;
  realizedProfitOrLoss?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  recordCreatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  recordUpdatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  remainingQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  unrealizedPnl?: Resolver<ResolversTypes['ProfitOrLoss'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PositionProfitInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['PositionProfitInfo'] = ResolversParentTypes['PositionProfitInfo']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PriceDataChangeNotificationResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['PriceDataChangeNotification'] = ResolversParentTypes['PriceDataChangeNotification']> = {
  priceUpdates?: Resolver<Array<ResolversTypes['SymbolPriceData']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfitOrLossResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['ProfitOrLoss'] = ResolversParentTypes['ProfitOrLoss']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currencyAdjusted?: Resolver<ResolversTypes['CurrencyAdjustedPnlInfo'], ParentType, ContextType, RequireFields<ProfitOrLossCurrencyAdjustedArgs, 'currency'>>;
  percent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSymbolHoldingForTest?: Resolver<ResolversTypes['HoldingRevenueChangeNotification'], ParentType, ContextType>;
  getSymbolPriceDataForTest?: Resolver<ResolversTypes['SymbolPriceData'], ParentType, ContextType>;
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  holdingStats?: Resolver<Array<ResolversTypes['HoldingStats']>, ParentType, ContextType, Partial<QueryHoldingStatsArgs>>;
  holdingStatsChanges?: Resolver<Array<ResolversTypes['HoldingStatsChange']>, ParentType, ContextType, Partial<QueryHoldingStatsChangesArgs>>;
  portfolioStats?: Resolver<ResolversTypes['PortfolioStats'], ParentType, ContextType>;
  portfolioStatsChanges?: Resolver<Array<ResolversTypes['PortfolioStatsChange']>, ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, Partial<QueryPositionsArgs>>;
};

export type RevenueInfoResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['RevenueInfo'] = ResolversParentTypes['RevenueInfo']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetTradesResultResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['SetTradesResult'] = ResolversParentTypes['SetTradesResult']> = {
  tradesAddedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tradesModifiedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tradesRemovedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  aggregatePnl?: SubscriptionResolver<ResolversTypes['AggregatePnlChangeResult'], "aggregatePnl", ParentType, ContextType, Partial<SubscriptionAggregatePnlArgs>>;
  holdingStats?: SubscriptionResolver<Array<ResolversTypes['ObservedHoldingStatsUpdate']>, "holdingStats", ParentType, ContextType, Partial<SubscriptionHoldingStatsArgs>>;
  observeHoldingRevenue?: SubscriptionResolver<ResolversTypes['HoldingRevenueChangeNotification'], "observeHoldingRevenue", ParentType, ContextType, RequireFields<SubscriptionObserveHoldingRevenueArgs, 'input'>>;
  observePricesData?: SubscriptionResolver<ResolversTypes['PriceDataChangeNotification'], "observePricesData", ParentType, ContextType, RequireFields<SubscriptionObservePricesDataArgs, 'input'>>;
  portfolioStats?: SubscriptionResolver<Array<ResolversTypes['ObservedPortfolioStatsUpdate']>, "portfolioStats", ParentType, ContextType>;
  positions?: SubscriptionResolver<Array<ResolversTypes['ObservedPositionUpdate']>, "positions", ParentType, ContextType, RequireFields<SubscriptionPositionsArgs, 'filters'>>;
};

export type SymbolHoldingResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['SymbolHolding'] = ResolversParentTypes['SymbolHolding']> = {
  breakEvenPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  positions?: Resolver<Array<ResolversTypes['SymbolPosition']>, ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unrealizedProfit?: Resolver<ResolversTypes['PositionProfitInfo'], ParentType, ContextType>;
  userAlias?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SymbolPortfolioPortionResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['SymbolPortfolioPortion'] = ResolversParentTypes['SymbolPortfolioPortion']> = {
  portion?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SymbolPositionResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['SymbolPosition'] = ResolversParentTypes['SymbolPosition']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isRealized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  realizedQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SymbolPriceDataResolvers<ContextType = AppGqlContextValue, ParentType extends ResolversParentTypes['SymbolPriceData'] = ResolversParentTypes['SymbolPriceData']> = {
  regularMarketPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  regularMarketTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = AppGqlContextValue> = {
  AggregatePnlChangeResult?: AggregatePnlChangeResultResolvers<ContextType>;
  AggregatePnlResultItem?: AggregatePnlResultItemResolvers<ContextType>;
  AggregatePnlResultItemTranslated?: AggregatePnlResultItemTranslatedResolvers<ContextType>;
  CurrencyAdjustedPnlInfo?: CurrencyAdjustedPnlInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  ExchangeInfo?: ExchangeInfoResolvers<ContextType>;
  HoldingRevenueChange?: HoldingRevenueChangeResolvers<ContextType>;
  HoldingRevenueChangeNotification?: HoldingRevenueChangeNotificationResolvers<ContextType>;
  HoldingStats?: HoldingStatsResolvers<ContextType>;
  HoldingStatsChange?: HoldingStatsChangeResolvers<ContextType>;
  InstrumentInfo?: InstrumentInfoResolvers<ContextType>;
  InstrumentMarketData?: InstrumentMarketDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ObservedHoldingStats?: ObservedHoldingStatsResolvers<ContextType>;
  ObservedHoldingStatsUpdate?: ObservedHoldingStatsUpdateResolvers<ContextType>;
  ObservedPortfolioStats?: ObservedPortfolioStatsResolvers<ContextType>;
  ObservedPortfolioStatsUpdate?: ObservedPortfolioStatsUpdateResolvers<ContextType>;
  ObservedPosition?: ObservedPositionResolvers<ContextType>;
  ObservedPositionUpdate?: ObservedPositionUpdateResolvers<ContextType>;
  PnlInfo?: PnlInfoResolvers<ContextType>;
  PortfolioStats?: PortfolioStatsResolvers<ContextType>;
  PortfolioStatsChange?: PortfolioStatsChangeResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PositionProfitInfo?: PositionProfitInfoResolvers<ContextType>;
  PriceDataChangeNotification?: PriceDataChangeNotificationResolvers<ContextType>;
  ProfitOrLoss?: ProfitOrLossResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RevenueInfo?: RevenueInfoResolvers<ContextType>;
  SetTradesResult?: SetTradesResultResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SymbolHolding?: SymbolHoldingResolvers<ContextType>;
  SymbolPortfolioPortion?: SymbolPortfolioPortionResolvers<ContextType>;
  SymbolPosition?: SymbolPositionResolvers<ContextType>;
  SymbolPriceData?: SymbolPriceDataResolvers<ContextType>;
};

