import { useMemo } from 'react';
import { useCallContractWait } from 'hooks/useCallContractWait';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { getCreditPositionContract } from 'constants/contracts';
import { CONVENIENCE_ADDRESS } from 'constants/contracts/addresses';
import { getGasPrice } from 'functions/transactions/getGasPrice';

const useCreditPositionAllowanceCallback = (
  positionId: string,
  errorCallback: (err?: any) => void,
  completeCallback?: (allowanceId?: any) => void,
) => {
  const { web3, account, chainId } = useActiveWeb3React();
  const callContractWait = useCallContractWait();

  return useMemo(() => {
    return async (allowanceTXID: string) => {
      try {
        const gasPrice = await getGasPrice(web3);
        const creditPositionContract = getCreditPositionContract(web3, chainId);
        await new Promise((resolve, reject) => {
          callContractWait(
            creditPositionContract,
            'approve',
            [CONVENIENCE_ADDRESS[chainId], positionId],
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
        completeCallback && (await completeCallback());
      } catch (ex) {
        errorCallback(ex);
      }
    };
  }, [
    positionId,
    errorCallback,
    callContractWait,
    web3,
    account,
    chainId,
    completeCallback,
  ]);
};

export default useCreditPositionAllowanceCallback;
