import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Token } from 'types/assets';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getTokenContract } from 'constants/contracts';
import { CONVENIENCE_ADDRESS } from 'constants/contracts/addresses';
import { MAX_UINT256 } from 'constants/';
import { getGasPrice } from 'functions/transactions/getGasPrice';

const useConvenienceAllowanceCallback = (
  asset: Token,
  assetIn: BigNumber,
  errorCallback: (err?: any) => void,
  addTransaction: any,
  setTransactionStatus: any,
  transactionInfo: any,
  completeCallback?: (allowanceId?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (allowanceTXID: string, allowance1TXID?: string) => {
      try {
        const gasPrice = await getGasPrice(web3);
        const tokenContract = getTokenContract(web3, asset.address);
        await new Promise((resolve, reject) => {
          callContractWait(
            tokenContract,
            'approve',
            [CONVENIENCE_ADDRESS[chainId], MAX_UINT256],
            gasPrice,
            allowanceTXID,
            (err: any) => {
              if (err) {
                errorCallback(err);
                return reject(err);
              }
              resolve(0);
            },
          );
        });
        completeCallback &&
          allowance1TXID &&
          (await completeCallback(allowance1TXID));
      } catch (ex) {
        errorCallback(ex);
      }
    };
  }, [
    asset,
    assetIn,
    errorCallback,
    addTransaction,
    setTransactionStatus,
    callContractWait,
    web3,
    account,
    chainId,
    transactionInfo,
    completeCallback,
  ]);
};

export default useConvenienceAllowanceCallback;
