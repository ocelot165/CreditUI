import { Box, Skeleton } from '@mui/material';
import CreditMetric from '../CreditMetric';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import InfoCard from 'components/componentLibrary/Card/InfoCard';
import SubCard from 'components/componentLibrary/Card/SubCard';

export default function PoolDetailPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ flex: '1' }}
      minWidth="350px"
      maxWidth="720px"
      gap="24px"
      paddingBottom="12px"
    >
      <Box
        display="flex"
        gap="12px"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <SubCard
          padding="16px 16px 16px 16px"
          style={{ maxWidth: '20%', flex: '1' }}
        >
          <CreditMetric title="Average APR" data="14.03%" color="#8D8D8D" />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{ maxWidth: '20%', flex: '1' }}
        >
          <CreditMetric title="Average APR" data="14.03%" color="#8D8D8D" />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{ maxWidth: '20%', flex: '1' }}
        >
          <CreditMetric title="Average APR" data="14.03%" color="#8D8D8D" />
        </SubCard>
        <SubCard
          padding="16px 16px 16px 16px"
          style={{ maxWidth: '20%', flex: '1' }}
        >
          <CreditMetric title="Loan Term" data="30D/60D" color="#8D8D8D" />
        </SubCard>
      </Box>
      <SubCard
        style={{ height: '100px', display: 'flex', flexDirection: 'column' }}
        header="Interest Rate Model"
      >
        <Skeleton width="100%" height="100%" sx={{ flex: '5' }} />
      </SubCard>
      <SubCard
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <StyledInterTypography color="#F4F4F4" fontSize="16px">
          Pool Reserve
        </StyledInterTypography>
        <Box display="flex" gap="12px">
          <InfoCard>
            <StyledInterTypography>XCAL</StyledInterTypography>
            <StyledInterTypography>1,298.54 XCAL</StyledInterTypography>
          </InfoCard>
          <InfoCard>
            <StyledInterTypography>XCAL</StyledInterTypography>
            <StyledInterTypography>1,298.54 XCAL</StyledInterTypography>
          </InfoCard>
        </Box>
      </SubCard>
    </Box>
  );
}
