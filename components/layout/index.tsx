import { Box, styled } from '@mui/material';
import { Nav } from './navbar';
import TransactionModal from 'components/transactionQueue/TransactionModal';

export function Layout({ children }: { children: JSX.Element }) {
  return (
    <Box
      sx={{
        padding: '0',
        margin: '0',
      }}
    >
      <Nav />
      <Box paddingTop="79px" position="relative">
        {children}
      </Box>
      <TransactionModal />
    </Box>
  );
}
