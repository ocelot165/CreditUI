import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { AddTransaction } from 'types/transactions';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import { Box } from '@mui/material';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import formatTimestamp, { formatCurrency } from '@utils/index';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import SubCard from 'components/componentLibrary/Card/SubCard';
import useConvenienceAllowanceCallback from 'hooks/approval/useConvenienceApproval';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import { useBorrowCallback } from './useBorrowCallback';

export const useBorrowTransactionsDispatch = (
  apr: BigNumber,
  cdp: BigNumber,
  handleCloseParent: any,
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetOut: BigNumber,
  dueOut: { debt: BigNumber; collateral: BigNumber },
  percent: BigNumber,
  deadline: string,
  slippage: string,
  borrowCallback: (err?: any) => void,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState, transactionInfo } =
    useCurrentTransactions();

  const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
  const maxCollateral = dueOut.collateral
    .times(sendSlippageInc)
    .div(Math.pow(10, collateral.decimals));

  const approvalFn = useConvenienceAllowanceCallback(
    collateral,
    maxCollateral,
    borrowCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
  );

  const borrowFn = useBorrowCallback(
    asset,
    collateral,
    maturity,
    assetOut,
    dueOut,
    percent,
    deadline,
    slippage,
    borrowCallback,
  );

  const defaultObj = (
    allowance0TXID: string,
    borrowTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Confirm Borrow`,
    type: 'Borrowing',
    verb: `${asset.symbol} borrowed successfully`,
    transactions: [
      {
        uuid: allowance0TXID,
        actionName: `Approve ${collateral.symbol}`,
        description: `Checking your ${asset.symbol} allowance`,
        status: 'WAITING',
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: borrowTXID,
        actionName: `Confirm`,
        description: `Borrow ${asset.symbol}`,
        status: 'WAITING',
        action: () => borrowFn(borrowTXID),
      },
    ],
    txType: 'borrow',
    transactionComponent: component,
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
            Collateral & Borrow Amount
          </StyledInterTypography>
          <SubCard>
            <HorizontalInfo
              header="Max Deposit Collateral"
              value={`${dueOut.collateral
                .div(Math.pow(10, collateral.decimals))
                .toFixed()} ${asset.symbol}`}
            />
            <HorizontalInfo
              header="Borrow Amount"
              value={`${assetOut.toFixed()} ${asset.symbol}`}
            />
            <HorizontalInfo header="CDP" value={`${cdp.toFixed()}`} />
          </SubCard>
        </Box>
        <Box gap="5px">
          <StyledInterTypography
            color="#8D8D8D"
            fontSize="12px"
            fontWeight="400"
          >
            Position Summary
          </StyledInterTypography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Borrow APR"
              value={`${formatCurrency((apr ?? '0').toString())}%`}
            />
            <HorizontalInfo
              header="Maturity Date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
            <HorizontalInfo
              header="Loan term"
              value={`${formatCurrency(
                (maturity.toNumber() - Date.now() / 1000) / 86400,
              )} days`}
            />
            <HorizontalInfo
              header="Debt to repay"
              value={`${dueOut.debt
                .div(Math.pow(10, asset.decimals))
                .toFixed()} ${collateral.symbol}`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetOut, collateral, maturity, asset, apr, dueOut, cdp]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        assetOut,
        setTransactionStatus,
        allowanceTXID,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    handleCloseParent,
    assetOut,
    asset,
    chainId,
    web3,
    account,
    setTransactionStatus,
  ]);

  return startTransactions;
};
