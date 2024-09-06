import { Box, Typography } from '@mui/material';
import Stats from './Stats';

export default function Hero() {
  return (
    <Box
      sx={{
        padding: '100px 120px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="heading-m-ultrabold" color="#F2F2F2">
          FIXED ISOLATED
        </Typography>
        <Typography variant="heading-m-ultrabold" color="#F2F2F2">
          LENDING & BORROWING
        </Typography>
      </Box>
      <Stats />
    </Box>
  );
}
