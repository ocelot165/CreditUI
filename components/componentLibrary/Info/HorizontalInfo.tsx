import { Box, Typography } from '@mui/material';
import { StyledInterTypography } from '../Typography';
import { ReactNode } from 'react';

type HorizontalInfoProps = {
  header: ReactNode;
  value: ReactNode;
  type?: 'small' | 'medium';
};

const headerProps = {
  small: {
    color: '#8D8D8D',
    fontWeight: '400',
    fontSize: '14px',
  },
  medium: {
    color: '#8D8D8D',
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '19px',
  },
};

const valueProps = {
  small: {
    fontFamily: 'Retron2000',
    color: '#F2F2F2',
    fontWeight: '600',
    fontSize: '14px',
  },
  medium: {
    color: '#F2F2F2',
    fontFamily: 'Retron2000',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '21px',
  },
};

export default function HorizontalInfo({
  header,
  value,
  type = 'small',
}: HorizontalInfoProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      width="100%"
    >
      <StyledInterTypography style={headerProps[type]}>
        {header}
      </StyledInterTypography>
      <Typography style={valueProps[type]}>{value}</Typography>
    </Box>
  );
}
