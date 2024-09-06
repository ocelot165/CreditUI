import { Box } from '@mui/material';
import { useState } from 'react';
import Hero from 'components/componentLibrary/Hero';
import TermFilter from './TermFilter';
import CreditMarketPage from './CreditMarketPage';

export default function CreditMain() {
  const [value, setValue] = useState('All');

  return (
    <Box>
      <Hero />
      <Box
        style={{
          display: 'flex',
          gap: '191px',
          padding: '0 80px',
          marginBottom: '24px',
        }}
      >
        <TermFilter value={value} setValue={setValue} />
      </Box>
      <Box
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '24px',
          padding: '0 80px',
        }}
      >
        <CreditMarketPage />
      </Box>
    </Box>
  );
}
