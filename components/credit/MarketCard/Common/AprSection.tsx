import { StyledInterTypography } from 'components/componentLibrary/Typography';
import { StyledBox, StyledContainer, StyledData } from '.';

interface AprSectionProps {
  averageAPR: string;
  borrowAPR: string;
}

export function AprSection({ averageAPR, borrowAPR }: AprSectionProps) {
  return (
    <StyledBox width="282px" padding="8px 0">
      <StyledContainer width="141px">
        <StyledInterTypography color="#8A9FB3" fontSize="12px">
          Average APR
        </StyledInterTypography>
        <StyledData>{averageAPR}</StyledData>
      </StyledContainer>
      <StyledContainer width="141px">
        <StyledInterTypography color="#8A9FB3" fontSize="12px">
          Borrow APR
        </StyledInterTypography>
        <StyledData>{borrowAPR}</StyledData>
      </StyledContainer>
    </StyledBox>
  );
}
