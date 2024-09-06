import BigNumber from 'bignumber.js';
import { CreditPosition } from 'functions/credit/creditPositions';

export type LendingPair = {
  address: string;
  asset: Token;
  collateral: Token;
  bestAPR?: BigNumber;
  totalLiquidity?: BigNumber;
  pools: LendingPool[];
  fee: BigNumber;
  protocolFee: BigNumber;
};

export type Token = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
};

export type CreditedPool = {
  bondInterestBalance: BigNumber;
  bondPrincipalBalance: BigNumber;
  insuranceInterestBalance: BigNumber;
  insurancePrincipalBalance: BigNumber;
  position: CreditPosition;
};

export interface LendingPool {
  X: BigNumber;
  Y: BigNumber;
  Z: BigNumber;
  assetReserve?: BigNumber;
  collateralReserve?: BigNumber;
  bondInterestBalance?: BigNumber;
  bondPrincipalBalance?: BigNumber;
  insuranceInterestBalance?: BigNumber;
  insurancePrincipalBalance?: BigNumber;
  liquidityAddress: string;
  bondInterestAddress: string;
  bondPrincipalAddress: string;
  insuranceInterestAddress: string;
  insurancePrincipalAddress: string;
  collateralizedDebtAddress: string;
  dues?: Due[];
  lps?: Lp[];
  creditedPools?: CreditedPool[];
  collateralFactor?: BigNumber;
  minCDP?: BigNumber;
  maxAPR?: BigNumber;
  maturity: number;
  matured?: boolean;
  maturationPercentage?: number;
  position?: CreditPosition;
  index?: number;
  pair: {
    address: string;
    name: string;
    fee: BigNumber;
    protocolFee: BigNumber;
    asset: Token;
    collateral: Token;
  };
  totalSupply?: BigNumber;
  feeStored?: BigNumber;
}

export type Position = {
  maxAPR: BigNumber;
  liquidityBalance?: BigNumber;
  bondInterestBalance?: BigNumber;
  bondPrincipalBalance?: BigNumber;
  insuranceInterestBalance?: BigNumber;
  insurancePrincipalBalance?: BigNumber;
  collateralizedDebtBalance?: BigNumber;
  maturation;
  matured;
  maturity;
  asset;
};

export type Lp = {
  balance: BigNumber;
  positionId: number;
  position: CreditPosition;
};
export type Due = {
  debt: BigNumber;
  collateral: BigNumber;
  positionId?: number;
  position?: CreditPosition;
};

export type CreditProduct = 'lend' | 'borrow' | 'repay' | 'claim';

export type CreditState = {
  pair?: LendingPair;
  subPool?: number;
  maturity?: number;
  product: Product;
  status: string;
  selectedDue?: Due;
};

export type CP = {
  x: BigNumber;
  y: BigNumber;
  z: BigNumber;
};

export interface Claims {
  bondPrincipal: BigNumber;
  bondInterest: BigNumber;
  insurancePrincipal: BigNumber;
  insuranceInterest: BigNumber;
}

export enum TokenType {
  BOND_PRINCIPAL,
  BOND_INTEREST,
  INSURANCE_PRINCIPAL,
  INSURANCE_INTEREST,
  LIQUIDITY,
  COLLATERAL_DEBT,
}

export type CreditToken = {
  assetContract: string;
  tokenId: string;
  totalAmount: number;
  tokenType: TokenType;
};

export type UserInfo = {
  creditPositionIds: number[]; // The ids of the credit position
  amount: BigNumber; // How many LP tokens the user has provided
  rewardDebt: BigNumber; // The amount of CREDIT entitled to the user
};

export type PoolInfo = {
  allocPoint: BigNumber; // How many allocation points assigned to this pool. CREDIT to distribute per block
  lastRewardTime: BigNumber; // Last block number that CREDIT distribution occurs
  accCreditPerShare: BigNumber; // Accumulated CREDIT per share, times 1e12
  maturity: number; // The maturity of the pool
  lpSupply: BigNumber; // The total amount of LP tokens farmed
};

export const DYEAR = 31556926;
