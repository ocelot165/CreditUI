import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { Box } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { formatCurrency } from '@utils/index';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useLiquidityRemoveCallbackCredit } from './useLiquidityRemoveCallbackCredit';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { getCreditPositionApproval } from 'functions/approval/getCreditPositionApproval';
import { LendingPair, LendingPool } from 'types/credit';

export const useLiquidityRemoveTransactionDispatch = (
  pair: LendingPair,
  pool: LendingPool,
  liquidityOut: string,
  positionId: string,
  depositCallback: (err?: any) => void,
) => {
  const { web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const cpApprovalFn = useCreditPositionAllowanceCallback(
    positionId,
    (err) => {},
  );

  const withdrawFn = useLiquidityRemoveCallbackCredit(
    pair,
    pool,
    positionId,
    depositCallback,
  );

  const defaultObj = (
    allowanceTXID: string,
    withdrawTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Remove Liquidity`,
    type: 'Liquidity',
    verb: 'Liquidity Removed',
    transactions: [
      {
        uuid: allowanceTXID,
        description: `Checking your CLP allowance`,
        status: 'WAITING',
        actionName: `Approve Position`,
        action: () => cpApprovalFn(allowanceTXID),
      },
      {
        uuid: withdrawTXID,
        description: `Withdraw tokens from the pool`,
        status: 'WAITING',
        actionName: `Confirm`,
        action: () => withdrawFn(withdrawTXID),
      },
    ],
    txType: 'liquidity',
    transactionComponent: component,
  });

  const withdrawComponent = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <StyledInterTypography
            color="#8D8D8D"
            fontSize="12px"
            fontWeight="400"
          >
            Withdraw Summary
          </StyledInterTypography>
          <SubCard>
            <HorizontalInfo
              header={`Withdraw Amount`}
              value={`${formatCurrency(liquidityOut)} CLP`}
            />
          </SubCard>
        </Box>
      </>
    );
  }, [liquidityOut]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const lendTXID = uuid();
    resetState();
    addTransaction(defaultObj(allowance0TXID, lendTXID, withdrawComponent));
    setTimeout(() => {
      getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        positionId,
        allowance0TXID,
        undefined,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    chainId,
    web3,
    setTransactionStatus,
    withdrawComponent,
    positionId,
  ]);

  return startTransactions;
};
