import { useMemo } from 'react';
import { Link, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { ERROR_MAP } from 'constants/contracts/errors';
import { Contract } from 'types/web3';
import { useSnackbar } from './useSnackbar';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useCurrentTransactions } from './useCurrentTransactions';

type TXError = {
  message: string;
  code: number;
};

const errorCodes = Object.keys(ERROR_MAP).map((code) => Number(code));

const UnknownMessage = ({ error }: { error: string }) => (
  <Typography variant="body-xs-regular" color="white">
    Please share this message to{' '}
    <Link
      href="https://discord.com/channels/932752916861820968/964491436743602178"
      target="_blank"
      color="primary.20"
    >
      #help-needed
    </Link>{' '}
    on our Discord:
    <br />
    <br />
    <Typography variant="body-xs-regular">{error}</Typography>
  </Typography>
);

const KnownMessage = ({ message }: { message: string }) => (
  <Typography variant="body-xs-regular" color="white">
    {message}
    <br />
    <br />
    Check your Metamask or other wallet's Activity tab for more info.
  </Typography>
);

export const useCallContractWait = () => {
  const { showSnackbar } = useSnackbar();
  const context = useActiveWeb3React();
  const { account } = context;
  const {
    setTransactionPending,
    setTransactionSubmitted,
    setTransactionConfirmed,
    setTransactionRejected,
  } = useCurrentTransactions();

  return useMemo(() => {
    return async (
      contract: Contract,
      method: string,
      params: any[],
      gasPrice: string,
      uuid: string,
      callback: any,
      sendValue?: string,
    ) => {
      const { web3 } = context;

      const handleError = (error: TXError) => {
        const { code, message } = error;
        if (message && code && errorCodes.includes(code)) {
          // if (code === 4001) {
          //   showSnackbar({
          //     message:
          //       'The wallet reports that you have rejected the transaction manually.  Aborting the transaction.',
          //     heading: 'Transaction Rejected by User',
          //     type: 'Info',
          //   });
          // } else {
          //   showSnackbar({
          //     message: 'An error occurred while running the transaction.',
          //     heading: 'Error',
          //     type: 'Error',
          //     ExtraComp: () => <KnownMessage message={message} />,
          //   });
          // }

          setTransactionRejected({ uuid, error: message });
          return callback(message, null);
        }

        // showSnackbar({
        //   message: 'An unknown error occurred while running the transaction.',
        //   heading: 'Error',
        //   type: 'Error',
        //   ExtraComp: () => <UnknownMessage error={error.toString()} />,
        // });
        setTransactionRejected({ uuid, error: error.message });
        callback(error, null);
      };

      if (!web3) {
        console.warn('web3 not found');
        return null;
      }

      setTransactionPending({ uuid });

      try {
        contract.methods[method](...params)
          .estimateGas({ from: account, value: sendValue })
          .then(async (gasAmount: string) => {
            const sendGasAmount = new BigNumber(gasAmount)
              .times(1.2)
              .toFixed(0);
            const sendGasPrice = new BigNumber(gasPrice).times(1.2).toFixed();
            contract.methods[method](...params)
              .send({
                from: account,
                value: sendValue,
                gasPrice: web3.utils.toWei(sendGasPrice, 'gwei'),
                gas: sendGasAmount,
              })
              .on('transactionHash', (txHash: string) => {
                setTransactionSubmitted({ uuid, txHash });
              })
              .on(
                'receipt',
                ({ transactionHash }: { transactionHash: string }) => {
                  setTransactionConfirmed({
                    uuid,
                    txHash: transactionHash,
                  });
                  callback(null, transactionHash);
                },
              )
              .on('error', (error: TXError) => {
                // -3xxxx errors
                // 4xxx errors, ex: rejected by user
                handleError(error);
              })
              .catch((error: TXError) => {
                // -3xxxx errors
                // 4xxx errors, ex: rejected by user
                handleError(error);
              });
          })
          .catch((error: TXError) => {
            // Reached b/c: failed at the contract-method call level
            handleError(error);
          });
      } catch (error) {
        // Reached b/c:
        // - failed at the contract-method call level
        // - estimating gas failed
        handleError(error as TXError);
      }
    };
  }, [
    context,
    setTransactionPending,
    setTransactionSubmitted,
    setTransactionConfirmed,
    setTransactionRejected,
  ]);
};
