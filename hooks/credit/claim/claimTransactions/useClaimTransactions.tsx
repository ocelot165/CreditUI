import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { Box } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import SubCard from 'components/componentLibrary/Card/SubCard';
import { useClaimCallback } from './useClaimCallback';
import { CreditPosition } from 'functions/credit/creditPositions';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';
import { getCreditPositionApproval } from 'functions/approval/getCreditPositionApproval';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

export const useClaimTransactionsDispatch = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  position: CreditPosition,
  claimCallback: (err?: any) => void,
) => {
  const { web3, chainId } = useActiveWeb3React();
  const { addTransaction, resetState, setTransactionStatus } =
    useCurrentTransactions();

  const assetApprovalFn = useCreditPositionAllowanceCallback(
    position.positionIndex,
    addTransaction,
    () => {},
  );

  const claimFn = useClaimCallback(
    asset,
    collateral,
    maturity,
    position,
    claimCallback,
  );

  const defaultObj = (
    allowanceTXID: string,
    claimTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Claim Rewards`,
    type: 'Repaying',
    verb: `Rewards Claimed Successfully`,
    transactions: [
      {
        uuid: allowanceTXID,
        description: `Checking your position allowance`,
        status: 'WAITING',
        actionName: `Approve Position`,
        action: () => assetApprovalFn(allowanceTXID),
      },
      {
        uuid: claimTXID,
        description: `Claim ${asset.symbol} / ${collateral.symbol}`,
        status: 'WAITING',
        actionName: 'Confirm',
        action: () => claimFn(claimTXID),
      },
    ],
    transactionComponent: component,
    txType: 'lend',
  });

  const component = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <StyledInterTypography
            color="#8D8D8D"
            fontSize="12px"
            fontWeight="400"
          >
            Rewards Summary
          </StyledInterTypography>
          <SubCard>
            <HorizontalInfo
              header="Reward at Maturity"
              value={`${new BigNumber(position.bondInterest?.totalAmount ?? 0)
                .plus(position.bondPrincipal?.totalAmount ?? 0)
                .div(Math.pow(10, asset.decimals))
                .toFixed(Number(asset.decimals))} ${
                asset.symbol
              } OR ${new BigNumber(position.insuranceInterest?.totalAmount ?? 0)
                .plus(position.insurancePrincipal?.totalAmount ?? 0)
                .div(Math.pow(10, collateral.decimals))
                .toFixed(Number(collateral.decimals))} ${collateral.symbol}`}
            />
            <HorizontalInfo header="Rewards in USD" value={`$150`} />
          </SubCard>
        </Box>
      </>
    );
  }, [position, asset, collateral]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    setTimeout(() => {
      getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        position.positionIndex,
        allowanceTXID,
        undefined,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    web3,
    chainId,
    position,
    setTransactionStatus,
  ]);

  return startTransactions;
};
