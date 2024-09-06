import React from 'react';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { isPoolMatured } from 'functions/credit/utils';
import { Due, LendingPair, LendingPool } from 'types/credit';
import { formatTimestampToDate } from '@utils/index';
import SubCard from 'components/componentLibrary/Card/SubCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useRepayQuote } from 'hooks/credit/repay/useRepayQuote';
import { useRepayTransactionsDispatch } from 'hooks/credit/repay/repayTransactions/useRepayTransactions';

export interface BorrowPositionCardProps {
  position: {
    pair: LendingPair;
    pool: LendingPool;
    due: Due;
    maturity: number;
  };
  index: number;
}

export default function BorrowPositionCard({
  position,
  index,
}: BorrowPositionCardProps) {
  const { pair, pool, due, maturity } = position;

  // ui calcs
  const quote = useRepayQuote(
    due?.debt,
    due?.collateral,
    due.debt.toFixed(),
    '0',
    0,
  );

  const positionInfo = {
    id: index + 1,
    apr: pool.maxAPR as BigNumber,
    maturity: pool.maturity,
    position0: new BigNumber(quote.amount1).toFixed(5),
    symbol0: pair.collateral.symbol,
    position1: new BigNumber(due.debt).toFixed(5),
    symbol1: pair.asset.symbol,
  };

  const repayDispatch = useRepayTransactionsDispatch(
    pair.asset,
    pair.collateral,
    new BigNumber(pool.maturity),
    quote.amount0,
    quote.amount1,
    (due?.position?.positionIndex as string).toString(),
    (err) => {
      console.log(err);
    },
    () => {},
  );

  return (
    <SubCard header={`Borrow NFT #${positionInfo.id}`}>
      <HorizontalInfo
        header={'Maturity time'}
        value={formatTimestampToDate(positionInfo.maturity * 1000)}
      />
      <HorizontalInfo
        header={'Borrow APR'}
        value={`${positionInfo?.apr.toFixed(2)}%`}
      />
      <HorizontalInfo
        header={'Borrowed Position'}
        value={`${positionInfo?.position1} ${positionInfo?.symbol1}`}
      />
      <HorizontalInfo
        header={'Locked Collateral'}
        value={`${positionInfo?.position0} ${positionInfo?.symbol0}`}
      />

      <XCaliButton
        variant="neutral"
        onClickFn={repayDispatch}
        Component="Repay"
        disabled={isPoolMatured(maturity)}
        type="filled"
        style={{ flex: '1' }}
      />
    </SubCard>
  );
}
