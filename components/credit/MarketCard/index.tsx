import { Box, styled } from '@mui/material';
import React from 'react';
import CardTopSection from './CardTopSection';
import CardNameSection from './CardNameSection';
import CardMainSection, { CardMainInfo } from './CardMainSection';
import BigNumber from 'bignumber.js';
import { LendingPair } from 'types/credit';

const CardContainer = styled(Box)`
  border-radius: 12px;
  width: 282px;
  background: #161616;
`;

export default function CreditMarketCard({ pair }: { pair: LendingPair }) {
  // @TODO: calculate utilization rate
  const utilizationRate = '32%';

  const pools = pair?.pools || [];
  const poolsNumber = pools.length;
  const sumMaxAPRs = pools.reduce(
    (sum, { maxAPR = 0 }) => sum.plus(maxAPR),
    new BigNumber(0),
  );
  const averageAPR = `${sumMaxAPRs.dividedBy(poolsNumber).toFixed(2)}%`;

  const borrowAPR = `${new BigNumber(pair?.bestAPR ?? 0).toFixed(2)}%`;

  const { asset, collateral, totalLiquidity } = pair;
  const tvl = `$${totalLiquidity?.toFixed(2)}`;
  const sumMinCDPs = pools.reduce(
    (sum, { minCDP = 0 }) => sum.plus(minCDP),
    new BigNumber(0),
  );
  const cdp = `${sumMinCDPs.times(100).dividedBy(poolsNumber).toFixed(2)}%`;
  const maturity = pools.map((pool) => pool.maturity);

  const cardMainInfo: CardMainInfo = {
    averageAPR,
    borrowAPR,
    cdp,
    maturity,
    utilizationRate,
    tvl,
  };
  return (
    <CardContainer>
      <CardTopSection pools={poolsNumber} maturity={maturity} />
      <CardNameSection asset={asset} collateral={collateral} />
      <CardMainSection info={cardMainInfo} />
    </CardContainer>
  );
}
