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
import useConvenienceAllowanceCallback from 'hooks/approval/useConvenienceApproval';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';
import { useRepayCallback } from './useRepayCallback';
import { CREDIT_POSITION_ADDRESS } from 'constants/contracts/addresses';
import { getCreditPositionApproval } from 'functions/approval/getCreditPositionApproval';
import useCreditPositionAllowanceCallback from 'hooks/approval/useCreditPositionApproval';

export const useRepayTransactionsDispatch = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  collateralOut: BigNumber,
  positionId: string,
  repayCallback: (err?: any) => void,
  handleCloseParent: any,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState } =
    useCurrentTransactions();

  const approvalFn = useCreditPositionAllowanceCallback(
    positionId,
    (err) => {},
  );

  const repayFn = useRepayCallback(
    asset,
    collateral,
    maturity,
    assetIn,
    positionId,
    '10',
    '1',
    repayCallback,
  );

  const defaultObj = (
    allowance0TXID: string,
    repayTXID: string,
    component: JSX.Element,
  ): AddTransaction => ({
    title: `Repay`,
    type: 'Repaying',
    verb: `${asset.symbol} repaid successfully`,
    transactions: [
      {
        uuid: allowance0TXID,
        description: `Checking your ${asset.symbol} allowance`,
        status: 'WAITING',
        actionName: `Approve ${asset.symbol}`,
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: repayTXID,
        description: `Repay ${asset.symbol}`,
        status: 'WAITING',
        actionName: `Confirm`,
        action: () => repayFn(repayTXID),
      },
    ],
    transactionComponent: component,
    txType: 'borrow',
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
            Summary
          </StyledInterTypography>
          <InfoCard display="flex" flexDirection="column">
            <HorizontalInfo
              header="Debt to repay(Max)"
              value={`${formatCurrency(assetIn.toString())} ${asset.symbol}`}
            />
            <HorizontalInfo
              header="Collateral to unlock(~)"
              value={`${formatCurrency(collateralOut.toString())} ${
                collateral.symbol
              }`}
            />
            <HorizontalInfo
              header="Maturity Date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetIn, asset, maturity, collateralOut, collateral]);

  const startTransactions = useCallback(() => {
    const allowanceTXID = uuid();
    const txID = uuid();
    resetState();
    addTransaction(defaultObj(allowanceTXID, txID, component));
    handleCloseParent();
    setTimeout(() => {
      getCreditPositionApproval(
        chainId,
        web3,
        setTransactionStatus,
        positionId,
        allowanceTXID,
        undefined,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    component,
    handleCloseParent,
    assetIn,
    asset,
    chainId,
    web3,
    account,
    setTransactionStatus,
    collateral,
    maturity,
    positionId,
    repayCallback,
  ]);

  return startTransactions;
};
