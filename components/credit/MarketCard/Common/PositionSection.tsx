import { Box, Typography } from '@mui/material';
import { StyledBox } from '.';

interface PositionSectionProps {
  cdp: string;
  maturity: string;
}

export function PositionSection({ cdp, maturity }: PositionSectionProps) {
  return (
    <Box display="flex" alignItems="center" width="282px">
      <StyledBox width="141px" height="42px">
        <Box padding="0px 16px">
          <Typography
            color="#8A9FB3"
            fontFamily="Inter"
            fontWeight="400"
            fontSize="12px"
            lineHeight="150%"
          >
            CDP
          </Typography>
          <Typography
            color="#98FFFF"
            fontFamily="Retron2000"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
          >
            {cdp}
          </Typography>
        </Box>
      </StyledBox>
      <StyledBox width="141px" height="42px">
        <Box padding="0px 16px">
          <Typography
            color="#8A9FB3"
            fontFamily="Inter"
            fontWeight="400"
            fontSize="12px"
            lineHeight="150%"
          >
            Maturity Date
          </Typography>
          <Typography
            color="#FFFFFF"
            fontFamily="Retron2000"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
          >
            {maturity}
          </Typography>
        </Box>
      </StyledBox>
    </Box>
  );
}
