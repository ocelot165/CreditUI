import { Box } from '@mui/material';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import MaturityTab from '../MaturityTab';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import XCaliInput from 'components/componentLibrary/XCaliInput';
import XCaliAddIcon from 'components/componentLibrary/AddIcon';
import { LendingPair, LendingPool } from 'types/credit';
import Card from 'components/componentLibrary/Card';
import { Type } from '../Pools';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { useToken } from 'hooks/useToken';
import { useQuoteAddLiquidityCredit } from 'hooks/liquidity/quotes/useQuoteAddLiquidityCredit';
import BigNumber from 'bignumber.js';
import { formatCurrency } from '@utils/index';
import { useLiquidityCreateTransactionDispatch } from 'hooks/liquidity/transactions/addLiqTransactions/useAddLiqTransactions';

type LPCardProps = {
  pair: LendingPair;
  maturity: number;
  setMaturity: Dispatch<SetStateAction<number>>;
  type: Type;
  handleCloseModal: any;
  selectedPool: LendingPool;
};

export default function LpCard({
  pair,
  maturity,
  setMaturity,
  type,
  handleCloseModal,
  selectedPool,
}: LPCardProps) {
  const assetToken = useToken(selectedPool.pair.asset.address);
  const collateralToken = useToken(selectedPool.pair.collateral.address);
  const [priorityAsset, setPriorityAsset] = useState<0 | 1>(0);

  const [amount0, setAmount0] = useState<string>();
  const [amount1, setAmount1] = useState<string>();

  const setAssetValue = (val: string) => {
    setPriorityAsset(0);
    setAmount0(val);
  };

  const setCollateralValue = (val: string) => {
    setPriorityAsset(1);
    setAmount1(val);
  };

  const expiredPool = useMemo(() => {
    return Number(selectedPool.maturity) * 1000 <= Date.now();
  }, [selectedPool.maturity]);

  const {
    debt,
    liquidityMinted,
    amount0: assetAmt,
    amount1: collateralAmount,
    error,
    numDays,
    cdp,
    apr,
  } = useQuoteAddLiquidityCredit(
    priorityAsset === 0 ? amount0 ?? '0' : amount1 ?? '0',
    selectedPool.X,
    selectedPool.Y,
    selectedPool.Z,
    selectedPool.maturity,
    selectedPool.totalSupply ?? new BigNumber(0),
    selectedPool?.feeStored ?? new BigNumber(0),
    pair?.protocolFee,
    pair.fee,
    priorityAsset,
    expiredPool,
    pair.asset.decimals,
    pair.collateral.decimals,
  );

  useEffect(() => {
    if (priorityAsset === 0) {
      if (amount0 === '') {
        setAmount1('');
      }
    } else {
      if (amount1 === '') {
        setAmount0('');
      }
    }
  }, [priorityAsset, amount0, amount1]);

  useEffect(() => {
    if (priorityAsset === 0) {
      setAmount1(
        collateralAmount.div(Math.pow(10, pair.collateral.decimals)).toString(),
      );
    } else {
      setAmount0(assetAmt.div(Math.pow(10, pair.asset.decimals)).toString());
    }
  }, [assetAmt, collateralAmount, priorityAsset, pair]);

  const dispatch = useLiquidityCreateTransactionDispatch(
    apr.toFixed(),
    pair.asset,
    pair.collateral,
    new BigNumber(amount0 ?? '0'),
    new BigNumber(amount1 ?? '0'),
    selectedPool.maturity.toString(),
    debt.div(Math.pow(10, pair.asset.decimals)).toFixed(),
    '10',
    liquidityMinted.div(Math.pow(10, 18)).toFixed(),
    '1',
    (err) => {},
    handleCloseModal,
  );

  return (
    <Card header="Provide Liquidity" fontSize="l" onClose={handleCloseModal}>
      <MaturityTab
        type={type}
        value={maturity}
        setValue={setMaturity}
        pair={pair}
      />
      <Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
          alignItems="center"
        >
          <XCaliInput
            value={amount0}
            setValue={setAssetValue}
            token={{ ...pair.asset, balance: assetToken?.balance }}
            title="Deposit amount"
          />
          <XCaliAddIcon innerColor="#FFBDE7" outerColor="#36252F" />
        </Box>
        <XCaliInput
          value={amount1}
          setValue={setCollateralValue}
          title="Deposit amount"
          token={{ ...pair.collateral, balance: collateralToken?.balance }}
        />
      </Box>

      <InfoCard display="flex" flexDirection="column">
        <HorizontalInfo header="Total LP amount" value="$0.0" />
        <HorizontalInfo
          header="LP minted"
          value={formatCurrency(
            liquidityMinted.div(Math.pow(10, 18)).toFixed(),
          )}
        />
        <HorizontalInfo
          header="LP APR"
          value={formatCurrency(apr.times(100).toFixed()) + '%'}
        />
        <HorizontalInfo
          header="Loan term"
          value={formatCurrency(numDays.toString()) + ' days'}
        />
      </InfoCard>
      <XCaliButton
        onClickFn={dispatch}
        variant="pink"
        Component="Provide Liquidity"
        type="filled"
      />
    </Card>
  );
}
