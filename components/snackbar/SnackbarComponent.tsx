import React, { useMemo } from 'react';
import { Snackbar as Snack, Typography, Box } from '@mui/material';
import { Close, Done, Info, WarningAmber } from '@mui/icons-material';
import { useThemeContext } from 'theme/themeContext';

export type SnackBarProps = {
  type?: 'Error' | 'Info' | 'Success';
  message?: string;
  heading?: string;
  ExtraComp?: (props: any) => JSX.Element;
  clearSnackBar: () => void;
};

const SnackbarComponent = ({
  type,
  message,
  heading,
  ExtraComp,
  clearSnackBar,
}: SnackBarProps) => {
  type = type || 'Error';
  const { theme } = useThemeContext();

  const colors = useMemo(
    () => ({
      Error: theme.palette.alert['500'],
      Info: theme.palette.primary['20'],
      Success: theme.palette.success['50'],
    }),
    [theme],
  );

  const boxShadows = useMemo(
    () => ({
      Error: `0px 4px 12px ${theme.palette.alert['500']}`,
      Info: `0px 4px 12px ${theme.palette.primary['20']}`,
      Success: `0px 4px 12px ${theme.palette.success['50']}`,
    }),
    [theme],
  );

  const handleClose = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    clearSnackBar();
  };

  return (
    <Snack
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={Boolean(open)}
      sx={{ border: `1px ${colors[type]} solid` }}
      onClose={handleClose}
    >
      <Box
        sx={{
          background: theme.palette.gradients.glass,
          backdropFilter: 'blur(16px)',
          width: '400px',
          '@media only screen and (max-width:599px)': {
            width: '100%',
          },
          backgroundColor: 'none',
        }}
        padding="18px"
        borderRadius="0"
        maxWidth="100%"
        maxHeight="90vh"
        display="flex"
        boxShadow={boxShadows[type]}
        justifyContent="space-between"
        overflow="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          rowGap="10px"
          position="relative"
          width="100%"
          top="0"
        >
          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography
              variant="body-xs-medium"
              color={colors[type]}
              display="flex"
              alignItems="end"
              columnGap="5px"
              top="0"
              right="0"
              position="sticky"
            >
              <>
                {type === 'Error' ? (
                  <WarningAmber sx={{ width: '18px' }} />
                ) : type === 'Info' ? (
                  <Info sx={{ width: '18px' }} />
                ) : (
                  <Done sx={{ width: '18px' }} />
                )}
              </>
              {heading}
            </Typography>

            <Close
              onClick={() => handleClose(new Event(''), '')}
              sx={{ color: theme.palette.primary['20'], cursor: 'pointer' }}
            />
          </Box>
          <Box
            sx={{ overflowX: 'auto' }}
            width="100%"
            height="100%"
            position="relative"
          >
            <Typography variant="body-xs-regular" color="white">
              {message}
            </Typography>
          </Box>
          <Box width="100%" position="relative">
            {ExtraComp && <ExtraComp />}
          </Box>
        </Box>
      </Box>
    </Snack>
  );
};

export default SnackbarComponent;
