import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { CreditPair } from 'functions/credit';
import { LendingPool, LendingPair } from 'types/credit';

const defaultParams = {
  assetOut: new BigNumber(0),
  borrowFees: new BigNumber(0),
  dueOut: { debt: new BigNumber(0), collateral: new BigNumber(0) },
  xDecrease: new BigNumber(0),
  yIncrease: new BigNumber(0),
  zIncrease: new BigNumber(0),
};

export const useBorrowQuote = (
  pair: LendingPair,
  pool: LendingPool,
  assetOut: BigNumber,
  aprPercent: number,
) => {
  const { X, Y, Z, maturity } = pool;
  const { fee, protocolFee } = pair;
  const now = useMemo(() => new BigNumber(Date.now() / 1000 + 10), []);

  const borrowPercent = useMemo(
    () =>
      new BigNumber(aprPercent).div(100).times(new BigNumber(Math.pow(2, 32))),
    [aprPercent],
  );

  const { borrowFees, xDecrease, yIncrease, zIncrease, dueOut, isInvalid } =
    useMemo(() => {
      try {
        if (!assetOut.gt(0)) return { isInvalid: false, ...defaultParams };
        const state = { x: X, y: Y, z: Z };
        const params = CreditPair.calculateBorrowGivenPercent(
          state,
          new BigNumber(maturity),
          assetOut,
          borrowPercent,
          now,
          fee,
          protocolFee,
        );
        return { ...params, isInvalid: false };
      } catch (error) {
        console.warn('error@useBorrowQuote', error);
        return {
          isInvalid: true,
          ...defaultParams,
        };
      }
    }, [X, Y, Z, maturity, assetOut, borrowPercent, fee, now, protocolFee]);

  const cdp = useMemo(
    () =>
      CreditPair.calculateCdp(
        X.minus(xDecrease),
        zIncrease.plus(Z),
        pair.asset.decimals,
        pair.collateral.decimals,
      ),
    [xDecrease, zIncrease, X, Z, pair.asset.decimals, pair.collateral.decimals],
  );
  const apr = useMemo(
    () => CreditPair.calculateApr(X, yIncrease.plus(Y)),
    [yIncrease, X, Y],
  );

  return { borrowFees, dueOut, cdp, apr, borrowPercent, isInvalid };
};
