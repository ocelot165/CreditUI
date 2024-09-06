import { Box, Input, Typography } from '@mui/material';
import React from 'react';
import { XCaliButton } from './Button/XCaliButton';
import { StyledInterTypography } from './Typography';
import { Token } from 'types/assets';

interface InputProps {
  title?: string;
  value: string | undefined;
  setValue: any;
  token?: Token;
  hideBalances?: boolean;
}

export default function XCaliInput({
  title,
  value,
  setValue,
  token,
  hideBalances = false,
}: InputProps) {
  const onChangeHandler = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: '#F4F4F4',
        gap: '8px',
        width: '100%',
      }}
    >
      {title && (
        <Box display="flex" alignItems="start">
          <StyledInterTypography
            color="#8D8D8D"
            fontSize="12px"
            fontWeight="400"
          >
            {title}
          </StyledInterTypography>
        </Box>
      )}
      <Box
        style={{
          background: '#1D1E1F',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '8px',
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <StyledInterTypography>{token?.symbol}</StyledInterTypography>
          <Input
            disableUnderline
            placeholder="0.0"
            sx={{
              fontFamily: 'Retron2000',
              color: '#8D8D8D',
            }}
            value={value}
            onChange={onChangeHandler}
            inputProps={{
              style: {
                textAlign: 'right',
                color: '#f2f2f2',
              },
            }}
          />
        </Box>
        {!hideBalances && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display="flex" alignItems="center" gap="8px">
              <Typography fontFamily="Inter" fontSize="12px" color="#F2F2F2">
                Balance: {token?.balance ?? '0.00'}
              </Typography>
              <XCaliButton
                variant="ghost"
                color="primary"
                Component="Max"
                padding="0"
                size="xs"
                borderRadius="0"
              />
            </Box>
            <Typography
              fontFamily="Retron2000"
              fontSize="12px"
              lineHeight="15px"
              color="#8D8D8D"
            >
              $0.00
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
