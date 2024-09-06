import { Box, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BigNumber } from 'bignumber.js';
import { LendingPool } from 'types/credit';
import { formatToDays } from '@utils/index';

const StyledBox = styled(Box)({
  background: '#1D1E1F',
  boxShadow: '0px 4px 20px rgba(22, 22, 22, 0.3)',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  gap: '8px',
});

const StyledItem = styled(Typography)({
  display: 'flex',
  padding: '4px 8px',
  gap: '8px',
  alignItems: 'center',

  background: '#2B2D2F',
  borderRadius: '8px',

  fontFamily: 'Retron2000',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '11px',
  lineHeight: '15px',
  color: '#F2F2F2',
});

interface CardTopSectionProps {
  pools?: number;
  maturity: number[];
}

export default function CardTopSection({
  pools,
  maturity,
}: CardTopSectionProps) {
  return (
    <StyledBox>
      <StyledItem>{`${pools} ${pools ? `POOLS` : `POOL`}`}</StyledItem>
      <StyledItem>
        <AccessTimeIcon fontSize="inherit" />
        {`${formatToDays(maturity)}`}
      </StyledItem>
    </StyledBox>
  );
}
