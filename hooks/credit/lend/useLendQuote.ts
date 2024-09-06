import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import * as LendMath from 'functions/credit/helpers/LendMath';
import CreditPair from 'functions/credit/helpers/CreditPair';

import { LendingPool, LendingPair } from 'types/credit';

export const useLendQuote = (
  pair: LendingPair,
  pool: LendingPool,
  assetIn: BigNumber,
  aprPercent: number,
) => {
  const { X, Y, Z, maturity } = pool;
  const { fee, protocolFee } = pair;
  const now = new BigNumber(Date.now() / 1000 + 10);
  const state = { x: X, y: Y, z: Z };

  const lendPercent = useMemo(
    () =>
      new BigNumber(aprPercent).div(100).times(new BigNumber(Math.pow(2, 32))),
    [aprPercent],
  );

  const { lendFees, xIncrease, yDecrease, zDecrease } = useMemo(
    () =>
      CreditPair.calculateLendGivenPercent(
        state,
        new BigNumber(maturity),
        assetIn,
        lendPercent,
        now,
        fee,
        protocolFee,
      ),
    [state, maturity, assetIn, lendPercent],
  );

  const cdp = useMemo(
    () =>
      CreditPair.calculateCdp(
        xIncrease.plus(X),
        zDecrease.plus(Z),
        pair.asset.decimals,
        pair.collateral.decimals,
      ),
    [xIncrease, zDecrease, X, Z],
  );
  const apr = useMemo(
    () => CreditPair.calculateApr(xIncrease.plus(X), yDecrease.plus(Y)),
    [xIncrease, yDecrease, X, Y],
  );

  const delState = { x: xIncrease, y: yDecrease, z: zDecrease };
  const insurance = useMemo(
    () => LendMath.getInsurance(state, delState, new BigNumber(maturity), now),
    [state, delState, maturity, now],
  );
  const bond = useMemo(
    () => LendMath.getBond(delState, new BigNumber(maturity), now),
    [state, delState, maturity, now],
  );
  return { lendFees, insurance, bond, cdp, apr, lendPercent };
};
