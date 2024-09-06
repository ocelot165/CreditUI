import { Box } from '@mui/material';
import { CreditPositionTab } from './CreditPositionTab';
import { useState } from 'react';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import {
  useBorrowPositionsFormatted,
  useLentPositionsFormatted,
  useLiquidityPositionsFormatted,
  useUserTotalPositions,
} from 'hooks/credit/useUserPositionsFormatted';
import LendPositionCard from './positionCards/LendPositionCard';
import LiquidityPositionCard from './positionCards/LiquidityPositionCard';
import { LendingPair } from 'types/credit';
import { Due, LendingPool } from 'types/credit';
import BorrowPositionCard from './positionCards/BorrowedPositionCard';
import { StyledInterTypography } from 'components/componentLibrary/Typography';
import Card from 'components/componentLibrary/Card';
import { Type } from '../Pools';

interface CreditPositionCardProps {
  openModal: (arg: Type) => void;
  lendingPair?: LendingPair;
  loading?: boolean;
}

export default function CreditPositionsModal({
  openModal,
  lendingPair,
  loading,
}: CreditPositionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: userLent } = useLentPositionsFormatted(
    lendingPair?.asset.address,
    lendingPair?.collateral.address,
  );
  const { data: userBorrowed } = useBorrowPositionsFormatted(
    lendingPair?.asset.address,
    lendingPair?.collateral.address,
  );
  const { data: userLP } = useLiquidityPositionsFormatted(
    lendingPair?.asset.address,
    lendingPair?.collateral.address,
  );

  const totalPositions = userLent.length + userBorrowed.length + userLP.length;

  return (
    <Card
      fontSize="m"
      header={`My Positions : ${totalPositions}`}
      width="448px"
      maxHeight="500px"
    >
      <CreditPositionTab
        labels={[
          `Lend (${userLent?.length || 0})`,
          `Borrow (${userBorrowed?.length || 0})`,
          `LP (${userLP?.length || 0})`,
        ]}
        selectedIndex={selectedIndex}
        setSelected={setSelectedIndex}
      />
      <Box
        height="400px"
        sx={{ overflowY: 'auto' }}
        display="flex"
        flexDirection="column"
        gap="24px"
      >
        {selectedIndex === 0 && userLent.length ? (
          userLent.map((position, index) => (
            <LendPositionCard
              index={index}
              position={{
                pair: position?.pair as LendingPair,
                pool: position?.pool as LendingPool,
                maturity: position?.pool.maturity as number,
              }}
              key={index}
            />
          ))
        ) : selectedIndex === 1 && userBorrowed.length ? (
          userBorrowed.map((position, index) => (
            <BorrowPositionCard
              index={index}
              position={{
                pair: position?.pair as LendingPair,
                pool: position?.pool as LendingPool,
                maturity: position?.pool.maturity as number,
                due: position?.due as Due,
              }}
              key={index}
            />
          ))
        ) : selectedIndex === 2 && userLP && userLP.length ? (
          userLP.map((position, index) => (
            <LiquidityPositionCard
              position={position}
              index={index}
              key={index}
            />
          ))
        ) : (
          <StyledInterTypography textAlign="center" margin="auto">
            No existing position yet
          </StyledInterTypography>
        )}
      </Box>
      {selectedIndex === 0 ? (
        <XCaliButton
          variant="blue"
          Component="+ Lend"
          type="filled"
          onClickFn={() => openModal('Lend')}
          disabled={!lendingPair || loading}
          showLoader={loading}
        />
      ) : selectedIndex === 1 ? (
        <XCaliButton
          variant="yellow"
          Component="+ Borrow"
          type="filled"
          onClickFn={() => openModal('Borrow')}
          disabled={!lendingPair || loading}
          showLoader={loading}
        />
      ) : (
        selectedIndex === 2 && (
          <XCaliButton
            variant="pink"
            Component="+ Provide Liquidity"
            type="filled"
            onClickFn={() => openModal('Provide Liquidity')}
            disabled={!lendingPair || loading}
            showLoader={loading}
          />
        )
      )}
    </Card>
  );
}
