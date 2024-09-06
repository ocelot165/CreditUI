import { Box, styled } from '@mui/material';

const InfoCard = styled(Box)`
  border: 1px solid #2b2d2f;
  border-radius: 12px;
  width: calc(100% - 32px);
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
`;

export default InfoCard;
