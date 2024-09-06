import BigNumber from 'bignumber.js';

import * as CreditMath from './CreditMath';
import { mulDivUp, sqrtUp } from './math';
import { CP, Claims } from 'types/credit';

export const getBond = (
  delState: { x: BigNumber; y: BigNumber; z: BigNumber },
  maturity: BigNumber,
  now: BigNumber,
) => {
  return maturity
    .minus(now)
    .times(delState.y)
    .div(Math.pow(2, 32))
    .plus(delState.x);
};

export const getInsurance = (
  state: CP,
  delState: CP,
  maturity: BigNumber,
  now: BigNumber,
) => {
  const _insuranceOut = maturity
    .minus(now)
    .times(delState.z)
    .div(Math.pow(2, 25));
  const denominator = delState.x.plus(state.x);
  const minimum = state.z.times(delState.x).div(denominator);
  return _insuranceOut.plus(minimum);
};

export const givenPercent = (
  fee: BigNumber,
  protocolFee: BigNumber,
  state: CP,
  maturity: BigNumber,
  assetIn: BigNumber,
  percent: BigNumber,
  now: BigNumber,
) => {
  const xIncrease = getX(maturity, assetIn, fee, protocolFee, now);

  let xReserve = state.x;
  xReserve = xReserve.plus(xIncrease);

  // 0x80000000 = 2147483648
  if (percent.lte(0x80000000)) {
    let yMid = state.y;
    let subtrahend = state.y;
    subtrahend = subtrahend.times(state.y);
    subtrahend = mulDivUp(subtrahend, state.x, xReserve);
    subtrahend = sqrtUp(subtrahend);
    yMid = yMid.minus(subtrahend);

    let _yDecrease = yMid;
    _yDecrease = _yDecrease.times(percent);
    _yDecrease = _yDecrease.div(Math.pow(2, 31));

    let yReserve = state.y;
    yReserve = yReserve.minus(_yDecrease);

    let zReserve = state.x;
    zReserve = zReserve.times(state.y);
    let denominator = xReserve;
    denominator = denominator.times(yReserve);
    zReserve = mulDivUp(zReserve, state.z, denominator);

    let _zDecrease = state.z;
    _zDecrease = _zDecrease.minus(zReserve);

    return {
      xIncrease: xIncrease,
      yDecrease: _yDecrease,
      zDecrease: _zDecrease,
    };
  } else {
    const _percent = new BigNumber(0x100000000).minus(percent);

    let zMid = state.z;
    let subtrahend = state.z;
    subtrahend = subtrahend.times(state.z);
    subtrahend = mulDivUp(subtrahend, state.x, xReserve);
    subtrahend = sqrtUp(subtrahend);
    zMid = zMid.minus(subtrahend);

    let _zDecrease = zMid;
    _zDecrease = _zDecrease.times(_percent);
    _zDecrease = _zDecrease.div(Math.pow(2, 31));

    let zReserve = state.z;
    zReserve = zReserve.minus(_zDecrease);

    let yReserve = state.x;
    yReserve = yReserve.times(state.z);
    let denominator = xReserve;
    denominator = denominator.times(zReserve);
    yReserve = mulDivUp(yReserve, state.y, denominator);

    let _yDecrease = state.y;
    _yDecrease = _yDecrease.minus(yReserve);

    return {
      xIncrease: xIncrease,
      yDecrease: _yDecrease,
      zDecrease: _zDecrease,
    };
  }
};

export function lend(
  fee: BigNumber,
  protocolFee: BigNumber,
  state: CP,
  maturity: BigNumber,
  xIncrease: BigNumber,
  yDecrease: BigNumber,
  zDecrease: BigNumber,
  now: BigNumber,
): { assetIn: BigNumber; lendFees: BigNumber; claimsOut: Claims } {
  const { claimsOut, lendFees } = CreditMath.lend(
    maturity,
    state,
    xIncrease,
    yDecrease,
    zDecrease,
    fee,
    protocolFee,
    now,
  );

  const assetIn = xIncrease.plus(lendFees);
  return { assetIn, claimsOut, lendFees };
}

export const getX = (
  maturity: BigNumber,
  assetIn: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
) => {
  const duration = maturity.minus(now);

  const BASE = new BigNumber('0x10000000000'); // 1099511627776
  let denominator = duration.times(fee).plus(BASE);

  let xIncrease = assetIn.times(BASE).div(denominator);
  denominator = duration.times(protocolFee).plus(BASE);

  xIncrease = xIncrease.times(BASE);
  xIncrease = xIncrease.div(denominator);
  return xIncrease;
};

export default {
  givenPercent,
  lend,
};
