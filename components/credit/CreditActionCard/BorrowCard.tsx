import { Box, Typography } from '@mui/material';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import MaturityTab from '../MaturityTab';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import XCaliInput from 'components/componentLibrary/XCaliInput';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import Card from 'components/componentLibrary/Card';
import { LendingPair, LendingPool } from 'types/credit';
import { Type } from '../Pools';
import { useLendingPoolsByMaturity } from 'functions/credit';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency } from '@utils/index';
import BigNumber from 'bignumber.js';
import { useBorrowQuote } from 'hooks/credit/borrow/useBorrowQuote';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useToken } from 'hooks/useToken';
import { useBorrowTransactionsDispatch } from 'hooks/credit/borrow/borrowTransactions/useBorrowTransactions';

type BorrowCardProps = {
  pair: LendingPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: LendingPool;
};

export default function BorrowCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: BorrowCardProps) {
  const [assetOut, setAssetOut] = useState<string>();

  const assetToken = useToken(selectedPool.pair.asset.address);
  const collateralToken = useToken(selectedPool.pair.collateral.address);

  const aprPercent = useMemo(() => (assetOut ? 50 : 100), [assetOut]);
  const assetOutBN = new BigNumber(assetOut ?? '0').times(
    Math.pow(10, pair.asset.decimals),
  );
  const amountTooHigh = new BigNumber(assetOut ?? '0').gt(
    selectedPool?.assetReserve || 0,
  );

  const { dueOut, cdp, apr, borrowPercent, isInvalid } = useBorrowQuote(
    pair,
    selectedPool,
    amountTooHigh ? new BigNumber(0) : assetOutBN,
    aprPercent,
  );

  const errorMessage = useMemo(() => {
    if (assetOutBN.lt(0)) {
      return 'Invalid amount';
    } else if (isInvalid) {
      return 'Invalid transaction';
    }
    return null;
  }, [
    assetOutBN,
    isInvalid,
    dueOut,
    pair,
    amountTooHigh,
    selectedPool,
    collateralToken,
  ]);

  const dispatch = useBorrowTransactionsDispatch(
    apr.times(aprPercent),
    cdp,
    handleCloseModal,
    pair.asset,
    pair.collateral,
    new BigNumber(selectedPool.maturity),
    new BigNumber(assetOut ?? '0'),
    dueOut,
    borrowPercent,
    '10',
    '1',
    (err) => {},
  );

  return (
    <Card fontSize="l" header="Borrow" onClose={handleCloseModal}>
      <MaturityTab
        value={maturity}
        setValue={setMaturity}
        pair={pair}
        type={type}
      />
      <XCaliInput
        token={{ ...pair.asset, balance: assetToken?.balance }}
        value={assetOut}
        setValue={setAssetOut}
        title="Amount to Borrow"
        hideBalances={true}
      />
      <Box>
        <StyledInterTypography color="#8D8D8D" fontSize="12px" fontWeight="400">
          Borrow limit
        </StyledInterTypography>
        <SubCard>
          <HorizontalInfo
            header={selectedPool.pair.asset.symbol}
            value={formatCurrency(
              (selectedPool.assetReserve ?? '0').toString(),
            )}
            type="medium"
          />
        </SubCard>
      </Box>
      <InfoCard display="flex" flexDirection="column">
        <HorizontalInfo
          header="CDP"
          value={`${formatCurrency((cdp ?? '0').toString())}`}
        />
        <HorizontalInfo
          header="Borrow APR"
          value={`${formatCurrency(
            (apr.times(aprPercent) ?? '0').toString(),
          )}%`}
        />
        <HorizontalInfo
          header="Collateral to lock"
          value={dueOut.collateral
            .div(10 ** Number(pair.collateral.decimals))
            .toFixed()}
        />
        <HorizontalInfo
          header="Debt to repay"
          value={`${formatCurrency(
            dueOut.debt
              .div(10 ** Number(selectedPool.pair.asset.decimals))
              .toFixed(),
          )} ${selectedPool.pair.asset.symbol}`}
        />
        <HorizontalInfo
          header="Loan term"
          value={`${formatCurrency(
            (selectedPool?.maturity - Date.now() / 1000) / 86400,
          )} days`}
        />
      </InfoCard>

      {errorMessage && (
        <StyledInterTypography color="red" textAlign="center">
          {errorMessage}
        </StyledInterTypography>
      )}
      <XCaliButton
        variant="yellow"
        disabled={Boolean(isInvalid || errorMessage)}
        Component="Borrow"
        type="filled"
        onClickFn={dispatch}
      />
    </Card>
  );
}
