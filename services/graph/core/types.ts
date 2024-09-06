import { Token } from 'types/assets';

export type LendingPoolQuery = {
  id: string;
  maturity: number;
  X: string;
  Y: string;
  Z: string;
  assetReserve: string;
  collateralReserve: string;
  liquidityAddress: string;
  bondInterestAddress: string;
  bondPrincipalAddress: string;
  insuranceInterestAddress: string;
  insurancePrincipalAddress: string;
  collateralizedDebtAddress: string;
  timestamp: number;
};

export type LendingPairQuery = {
  address: string;
  name: string;
  fee: string;
  protocolFee: string;
  asset: Token;
  collateral: Token;
  pools: LendingPoolQuery[];
};

export type CDTQuery = {
  tokenId: string;
  pool: {
    id: string;
    maturity: number;
    X: string;
    Y: string;
    Z: string;
    assetReserve: string;
    collateralReserve: string;
    liquidityAddress: string;
    bondInterestAddress: string;
    bondPrincipalAddress: string;
    insuranceInterestAddress: string;
    insurancePrincipalAddress: string;
    collateralizedDebtAddress: string;
    pair: {
      address: string;
      name: string;
      fee: string;
      protocolFee: string;
      asset: Token;
      collateral: Token;
    };
    timestamp: number;
  };
};
