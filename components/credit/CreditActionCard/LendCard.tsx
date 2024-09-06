import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import MaturityTab from '../MaturityTab';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import XCaliInput from 'components/componentLibrary/XCaliInput';
import Card from 'components/componentLibrary/Card';
import { LendingPair, LendingPool } from 'types/credit';
import { Type } from '../Pools';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useToken } from 'hooks/useToken';
import BigNumber from 'bignumber.js';
import { useLendQuote } from 'hooks/credit/lend/useLendQuote';
import { formatCurrency } from '@utils/index';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import { useLendTransactionDispatch } from 'hooks/credit/lend/lendTransactions/useLendTransactions';

type LendingCardProps = {
  pair: LendingPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: LendingPool;
};

export default function LendCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: LendingCardProps) {
  const [assetIn, setAssetIn] = useState<string>();

  const assetToken = useToken(selectedPool.pair.asset.address);

  const aprPercent = 50;
  const assetInBN = new BigNumber(assetIn ?? '0').times(
    Math.pow(10, selectedPool.pair.asset.decimals),
  );

  const { insurance, bond, apr, lendPercent } = useLendQuote(
    pair,
    selectedPool,
    assetInBN,
    aprPercent,
  );

  const errorMessage = useMemo(() => {
    if (new BigNumber(assetIn ?? 0).lt(0)) {
      return 'Invalid amount';
    } else if (
      pair.asset &&
      new BigNumber(assetIn ?? 0).gt(assetToken?.balance ?? 0)
    ) {
      return `Greater than your available balance`;
    }
    return null;
  }, [assetIn, pair.asset, assetToken?.balance]);

  const dispatch = useLendTransactionDispatch(
    apr.times(aprPercent),
    handleCloseModal,
    pair.asset,
    pair.collateral,
    new BigNumber(selectedPool.maturity),
    new BigNumber(assetIn ?? '0'),
    bond,
    insurance,
    lendPercent,
    '10',
    '1',
    (err) => {
      console.log(err);
    },
  );

  return (
    <Card fontSize="l" header="Lend" onClose={handleCloseModal}>
      <MaturityTab
        type={type}
        value={maturity}
        setValue={setMaturity}
        pair={pair}
      />
      <XCaliInput
        value={assetIn}
        setValue={setAssetIn}
        token={{ ...pair.asset, balance: assetToken?.balance }}
        title="Amount to lend"
      />
      <InfoCard display="flex" flexDirection="column">
        <HorizontalInfo
          header="Supply APR"
          value={`${formatCurrency(
            (apr.times(aprPercent) ?? '0').toString(),
          )}%`}
        />
        <HorizontalInfo
          header="Loan term"
          value={`${formatCurrency(
            (selectedPool?.maturity - Date.now() / 1000) / 86400,
          )} days`}
        />
        <HorizontalInfo header="Total deposit" value="$3,000" />
        <HorizontalInfo
          header="Amount at Maturity"
          value={`${formatCurrency(
            bond.div(10 ** Number(pair.asset.decimals)).toFixed(),
          )} ${pair.asset.symbol}`}
        />
        <HorizontalInfo
          header="Amount protecting"
          value={`${formatCurrency(
            insurance.div(10 ** Number(pair.collateral.decimals)).toFixed(),
          )} ${pair.collateral.symbol}`}
        />
      </InfoCard>
      {errorMessage && (
        <StyledInterTypography color="red" textAlign="center">
          {errorMessage}
        </StyledInterTypography>
      )}
      <XCaliButton
        disabled={Boolean(errorMessage)}
        variant="blue"
        Component="Lend"
        type="filled"
        onClickFn={dispatch}
      />
    </Card>
  );
}
