import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import useLendCallback from './useLendCallback';
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
import { get } from 'http';
import { getConvenienceApproval } from 'functions/approval/getConvenienceApproval';

export const useLendTransactionDispatch = (
  apr: BigNumber,
  handleCloseParent: any,
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  bond: BigNumber,
  insurance: BigNumber,
  percent: BigNumber,
  deadline: string,
  slippage: string,
  lendCallback: (err?: any) => void,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState, transactionInfo } =
    useCurrentTransactions();

  const approvalFn = useConvenienceAllowanceCallback(
    asset,
    assetIn,
    lendCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
  );

  const lendFn = useLendCallback(
    asset,
    collateral,
    maturity,
    assetIn,
    bond,
    insurance,
    percent,
    deadline,
    slippage,
    lendCallback,
    setTransactionStatus,
  );

  const defaultObj = (
    allowance0TXID: string,
    lendTXID: string,
    lendComponent: JSX.Element,
  ): AddTransaction => ({
    title: `Confirm Lend`,
    type: 'Lending',
    verb: `${asset.symbol} lent successfully`,
    txType: 'lend',
    transactions: [
      {
        uuid: allowance0TXID,
        description: `Checking your ${asset.symbol} allowance`,
        status: 'WAITING',
        actionName: `Approve ${asset.symbol}`,
        action: () => approvalFn(allowance0TXID),
      },
      {
        uuid: lendTXID,
        description: `Lend ${asset.symbol}`,
        status: 'WAITING',
        actionName: 'Confirm Deposit',
        action: () => lendFn(lendTXID),
      },
    ],
    transactionComponent: lendComponent,
  });

  const lendComponent = useMemo(() => {
    return (
      <>
        <Box gap="5px">
          <StyledInterTypography
            color="#8D8D8D"
            fontSize="12px"
            fontWeight="400"
          >
            Lend Amount
          </StyledInterTypography>
          <SubCard>
            <HorizontalInfo header="Total Deposit" value={`3000$`} />
            <HorizontalInfo
              header="Token Amount"
              value={`${formatCurrency(assetIn.toFixed())} ${asset.symbol}`}
            />
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
              header="Supply APR"
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
              header="Amount protecting"
              value={`${formatCurrency(
                insurance.div(10 ** Number(collateral.decimals)).toFixed(),
              )} ${collateral.symbol}`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [assetIn, insurance, collateral, maturity, asset, apr]);

  const startTransactions = useCallback(() => {
    const allowance0TXID = uuid();
    const lendTXID = uuid();
    resetState();
    addTransaction(defaultObj(allowance0TXID, lendTXID, lendComponent));
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        assetIn,
        setTransactionStatus,
        allowance0TXID,
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    lendComponent,
    handleCloseParent,
    assetIn,
    asset,
    chainId,
    web3,
    account,
    assetIn,
    setTransactionStatus,
  ]);

  return startTransactions;
};
