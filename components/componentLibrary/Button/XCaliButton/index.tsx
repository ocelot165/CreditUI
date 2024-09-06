import { Box, Typography, useTheme } from '@mui/material';
import React, { memo } from 'react';
import {
  BUTTON_HEIGHTS,
  BUTTON_ORIENTATION,
  ButtonRipple,
  Container,
} from './ButtonContainer';
import { CustomRippleBg } from './CustomRippleBg';
import { Dots } from './LoadingDots';

type XCaliButtonProps = {
  type?: 'filled' | 'hugged';
  px?: number;
  py?: number;
  Component?: any;
  variant?: 'outline' | 'yellow' | 'neutral' | 'pink' | 'blue' | 'ghost';
  disabled?: boolean;
  color?: string;
  onClickFn?: any;
  width?: string;
  height?: string;
  size?: 'xs' | 'm' | 's' | 'icon';
  orientation?: 'left' | 'right' | 'center';
  StartIcon?: any;
  EndIcon?: any;
  columnGap?: string;
  textVariant?: any;
  showLoader?: boolean;
  rounded?: boolean;
  padding?: string;
  disconnectedText?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'none';
};

export const XCaliButton: React.FC<XCaliButtonProps> = memo(
  ({
    type = 'hugged',
    size = 'm',
    Component = '',
    StartIcon = null,
    EndIcon = null,
    variant = 'outline',
    disabled = false,
    showLoader = false,
    borderRadius = undefined,
    onClickFn = () => null,
    orientation = 'center',
    columnGap = '',
    textVariant = 'body-small-numeric',
    rounded = false,
    padding = '2px 24px 0px',
    disconnectedText = 'Wallet Disconnected',
    textTransform = 'uppercase',
    ...props
  }) => {
    const theme = useTheme();

    const ButtonContainer = Container(
      type,
      disabled,
      {},
      borderRadius,
      {},
      {},
      rounded,
      size,
    );

    const RippleContainer = CustomRippleBg(disabled, {}, {}, borderRadius);

    const Loading = Dots({});

    return (
      <ButtonContainer
        className="xCaliButton"
        height={BUTTON_HEIGHTS[size]}
        {...props}
        sx={{
          padding,
        }}
      >
        <RippleContainer
          onClick={onClickFn}
          {...props}
          width="100%"
          height="100%"
        >
          <ButtonRipple />
        </RippleContainer>
        <Box
          sx={{
            pointerEvents: 'unset',
            position: 'relative',
          }}
        >
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            height={BUTTON_HEIGHTS[size]}
            justifyContent={BUTTON_ORIENTATION[orientation]}
            columnGap={columnGap}
            textAlign={'center'}
            sx={{
              whiteSpace: 'nowrap',
            }}
            marginTop="-2px"
          >
            {!showLoader ? (
              <>
                {StartIcon}
                <Typography
                  paddingY="0"
                  variant={textVariant}
                  textTransform={textTransform}
                >
                  {Component}
                </Typography>
                {EndIcon}
              </>
            ) : (
              <Loading />
            )}
          </Box>
        </Box>
      </ButtonContainer>
    );
  },
);

XCaliButton.displayName = 'XCaliButton';
