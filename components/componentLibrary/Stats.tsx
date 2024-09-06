import { Box, styled } from '@mui/material';
import CreditMetric from 'components/credit/CreditMetric';

interface StatsRectangleProps {
  color0: string;
  color1: string;
  percentage0?: string;
  percentage1?: string;
}

const StatsRectangle = styled(Box)<StatsRectangleProps>`
  background: linear-gradient(
    90deg,
    ${({ color0 }) => color0}
      ${({ percentage0 }) => (percentage0 ? percentage0 : '0.85%')},
    ${({ color1 }) => color1}
      ${({ percentage1 }) => (percentage1 ? percentage1 : '99.15%')}
  );
  box-shadow: 0px 8px 50px ${({ color0 }) => color0};
  height: 4px;
  width: 200px;
`;

export default function Stats() {
  return (
    <Box display="flex">
      <Box
        style={{
          display: 'flex',
          margin: '0 2px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <StatsRectangle
          color0="#98FFFF"
          color1="#4BD2D2"
          percentage0="15.85%"
          percentage1="100.27%"
        />
        <CreditMetric
          title="Supply Balance"
          data="$43.56M"
          gradient="linear-gradient(90deg, #98FFFF 15.85%, #4BD2D2 47.01%), linear-gradient(90deg, #FFB904 5.74%, #FFE49D 100.27%), #D9D9D9"
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <StatsRectangle color0="#FFB904" color1="#FFE49D" />
        <CreditMetric
          title="Total Borrow"
          data="$43.56M"
          color="#CF9808"
          gradient="linear-gradient(90deg, #FFB904 5.74%, #FFE49D 100.27%), #D9D9D9"
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <StatsRectangle color0="#16E08B" color1="#82FFCB" />
        <CreditMetric
          title="Available for Borrow"
          data="$43.56M"
          color="#16E08B"
          gradient="linear-gradient(90deg, #16E08B 5.74%, #82FFCB 100.27%), #D9D9D9"
          opacity="0.5"
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          margin: '0 4px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <StatsRectangle color0="#FF73CC" color1="#F7CBE7" />
        <CreditMetric
          title="Supply Balance"
          data="$43.56M"
          color="#F7CBE7"
          gradient="linear-gradient(90deg, #FF73CC 5.74%, #F7CBE7 100.27%)"
          opacity="0.5"
        />
      </Box>
    </Box>
  );
}
