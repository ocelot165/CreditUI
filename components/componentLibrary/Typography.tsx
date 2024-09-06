import { Typography, styled } from '@mui/material';

export const StyledInterTypography = styled(Typography)<{
  color?: string;
  fontSize?: string;
  fontWeight?: string;
}>`
  font-family: 'Inter', 'sans-serif';
  font-weight: ${({ fontWeight }) => fontWeight || '500'};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  line-height: 150%;
  color: ${({ color }) => color || '#F4F4F4'};
`;
