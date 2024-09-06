import React from 'react';
import Box from '@mui/material/Box';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import { LendingPair } from 'types/credit';
import { LendingPool } from 'types/credit';
import { formatTimestampToDate } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import VerticalInfo from 'components/componentLibrary/Info/VerticalInfo';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import { useClaimTransactionsDispatch } from 'hooks/credit/claim/claimTransactions/useClaimTransactions';
import { CreditPosition } from 'functions/credit/creditPositions';

interface LendPositionCardProps {
  position: {
    pair: LendingPair;
    pool: LendingPool;
    maturity: number;
  };
  index: number;
}

export default function LendPositionCard({
  position,
  index,
}: LendPositionCardProps) {
  const { pair, pool, maturity } = position;

  const bondPrincipalBalance = new BigNumber(
    pool.position?.bondPrincipal?.totalAmount ?? 0,
  );
  const bondInterestBalance = new BigNumber(
    pool.position?.bondPrincipal?.totalAmount ?? 0,
  );
  const insurancePrincipalBalance = new BigNumber(
    pool?.position?.insurancePrincipal?.totalAmount ?? 0,
  );
  const insuranceInterestBalance = new BigNumber(
    pool?.position?.insuranceInterest?.totalAmount ?? 0,
  );

  const positionInfo = {
    title: 'Lend',
    id: index + 1,
    apr: pool.maxAPR as BigNumber,
    maturity: pool.maturity,
    titlePosition0: 'Current deposit',
    position0: bondPrincipalBalance
      .div(Math.pow(10, pair.asset.decimals))
      .toFixed(4),
    symbol0: pair.asset.symbol,
    titlePosition1: '',
    position1: '',
    symbol1: '',
  };

  const dispatch = useClaimTransactionsDispatch(
    pair.asset,
    pair.collateral,
    new BigNumber(pool.maturity),
    pool.position as CreditPosition,
    (err) => {},
  );

  const renderLendInfo = () => {
    return (
      <>
        <Box border="1px solid #C7C7C7" marginBottom="24px" />
        <VerticalInfo
          header={'Reward at maturity:'}
          value={
            <Box display="flex" gap="16px" alignItems="center">
              <StyledInterTypography color="#F2F2F2">
                {`${bondPrincipalBalance
                  .plus(bondInterestBalance)
                  .div(Math.pow(10, pair.asset.decimals))
                  .toFixed(4)} ${pair?.asset?.symbol}`}
              </StyledInterTypography>
              <StyledInterTypography color="#F2F2F2">OR</StyledInterTypography>
              <StyledInterTypography color="#F2F2F2">
                {`${insurancePrincipalBalance
                  .plus(insuranceInterestBalance)
                  .div(Math.pow(10, pair.collateral.decimals))
                  .toFixed(4)} ${pair?.collateral?.symbol}`}
              </StyledInterTypography>
              {/* <CoinBalance
              coin={
                baseAssets?.[chainId]?.[getAddress(pair.collateral.address)] ??
                pair?.collateral
              }
              balance={pool?.insurancePrincipalBalance.plus(
                pool?.insuranceInterestBalance,
                )}
                fontSize="14px"
              /> */}
            </Box>
          }
        />
      </>
    );
  };

  return (
    <SubCard header={`Lend NFT #${positionInfo.id}`}>
      <HorizontalInfo
        header={'Maturity time'}
        value={formatTimestampToDate(positionInfo.maturity * 1000)}
      />
      <HorizontalInfo
        header={'Lend APR'}
        value={`${positionInfo?.apr.toFixed(2)}%`}
      />
      <HorizontalInfo
        header={positionInfo?.titlePosition0}
        value={`${positionInfo?.position0} ${positionInfo?.symbol0}`}
      />
      {renderLendInfo()}
      <XCaliButton
        variant={'neutral'}
        onClickFn={dispatch}
        disabled={!isPoolMatured(maturity)}
        Component="Claim Rewards"
        type="filled"
      />
    </SubCard>
  );
}
