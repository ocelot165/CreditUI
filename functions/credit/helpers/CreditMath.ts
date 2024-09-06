import BigNumber from 'bignumber.js';

import { CP, Claims, Due } from 'types/credit';
import { divUp, shiftRightUp, mulDivUp, mulDiv } from './math';

const BASE = new BigNumber(1099511627776); // 0x10000000000

export function mint(
  maturity: BigNumber,
  state: CP,
  totalLiquidity: BigNumber,
  feeStored: BigNumber,
  xIncrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): {
  liquidityOut: BigNumber;
  dueOut: Due;
  feeStoredIncrease: BigNumber;
} {
  let liquidityOut = new BigNumber(0);
  let feeStoredIncrease = new BigNumber(0);

  if (totalLiquidity.eq(0)) {
    liquidityOut = xIncrease.times(Math.pow(2, 16));
  } else {
    const fromX = mulDiv(totalLiquidity, xIncrease, state.x);
    const fromY = mulDiv(totalLiquidity, yIncrease, state.y);
    const fromZ = mulDiv(totalLiquidity, zIncrease, state.z);

    if (!fromY.lte(fromX)) console.error('E214');
    if (!fromZ.lte(fromX)) console.error('E215');

    liquidityOut = fromY.lte(fromZ) ? fromY : fromZ;
    feeStoredIncrease = mulDivUp(feeStored, liquidityOut, totalLiquidity);
  }

  let debt = maturity.minus(now).times(yIncrease);
  debt = shiftRightUp(debt, 32).plus(xIncrease);

  let collateral = maturity.minus(now).times(zIncrease);
  collateral = shiftRightUp(collateral, 25).plus(zIncrease);

  return { liquidityOut, dueOut: { debt, collateral }, feeStoredIncrease };
}

export function burn(
  totalLiquidity: BigNumber,
  feeStored: BigNumber,
  reserves: { asset: BigNumber; collateral: BigNumber },
  totalClaims: Claims,
  liquidityIn: BigNumber,
): {
  assetOut: BigNumber;
  collateralOut: BigNumber;
  feeOut: BigNumber;
} {
  let assetOut = new BigNumber(0);
  let collateralOut = new BigNumber(0);

  const totalAsset = reserves.asset;
  const totalCollateral = reserves.collateral;
  const totalBond = totalClaims.bondPrincipal.plus(totalClaims.bondInterest);

  if (totalAsset.gte(totalBond)) {
    assetOut = totalAsset.minus(totalBond);
    assetOut = mulDiv(assetOut, liquidityIn, totalLiquidity);

    collateralOut = mulDiv(totalCollateral, liquidityIn, totalLiquidity);
  } else {
    const deficit = totalBond.minus(totalAsset);

    const totalInsurance = totalClaims.insurancePrincipal.plus(
      totalClaims.insuranceInterest,
    );

    if (totalCollateral.times(totalBond).gt(deficit.times(totalInsurance))) {
      let subtrahend = deficit.times(totalInsurance);
      subtrahend = divUp(subtrahend, totalBond);
      collateralOut = totalCollateral.minus(subtrahend);
      collateralOut = mulDiv(collateralOut, liquidityIn, totalLiquidity);
    }
  }

  const feeOut = mulDiv(feeStored, liquidityIn, totalLiquidity);

  return { assetOut, collateralOut, feeOut };
}

export const lendGetFees = (
  maturity: BigNumber,
  xIncrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
) => {
  const totalFee = fee.plus(protocolFee);

  const numerator = new BigNumber(maturity)
    .minus(now)
    .times(totalFee)
    .plus(BASE);
  const totalFeeStoredIncrease = xIncrease
    .times(numerator)
    .div(BASE)
    .minus(xIncrease);
  return totalFeeStoredIncrease;
};

export const borrowGetFees = (
  maturity: BigNumber,
  xDecrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
) => {
  const totalFee = fee.plus(protocolFee);

  const denominator = maturity.minus(now).times(totalFee).plus(BASE);
  const adjusted = xDecrease.times(BASE).div(denominator);
  const totalFeeStoredIncrease = xDecrease.minus(adjusted);
  return totalFeeStoredIncrease;
};

