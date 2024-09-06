import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type CardProps = {
  header?: string;
  children: ReactNode;
  padding?: string;
  style?: any;
};

export default function SubCard({
  header,
  children,
  padding,
  style,
}: CardProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={padding ?? '20px'}
      gap="12px"
      sx={{
        background: '#1D1E1F',
        borderRadius: '12px',
      }}
      style={style}
    >
      {header && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="8px"
        >
          <Typography fontSize={'16px'} fontWeight="800" color="white">
            {header}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
}
