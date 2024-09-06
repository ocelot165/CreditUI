import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { CreditMath, CreditPair } from 'functions/credit';
import { DYEAR } from 'types/credit';

type CreateQuote = {
  debt: string;
  liquidityMinted: string;
  initialAmt: string;
  error: boolean;
  numDays: string;
  cdp: string;
};

export const useQuoteCreateLiquidityCredit = (
  assetAmt: string,
  annualInterest: number,
  mat: string,
  collateralAmt: string,
  assetDecimals: number,
  collateralDecimals: number,
): CreateQuote => {
  return useMemo((): CreateQuote => {
    const maturity = new BigNumber(mat);
    const assetIn = new BigNumber(assetAmt).times(Math.pow(10, assetDecimals));
    const collateralIn = new BigNumber(collateralAmt).times(
      Math.pow(10, collateralDecimals),
    );
    const interest = new BigNumber(annualInterest).div(100);
    const now = new BigNumber(new Date().getTime() / 1000 + 5);

    const yIncrease = interest.times(Math.pow(2, 32)).div(DYEAR).times(assetIn);
    const debtIn = CreditMath.getDebt(maturity, assetIn, yIncrease, now);
    const { liquidityOut, zIncrease } = CreditPair.calculateNewLiquidity(
      maturity,
      assetIn,
      debtIn,
      collateralIn,
      now,
    );
    const cdp = CreditPair.calculateCdp(
      assetIn,
      zIncrease,
      assetDecimals,
      collateralDecimals,
    );

    return {
      debt: debtIn.div(Math.pow(10, assetDecimals)).toFixed(),
      liquidityMinted: liquidityOut.div(Math.pow(10, 18)).toFixed(),
      initialAmt: assetAmt,
      error: false,
      numDays: maturity
        .minus(now)
        .div(3600 * 24)
        .toFixed(),
      cdp: cdp.toFixed(),
    };
  }, [assetAmt, annualInterest, mat, collateralAmt]);
};