export function lend(
  maturity: BigNumber,
  state: CP,
  xIncrease: BigNumber,
  yDecrease: BigNumber,
  zDecrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
): {
  claimsOut: Claims;
  lendFees: BigNumber;
} {
  const bondPrincipal = xIncrease;
  const bondInterest = getBondInterest(maturity, yDecrease, now);
  const insurancePrincipal = getInsurancePrincipal(state, xIncrease);
  const insuranceInterest = getInsuranceInterest(maturity, zDecrease, now);

  const lendFees = lendGetFees(maturity, xIncrease, fee, protocolFee, now);

  return {
    claimsOut: {
      bondPrincipal,
      bondInterest,
      insurancePrincipal,
      insuranceInterest,
    },
    lendFees,
  };
}

export function borrow(
  maturity: BigNumber,
  state: CP,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
  fee: BigNumber,
  protocolFee: BigNumber,
  now: BigNumber,
): {
  dueOut: Due;
  borrowFees: BigNumber;
} {
  borrowCheck(state, xDecrease, yIncrease, zIncrease);

  const debt = getDebt(maturity, xDecrease, yIncrease, now);
  const collateral = getCollateral(maturity, state, xDecrease, zIncrease, now);

  const borrowFees = borrowGetFees(maturity, xDecrease, fee, protocolFee, now);

  return {
    dueOut: { debt, collateral },
    borrowFees,
  };
}

export function getDebt(
  maturity: BigNumber,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  now: BigNumber,
): BigNumber {
  let debtIn = maturity.minus(now).times(yIncrease);
  debtIn = shiftRightUp(debtIn, 32).plus(xDecrease);
  return debtIn;
}

function getCollateral(
  maturity: BigNumber,
  state: CP,
  xDecrease: BigNumber,
  zIncrease: BigNumber,
  now: BigNumber,
): BigNumber {
  let collateralIn = maturity.minus(now).times(zIncrease);
  collateralIn = shiftRightUp(collateralIn, 25);

  let minimum = state.z.times(xDecrease);
  const denominator = state.x.minus(xDecrease);
  minimum = divUp(minimum, denominator);

  collateralIn = collateralIn.plus(minimum);
  return collateralIn;
}

export function getInsurancePrincipal(
  state: CP,
  xIncrease: BigNumber,
): BigNumber {
  return state.z.times(xIncrease).div(state.x).plus(xIncrease);
}

export function getBondInterest(
  maturity: BigNumber,
  yDecrease: BigNumber,
  now: BigNumber,
): BigNumber {
  return maturity.minus(now).times(yDecrease).div(Math.pow(2, 32));
}

export function getInsuranceInterest(
  maturity: BigNumber,
  zDecrease: BigNumber,
  now: BigNumber,
): BigNumber {
  return maturity.minus(now).times(zDecrease).div(Math.pow(2, 25));
}

function borrowCheck(
  state: CP,
  xDecrease: BigNumber,
  yIncrease: BigNumber,
  zIncrease: BigNumber,
) {
  const xReserve = state.x.minus(xDecrease);
  const yReserve = state.y.plus(yIncrease);
  const zReserve = state.z.plus(zIncrease);
  checkConstantProduct(state, xReserve, yReserve, zReserve);

  let yMax = xDecrease.times(state.y);
  yMax = divUp(yMax, xReserve);
  if (yIncrease.gt(yMax)) throw new Error('E214');

  let zMax = xDecrease.times(state.z);
  zMax = divUp(zMax, xReserve);
  if (zIncrease.gt(zMax)) throw new Error('E215');
}

export function checkConstantProduct(
  state: CP,
  xReserve: BigNumber,
  yAdjusted: BigNumber,
  zAdjusted: BigNumber,
) {
  const newProd = yAdjusted.times(zAdjusted).times(xReserve);
  const oldProd = state.y.times(state.z).times(state.x);
  if (newProd.lt(oldProd)) throw new Error('E301');
}
