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
import { useDepositCallbackCredit } from './useCreditLiqAddCallback';

export const useLiquidityCreateTransactionDispatch = (
  apr: string,
  asset: Token,
  collateral: Token,
  assetInAmount: BigNumber,
  collateralInAmount: BigNumber,
  maturity: string,
  debt: string,
  deadline: string,
  liquidity: string,
  slippage: string,
  depositCallback: (err?: any) => void,
  handleCloseParent: any,
) => {
  const { account, web3, chainId } = useActiveWeb3React();

  const { addTransaction, setTransactionStatus, resetState, transactionInfo } =
    useCurrentTransactions();

  const afterAssetApprovalCallback = async (id: string) => {
    getConvenienceApproval(
      collateral,
      chainId,
      web3,
      account as string,
      collateralInAmount,
      setTransactionStatus,
      id,
    );
  };

  const assetApprovalFn = useConvenienceAllowanceCallback(
    asset,
    assetInAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    transactionInfo,
    afterAssetApprovalCallback,
  );

  const collateralApprovalFn = useConvenienceAllowanceCallback(
    collateral,
    collateralInAmount,
    async (err: any) => {
      if (err) {
        depositCallback(err);
      }
    },
    addTransaction,
    setTransactionStatus,
    transactionInfo,
  );

  const depositFn = useDepositCallbackCredit(
    asset,
    collateral,
    assetInAmount.toFixed(),
    collateralInAmount.toFixed(),
    maturity,
    debt,
    deadline,
    liquidity,
    slippage,
    depositCallback,
  );

  const defaultObj = (
    allowance0TXID: string,
    allowance1TXID: string,
    depositTXID: string,
    depositComponent: JSX.Element,
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
        action: () => assetApprovalFn(allowance0TXID, allowance1TXID),
      },
      {
        uuid: allowance1TXID,
        description: `Checking your ${collateral.symbol} allowance`,
        status: 'WAITING',
        actionName: `Approve ${collateral.symbol}`,
        action: () => collateralApprovalFn(allowance1TXID),
      },
      {
        uuid: depositTXID,
        description: `Lend ${asset.symbol}`,
        status: 'WAITING',
        actionName: 'Confirm Deposit',
        action: () => depositFn(depositTXID),
      },
    ],
    transactionComponent: depositComponent,
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
            Deposit Summary
          </StyledInterTypography>
          <SubCard>
            <HorizontalInfo header="Total LP Amoung" value={`3000$`} />
            <HorizontalInfo
              header={`Amount of ${collateral.symbol}`}
              value={`${formatCurrency(collateralInAmount.toFixed())} ${
                collateral.symbol
              }`}
            />
            <HorizontalInfo
              header={`Amount of ${asset.symbol}`}
              value={`${formatCurrency(assetInAmount.toFixed())} ${
                asset.symbol
              }`}
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
              header="LP Minted"
              value={`${formatCurrency(liquidity)}%`}
            />
            <HorizontalInfo
              header="LP APR"
              value={`${formatCurrency(Number(apr) * 100)}%`}
            />
            <HorizontalInfo
              header="Maturity Date"
              value={`${formatTimestamp(maturity.toString())}`}
            />
            <HorizontalInfo
              header="Loan term"
              value={`${formatCurrency(
                (Number(maturity) - Date.now() / 1000) / 86400,
              )} days`}
            />
          </InfoCard>
        </Box>
      </>
    );
  }, [
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    liquidity,
    apr,
    maturity,
  ]);

  const startTransactions = useCallback(async () => {
    const allowance0TXID = uuid();
    const allowance1TXID = uuid();
    const lendTXID = uuid();
    resetState();
    addTransaction(
      defaultObj(allowance0TXID, allowance1TXID, lendTXID, lendComponent),
    );
    handleCloseParent();
    setTimeout(() => {
      getConvenienceApproval(
        asset,
        chainId,
        web3,
        account as string,
        assetInAmount,
        setTransactionStatus,
        allowance0TXID,
        () => afterAssetApprovalCallback(allowance1TXID),
      );
    });
  }, [
    addTransaction,
    resetState,
    defaultObj,
    lendComponent,
    handleCloseParent,
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    chainId,
    web3,
    account,
    setTransactionStatus,
    getConvenienceApproval,
    afterAssetApprovalCallback,
  ]);

  return startTransactions;
};
