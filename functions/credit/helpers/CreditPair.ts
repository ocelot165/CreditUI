import BigNumber from 'bignumber.js';

import { CP, Claims, Due } from 'types/credit';

import LendMath from './LendMath';
import BorrowMath from './BorrowMath';
import LiquidityMath from './LiquidityMath';

export default class CreditPair {
  static calculateApr = (x: BigNumber, y: BigNumber): BigNumber => {
    const SECONDS = 31556926;
    const apr = y.times(SECONDS).div(x.times(Math.pow(2, 32)));
    return apr;
  };

  static calculateCdp = (
    x: BigNumber,
    z: BigNumber,
    assetDecimals: number,
    collateralDecimals: number,
  ): BigNumber => {
    return z
      .times(Math.pow(10, assetDecimals))
      .div(x)
      .div(Math.pow(10, collateralDecimals));
  };

  static calculateNewLiquidity(
    maturity: BigNumber,
    assetIn: BigNumber,
    debtIn: BigNumber,
    collateralIn: BigNumber,
    now: BigNumber,
  ): {
    assetIn: BigNumber;
    liquidityOut: BigNumber;
    dueOut: Due;
    xIncrease: BigNumber;
    yIncrease: BigNumber;
    zIncrease: BigNumber;
  } {
    const givenNewReturn = LiquidityMath.givenNew(
      maturity,
      assetIn,
      debtIn,
      collateralIn,
      now,
    );

    const liquidityReturn = LiquidityMath.mint(
      new BigNumber(0),
      {
        x: new BigNumber(0),
        y: new BigNumber(0),
        z: new BigNumber(0),
      },
      new BigNumber(0),
      maturity,
      givenNewReturn.xIncrease,
      givenNewReturn.yIncrease,
      givenNewReturn.zIncrease,
      now,
    );

    return { ...liquidityReturn, ...givenNewReturn };
  }

  static calculateLiquidityGivenAsset(
    state: CP,
    maturity: BigNumber,
    totalLiquidity: BigNumber,
    assetIn: BigNumber,
    now: BigNumber,
    feeStored: BigNumber,
  ): {
    assetIn: BigNumber;
    liquidityOut: BigNumber;
    dueOut: Due;
    xIncrease: BigNumber;
    yIncrease: BigNumber;
    zIncrease: BigNumber;
  } {
    const givenAssetReturn = LiquidityMath.givenAsset(
      state,
      assetIn,
      feeStored,
    );

    const liquidityReturn = LiquidityMath.mint(
      feeStored,
      state,
      totalLiquidity,
      maturity,
      givenAssetReturn.xIncrease,
      givenAssetReturn.yIncrease,
      givenAssetReturn.zIncrease,
      now,
    );

    return { ...liquidityReturn, ...givenAssetReturn };
  }

  static calculateLiquidityGivenCollateral(
    state: CP,
    maturity: BigNumber,
    totalLiquidity: BigNumber,
    collateralIn: BigNumber,
    now: BigNumber,
    feeStored: BigNumber,
  ): {
    assetIn: BigNumber;
    liquidityOut: BigNumber;
    dueOut: Due;
    xIncrease: BigNumber;
    yIncrease: BigNumber;
    zIncrease: BigNumber;
  } {
    const givenCollateralReturn = LiquidityMath.givenCollateral(
      state,
      maturity,
      collateralIn,
      now,
    );

    const liquidityReturn = LiquidityMath.mint(
      feeStored,
      state,
      totalLiquidity,
      maturity,
      givenCollateralReturn.xIncrease,
      givenCollateralReturn.yIncrease,
      givenCollateralReturn.zIncrease,
      now,
    );

    return { ...liquidityReturn, ...givenCollateralReturn };
  }

  static calculateRemoveLiquidity(
    reserves: { asset: BigNumber; collateral: BigNumber },
    totalClaims: Claims,
    totalLiquidity: BigNumber,
    liquidityIn: BigNumber,
    feeStored: BigNumber,
  ): { assetOut: BigNumber; collateralOut: BigNumber } {
    return LiquidityMath.burn(
      feeStored,
      reserves,
      totalClaims,
      totalLiquidity,
      liquidityIn,
    );
  }

  static calculateLendGivenPercent(
    state: CP,
    maturity: BigNumber,
    assetIn: BigNumber,
    percent: BigNumber,
    now: BigNumber,
    fee: BigNumber,
    protocolFee: BigNumber,
  ): {
    assetIn: BigNumber;
    lendFees: BigNumber;
    claimsOut: Claims;
    xIncrease: BigNumber;
    yDecrease: BigNumber;
    zDecrease: BigNumber;
  } {
    const givenPercentLendReturn = LendMath.givenPercent(
      fee,
      protocolFee,
      state,
      maturity,
      assetIn,
      percent,
      now,
    );

    const lendReturn = LendMath.lend(
      fee,
      protocolFee,
      state,
      maturity,
      givenPercentLendReturn.xIncrease,
      givenPercentLendReturn.yDecrease,
      givenPercentLendReturn.zDecrease,
      now,
    );

    return { ...lendReturn, ...givenPercentLendReturn };
  }

  static calculateBorrowGivenPercent(
    state: CP,
    maturity: BigNumber,
    assetOut: BigNumber,
    percent: BigNumber,
    now: BigNumber,
    fee: BigNumber,
    protocolFee: BigNumber,
  ): {
    assetOut: BigNumber;
    borrowFees: BigNumber;
    dueOut: Due;
    xDecrease: BigNumber;
    yIncrease: BigNumber;
    zIncrease: BigNumber;
  } {
    const givenPercentBorrowReturn = BorrowMath.givenPercent(
      fee,
      protocolFee,
      state,
      maturity,
      assetOut,
      percent,
      now,
    );

    const borrowReturn = BorrowMath.borrow(
      fee,
      protocolFee,
      state,
      maturity,
      givenPercentBorrowReturn.xDecrease,
      givenPercentBorrowReturn.yIncrease,
      givenPercentBorrowReturn.zIncrease,
      now,
    );

    return { ...borrowReturn, ...givenPercentBorrowReturn };
  }
}
