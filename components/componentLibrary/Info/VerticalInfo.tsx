import { Box, Typography } from '@mui/material';
import { StyledInterTypography } from '../Typography';
import { ReactNode } from 'react';

type VerticalInfoProps = {
  header: ReactNode;
  value: ReactNode;
  gap?: number;
};

export default function VerticalInfo({
  header,
  value,
  gap = 12,
}: VerticalInfoProps) {
  return (
    <Box display="flex" flexDirection="column" gap={gap}>
      <StyledInterTypography color="#8D8D8D" fontWeight="400" fontSize="14px">
        {header}
      </StyledInterTypography>
      <Typography
        fontFamily="Retron2000"
        color="#F2F2F2"
        fontWeight="600"
        fontSize="14px"
      >
        {value}
      </Typography>
    </Box>
  );
}
