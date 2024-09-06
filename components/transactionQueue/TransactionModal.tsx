import Card from 'components/componentLibrary/Card';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { useMemo } from 'react';
import { useCurrentTransactions } from 'hooks/useCurrentTransactions';
import { TransactionQueue } from './TransactionQueue';
import { Box, Dialog } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export default function TransactionModal() {
  const {
    closeQueue,
    transactionInfo: {
      open,
      transactions,
      transactionComponent,
      purpose,
      txType,
    },
  } = useCurrentTransactions();

  const [isWaiting, nextPendingTransactionIndex, isFailed] = useMemo(() => {
    for (let index = 0; index < transactions.length; index++) {
      const tx = transactions[index];
      if (
        tx.status === 'WAITING' ||
        tx.status === 'PENDING' ||
        tx.status === 'SUBMITTED' ||
        tx.status === 'REJECTED'
      ) {
        return [tx.status === 'WAITING', index, tx.status === 'REJECTED'];
      }
    }
    return [true, 0, false];
  }, [transactions]);

  const currentTx = transactions[nextPendingTransactionIndex] ?? undefined;

  const currentLoadingState = !isWaiting && !isFailed;

  const isTxConfirmed =
    transactions[transactions.length - 1]?.status === 'CONFIRMED';

  return (
    <Dialog open={open}>
      <Card
        fontSize="l"
        header={isTxConfirmed ? 'Completed' : purpose}
        onClose={closeQueue}
        width="448px"
      >
        {isTxConfirmed ? (
          <CheckCircle
            sx={{ color: 'white', margin: 'auto', fontSize: '100px' }}
          />
        ) : (
          <>
            <TransactionQueue
              nextTx={nextPendingTransactionIndex}
              type={txType}
              isFailed={isFailed}
            />{' '}
            {transactionComponent}
          </>
        )}
        {isTxConfirmed ? (
          <Box>
            <XCaliButton
              Component={'Go to vault'}
              onClickFn={() => alert('go to vault')}
              type="filled"
              variant="neutral"
              style={{ marginBottom: '12px' }}
            />
            <XCaliButton
              Component={'view on explorer'}
              onClickFn={() => console.log('go to vault')}
              type="filled"
              variant="outline"
            />
          </Box>
        ) : (
          <XCaliButton
            Component={isFailed ? 'Transaction failed' : currentTx?.actionName}
            showLoader={currentLoadingState}
            disabled={isFailed || currentLoadingState}
            onClickFn={currentTx?.action}
            type="filled"
            variant="neutral"
          />
        )}
      </Card>
    </Dialog>
  );
}
