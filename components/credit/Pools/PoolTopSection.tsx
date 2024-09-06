import { Box, LinearProgress, Typography } from '@mui/material';
import CurrencyLogo from 'components/componentLibrary/Logo/CurrencyLogo';
import BigNumber from 'bignumber.js';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { LendingPair } from 'types/credit';
import HorizontalInfo from 'components/componentLibrary/Info/HorizontalInfo';
import ProgressBar from 'components/componentLibrary/Progress';
import { Type } from '.';

interface PoolsTopSectionProps {
  openModal: (arg: Type) => void;
  pair: LendingPair;
  isLoading: boolean;
}

export default function PoolsTopSection({
  openModal,
  pair: selectedPair,
  isLoading,
}: PoolsTopSectionProps) {
  const { asset, collateral, totalLiquidity } = selectedPair || {};

  const tvl = `$${new BigNumber(totalLiquidity || 0)?.toFixed(2)}`;

  return (
    <Box
      style={{
        background:
          'linear-gradient(94deg, #141C3A 14.71%, rgba(4, 16, 28, 0) 111.33%)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}
    >
      <Box display="flex" minWidth="50%">
        <Box>
          <CurrencyLogo size={263} token={collateral} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="2px"
            width="113px"
            whiteSpace="nowrap"
          >
            <Box display="flex" gap="8px">
              <Typography
                fontFamily="Inter"
                fontWeight="500"
                fontSize="18px"
                lineHeight="22px"
                display="flex"
                alignItems="center"
                color="#8D8D8D"
              >
                Collateral:
              </Typography>
              <Typography
                color="#F4F4F4"
                fontFamily="Inter"
                fontWeight="500"
                fontSize="18px"
                lineHeight="22px"
              >
                {collateral?.symbol}
              </Typography>
            </Box>
            <Typography
              fontWeight="600"
              fontSize="32px"
              lineHeight="39px"
              color="#F4F4F4"
              fontFamily="Inter"
            >
              Borrow {asset?.symbol}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="10px" width="452px">
            <HorizontalInfo
              type="medium"
              header={'Utilization Rate'}
              value={'32%'}
            />
            <ProgressBar value={32} />
            <HorizontalInfo type="medium" header={'TVL'} value={tvl} />
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        gap="4px"
        alignItems="end"
        paddingBottom="54px"
        paddingRight="100px"
      >
        <XCaliButton
          variant="blue"
          Component="Lend"
          showLoader={isLoading}
          disabled={isLoading || !selectedPair}
          size="s"
          onClickFn={() => openModal('Lend')}
        />
        <XCaliButton
          variant="yellow"
          Component="Borrow"
          showLoader={isLoading}
          disabled={isLoading || !selectedPair}
          size="s"
          onClickFn={() => openModal('Borrow')}
        />
        <XCaliButton
          variant="pink"
          Component="Provide Liquidity"
          showLoader={isLoading}
          disabled={isLoading || !selectedPair}
          size="s"
          onClickFn={() => openModal('Provide Liquidity')}
        />
      </Box>
    </Box>
  );
}
