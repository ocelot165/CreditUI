import { Box, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import CurrencyLogo from 'components/componentLibrary/Logo/CurrencyLogo';
import { Token } from 'types/credit';

interface CardNameSectionProps {
  asset: Token;
  collateral: Token;
}

export default function CardNameSection({
  asset,
  collateral,
}: CardNameSectionProps) {
  return (
    <Box style={{ background: '#161616', padding: '12px' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        style={{ background: '#1D1E1F', borderRadius: '12px', padding: '4px' }}
      >
        <Box>
          <CurrencyLogo size={56} token={collateral} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="2px"
          width="113px"
          height="41px"
          whiteSpace="nowrap"
        >
          <Typography
            fontWeight="500"
            fontSize="18px"
            lineHeight="22px"
            color="#F4F4F4"
            fontFamily="Inter"
          >
            Borrow {asset?.symbol}
            <Typography
              fontWeight="500"
              fontSize="14px"
              lineHeight="17px"
              display="flex"
              alignItems="center"
              color="#8A9FB3"
              gap="8px"
              fontFamily="Inter"
            >
              Collateral:
              <Typography
                fontFamily="Inter"
                fontSize="14px"
                lineHeight="17px"
                color="#FFFFFF"
              >
                {collateral?.symbol}
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
