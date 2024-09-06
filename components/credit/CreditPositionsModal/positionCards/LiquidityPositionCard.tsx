import React from 'react';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import { formatCurrency, formatTimestampToDate } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useLiquidityRemoveTransactionDispatch } from 'hooks/liquidity/transactions/removeLiqTransactions/useRemoveLiqTransactions';
import { LendingPair, LendingPool, Lp } from 'types/credit';

export interface LiquidityPositionProps {
  position?: {
    pair: LendingPair;
    pool: LendingPool;
    lp: Lp;
  };
  index: number;
}

export default function LiquidityPositionCard({
  position,
  index,
}: LiquidityPositionProps) {
  const { pair, pool, lp } = position || {};
  const positionInfo = {
    title: 'Liquidity Pool',
    id: index + 1,
    apr: pool?.maxAPR,
    maturity: Number(pool?.maturity),
    titlePosition0: 'D',
    position0: `${formatCurrency(
      new BigNumber(lp?.balance ?? 0).div(Math.pow(10, 18)).toFixed(),
    )}`,
    symbol0: 'CLP',
    titlePosition1: '',
    position1: '',
    symbol1: '',
  };

  const dispatch = useLiquidityRemoveTransactionDispatch(
    pair as LendingPair,
    pool as LendingPool,
    lp?.balance.div(Math.pow(10, 18)).toString() as string,
    lp?.positionId.toString() as string,
    (err) => {},
  );

  return (
    <SubCard header={`${positionInfo.title} NFT #${positionInfo.id}`}>
      <HorizontalInfo
        header={'Maturity time'}
        value={formatTimestampToDate(positionInfo.maturity * 1000)}
      />
      <HorizontalInfo header={'LP APR'} value={`${positionInfo?.apr}%`} />
      <HorizontalInfo
        header={'My Liquidity'}
        value={`${positionInfo?.position0} ${positionInfo?.symbol0}`}
      />

      <XCaliButton
        variant={'neutral'}
        onClickFn={dispatch}
        Component="Withdraw"
        type={'filled'}
        disabled={!isPoolMatured(positionInfo.maturity)}
      />
    </SubCard>
  );
}
