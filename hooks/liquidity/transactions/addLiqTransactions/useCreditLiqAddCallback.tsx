import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useMemo } from 'react';
import { Token } from 'types/assets';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { useCallContractWait } from 'hooks/useCallContractWait';
import {
  NATIVE_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
} from 'constants/contracts/addresses';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { getConvenienceContract } from 'constants/contracts';
import {
  EXISTING_LIQUIDITY_CREDIT,
  EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET,
  EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL,
} from 'constants/contracts/functions';

export const useDepositCallbackCredit = (
  asset: Token,
  collateral: Token,
  assetInAmount: string,
  collateralInAmount: string,
  maturity: string,
  debt: string,
  deadline: string,
  liquidity: string,
  slippage: string,
  depositCallback: (err?: any) => void,
) => {
  const { account, chainId, web3 } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (depositTXID: string) => {
      try {
        if (!web3) {
          console.warn('web3 not found');
          depositCallback('web3 not found');
          return;
        }

        const gasPrice = await getGasPrice(web3);

        let toki0 = asset.address;
        let toki1 = collateral.address;
        if (asset.address === NATIVE_ADDRESS[chainId]) {
          toki0 = WRAPPED_NATIVE_ADDRESS[chainId];
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          toki1 = WRAPPED_NATIVE_ADDRESS[chainId];
        }

        // SUBMIT DEPOSIT TRANSACTION
        const sendSlippage = new BigNumber(100).minus(slippage).div(100);
        const sendSlippageInc = new BigNumber(100).plus(slippage).div(100);
        const assetAmount = new BigNumber(assetInAmount)
          .times(sendSlippageInc)
          .times(10 ** asset?.decimals)
          .toFixed(0);
        const collateralAmount = new BigNumber(collateralInAmount)
          .times(10 ** collateral?.decimals)
          .toFixed(0);
        const debtIn = new BigNumber(debt)
          .times(10 ** asset?.decimals)
          .times(sendSlippageInc)
          .toFixed(0);
        const minLiq = new BigNumber(liquidity)
          .times(sendSlippage)
          .times(10 ** 18)
          .toFixed(0);
        const txDeadline = '' + moment().utc().add(deadline, 'minutes').unix();
        let func = EXISTING_LIQUIDITY_CREDIT[chainId];
        let params: any = [
          {
            asset: asset.address,
            maxAsset: assetAmount,
            collateral: collateral.address,
            collateralIn: collateralAmount,
            deadline: txDeadline,
            maxDebt: debtIn,
            dueTo: account,
            liquidityTo: account,
            maturity: maturity,
            minLiquidity: minLiq,
          },
        ];

        let sendValue = undefined;

        if (asset.address === NATIVE_ADDRESS[chainId]) {
          func = EXISTING_LIQUIDITY_CREDIT_NATIVE_ASSET[chainId];
          params = [
            {
              collateral: collateral.address,
              collateralIn: collateralAmount,
              deadline: txDeadline,
              maxDebt: debtIn,
              dueTo: account,
              liquidityTo: account,
              maturity: maturity,
              minLiquidity: minLiq,
            },
          ];
          sendValue = assetAmount;
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          func = EXISTING_LIQUIDITY_CREDIT_NATIVE_COLLATERAL[chainId];
          params = [
            {
              asset: asset.address,
              maxAsset: assetAmount,
              deadline: txDeadline,
              maxDebt: debtIn,
              dueTo: account,
              liquidityTo: account,
              maturity: maturity,
              minLiquidity: minLiq,
            },
          ];
          sendValue = collateralAmount;
        }

        const convenienceContract = getConvenienceContract(web3, chainId);
        callContractWait(
          convenienceContract,
          func,
          params,
          gasPrice,
          depositTXID,
          async (err: any) => {
            if (err) {
              depositCallback(err);
              return;
            }
            depositCallback();
          },
          sendValue,
        );
      } catch (ex) {
        depositCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    assetInAmount,
    collateralInAmount,
    depositCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    account,
    chainId,
    web3,
  ]);
};
