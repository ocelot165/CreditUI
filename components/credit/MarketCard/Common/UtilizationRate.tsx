import { Box, LinearProgress, Typography } from '@mui/material';
import { StyledBox } from '.';

interface UtilizationRateProps {
  utilizationRate: string;
  tvl?: string;
}

export function UtilizationRate({
  utilizationRate,
  tvl = '$0.00',
}: UtilizationRateProps) {
  return (
    <StyledBox
      flexDirection="column"
      padding="8px 10px 16px"
      gap="6px"
      width="282px"
      style={{
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography
          color="#8A9FB3"
          fontFamily="Inter"
          fontWeight="400"
          fontSize="12px"
          lineHeight="150%"
        >
          Utilization Rate
        </Typography>
        <Typography
          color="#FFFFFF"
          fontFamily="Retron2000"
          fontWeight="400"
          fontSize="12px"
          lineHeight="16px"
        >
          {utilizationRate}
        </Typography>
      </Box>

      <Box>
        <Box sx={{ backgroundColor: '#1C2B39', borderRadius: '12px' }}>
          <LinearProgress
            sx={{
              ['& .MuiLinearProgress-bar1Determinate']: {
                backgroundColor: '#98FFFF',
                color: 'transparent',
              },
              backgroundColor: 'transparent',
              padding: '0.1rem',
              borderRadius: '0.2rem',
            }}
            variant="determinate"
            value={32}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography
          color="#8A9FB3"
          fontFamily="Inter"
          fontWeight="400"
          fontSize="12px"
          lineHeight="150%"
        >
          TVL
        </Typography>
        <Typography
          color="#FFFFFF"
          fontFamily="Retron2000"
          fontWeight="400"
          fontSize="12px"
          lineHeight="16px"
        >
          {tvl}
        </Typography>
      </Box>
    </StyledBox>
  );
}
