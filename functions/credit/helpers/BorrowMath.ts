import BigNumber from 'bignumber.js';

import * as CreditMath from './CreditMath';
import { shiftRightUp, divUp, mulDivUp, sqrtUp } from './math';
import { CP, Due } from 'types/credit';

const BASE = new BigNumber(1099511627776); // 0x10000000000

export function givenPercent(
  fee: BigNumber,
  protocolFee: BigNumber,
  state: CP,
  maturity: BigNumber,
  assetOut: BigNumber,
  percent: BigNumber,
  now: BigNumber,
): { xDecrease: BigNumber; yIncrease: BigNumber; zIncrease: BigNumber } {
  let yIncrease = new BigNumber(0);
  let zIncrease = new BigNumber(0);
  const xDecrease = getX(maturity, assetOut, fee, protocolFee, now);

  const xReserve = state.x.minus(xDecrease);

  if (percent.lte(0x80000000)) {
    let yMid = state.y.times(state.y);
    yMid = mulDivUp(yMid, state.x, xReserve);
    yMid = sqrtUp(yMid).minus(state.y);

    yIncrease = yMid.times(percent);
    yIncrease = shiftRightUp(yIncrease, 31);

    const yReserve = state.y.plus(yIncrease);

    let zReserve = state.x.times(state.y);
    const denominator = xReserve.times(yReserve);
    zReserve = mulDivUp(zReserve, state.z, denominator);

    zIncrease = zReserve.minus(state.z);
    return { xDecrease, yIncrease, zIncrease };
  } else {
    percent = new BigNumber(0x100000000).minus(percent);

    let zMid = state.z.times(state.z);
    zMid = mulDivUp(zMid, state.x, xReserve);
    zMid = sqrtUp(zMid).minus(state.z);

    zIncrease = zMid.times(percent);
    zIncrease = shiftRightUp(zIncrease, 31);

    const zReserve = state.z.plus(zIncrease);

    let yReserve = state.x.times(state.z);
    const denominator = xReserve.times(zReserve);
    yReserve = mulDivUp(yReserve, state.y, denominator);

    yIncrease = yReserve.minus(state.y);
    return { xDecrease, yIncrease, zIncrease };
  }
}

export function borrow(
  fee: BigNumber,
  protocolFee: BigNumber,
  state: CP,
  maturity: BigNumber,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): { assetOut: BigNumber; dueOut: Due; borrowFees: BigNumber } {
  if (now.gte(maturity)) throw new Error('E202');
  if (xDecrease.eq(0)) throw new Error('E205');

  const { dueOut, borrowFees } = CreditMath.borrow(
    maturity,
    state,
    xDecrease,
    yIncrease,
    zIncrease,
    fee,
    protocolFee,
    now,
  );
  const assetOut = xDecrease.minus(borrowFees);

  return { assetOut, dueOut, borrowFees };
}

function getX(
  maturity: BigNumber,
  assetOut: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
): BigNumber {
  const totalFee = fee.plus(protocolFee);
  const numerator = maturity.minus(now).times(totalFee).plus(BASE);

  let xDecrease = assetOut.times(numerator);
  xDecrease = divUp(xDecrease, BASE);

  return xDecrease;
}

export default {
  givenPercent,
  borrow,
};
