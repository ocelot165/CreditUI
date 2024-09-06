import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Token } from 'types/assets';
import { getConvenienceContract } from 'constants/contracts';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { getGasPrice } from 'functions/transactions/getGasPrice';
import { Contract } from 'types/web3';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { NATIVE_ADDRESS } from 'constants/contracts/addresses';

export const useRepayCallback = (
  asset: Token,
  collateral: Token,
  maturity: BigNumber,
  assetIn: BigNumber,
  positionId: string,
  deadline: string,
  slippage: string,
  repayCallback: (err?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const { addTransaction, setTransactionStatus } = useCurrentTransactions();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (repayTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);

        // SUBMIT LEND TRANSACTION

        const txDeadline = '' + moment().utc().add(deadline, 'minutes').unix();

        let func = 'repay';
        let params: any = [
          {
            asset: asset.address,
            collateral: collateral.address,
            maturity: maturity.toFixed(),
            collateralTo: account,
            creditPositionId: positionId,
            deadline: txDeadline,
          },
        ];
        let sendValue = '0';
        if (asset.address === NATIVE_ADDRESS[chainId]) {
          func = 'repayETHAsset';
          params = [
            {
              collateral: collateral.address,
              maturity: maturity.toFixed(),
              collateralTo: account,
              creditPositionId: positionId,
              deadline: txDeadline,
            },
          ];
          sendValue = '0';
        }
        if (collateral.address === NATIVE_ADDRESS[chainId]) {
          func = 'repayETHCollateral';
          params = [
            {
              asset: asset.address,
              maturity: maturity.toFixed(),
              collateralTo: account,
              creditPositionId: positionId,
              deadline: txDeadline,
            },
          ];
          sendValue = '0';
        }

        const convenienceContract = getConvenienceContract(web3, chainId);
        callContractWait(
          convenienceContract as Contract,
          func,
          params,
          gasPrice,
          repayTXID,
          async (err: any) => {
            if (err) {
              return repayCallback(err);
            }
            repayCallback();
          },
          sendValue,
        );
      } catch (ex) {
        repayCallback(ex);
      }
    };
  }, [
    asset,
    collateral,
    assetIn,
    repayCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    web3,
    account,
    chainId,
  ]);
};
