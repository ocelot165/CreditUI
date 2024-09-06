import { Box, LinearProgress } from '@mui/material';

type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <Box sx={{ backgroundColor: '#1C2B39', borderRadius: '3px' }}>
      <LinearProgress
        sx={{
          ['& .MuiLinearProgress-bar1Determinate']: {
            backgroundColor: '#98FFFF',
            color: 'transparent',
            boxShadow: '1px 1px 15px rgba(152, 255, 255, 0.4)',
          },
          backgroundColor: 'transparent',
          padding: '0.1rem',
          borderRadius: '3px',
          height: '12px',
        }}
        variant="determinate"
        value={value}
      />
    </Box>
  );
}
