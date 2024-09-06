import React from 'react';
import { Box, Typography } from '@mui/material';
import { Transaction } from 'types/transactions';
import { txColors } from './TransactionQueue';
import { StyledInterTypography } from 'components/componentLibrary/Typography';

export default function TransactionItem({
  transaction,
  index,
  type,
  nextTx,
  isFailed,
}: {
  transaction: Transaction;
  index: number;
  type: 'lend' | 'borrow' | 'liquidity';
  nextTx: number;
  isFailed: boolean;
}) {
  const isCurrentTx = transaction.status != 'WAITING';
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          border: `thin ${
            isCurrentTx || isFailed ? 'transparent' : '#8D8D8D'
          } solid`,
          borderRadius: '100%',
          width: '24px',
          height: '24px',
          background: `${
            isFailed && nextTx === index
              ? txColors['error']
              : isCurrentTx || nextTx === index
              ? txColors[type]
              : 'transparent'
          }`,
        }}
        key={transaction.uuid}
      >
        <Typography color="white" textAlign="center">
          {index + 1}
        </Typography>
      </Box>
      <StyledInterTypography
        sx={{ fontWeight: 'bold' }}
        color={
          isFailed && nextTx === index
            ? txColors['error']
            : isCurrentTx || nextTx === index
            ? txColors[type]
            : '#8D8D8D'
        }
        textAlign="center"
      >
        {transaction.actionName}
      </StyledInterTypography>
    </Box>
  );
}
