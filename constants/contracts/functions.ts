import { ChainIds } from 'constants/chains';
import { ChainMapping } from 'types/web3';

export const NEW_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'newLiquidityETHAsset',
  5: 'newLiquidityETHAsset',
  [ChainIds.ARBITRUM]: 'newLiquidityETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidityETHAsset',
  [ChainIds.LOCALHOST]: 'newLiquidityETHAsset',
};

export const NEW_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'newLiquidityETHCollateral',
  5: 'newLiquidityETHCollateral',
  [ChainIds.ARBITRUM]: 'newLiquidityETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidityETHCollateral',
  [ChainIds.LOCALHOST]: 'newLiquidityETHCollateral',
};

export const NEW_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'newLiquidity',
  5: 'newLiquidity',
  [ChainIds.ARBITRUM]: 'newLiquidity',
  [ChainIds.ARBITRUM_GOERLI]: 'newLiquidity',
  [ChainIds.LOCALHOST]: 'newLiquidity',
};

export const EXISTING_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'liquidityGivenCollateral',
  5: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateral',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateral',
};

export const EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'liquidityGivenCollateralETHAsset',
  5: 'liquidityGivenCollateralETHAsset',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateralETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateralETHAsset',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateralETHAsset',
};

export const EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'liquidityGivenCollateralETHCollateral',
  5: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.ARBITRUM]: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'liquidityGivenCollateralETHCollateral',
  [ChainIds.LOCALHOST]: 'liquidityGivenCollateralETHCollateral',
};

export const REMOVE_LIQUIDITY_CREDIT: ChainMapping = {
  250: 'removeLiquidity',
  5: 'removeLiquidity',
  [ChainIds.ARBITRUM]: 'removeLiquidity',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidity',
  [ChainIds.LOCALHOST]: 'removeLiquidity',
};

export const REMOVE_LIQUIDITY_CREDIT_NATIVE_ASSET: ChainMapping = {
  250: 'removeLiquidityETHAsset',
  5: 'removeLiquidityETHAsset',
  [ChainIds.ARBITRUM]: 'removeLiquidityETHAsset',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidityETHAsset',
  [ChainIds.LOCALHOST]: 'removeLiquidityETHAsset',
};

export const REMOVE_LIQUIDITY_CREDIT_NATIVE_COLLATERAL: ChainMapping = {
  250: 'removeLiquidityETHCollateral',
  5: 'removeLiquidityETHCollateral',
  [ChainIds.ARBITRUM]: 'removeLiquidityETHCollateral',
  [ChainIds.ARBITRUM_GOERLI]: 'removeLiquidityETHCollateral',
  [ChainIds.LOCALHOST]: 'removeLiquidityETHCollateral',
};
