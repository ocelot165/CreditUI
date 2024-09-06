import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import PoolDetailPage from './PoolDetailPage';
import CreditPositionCard from '../CreditPositionsModal';
import PoolTopSection from './PoolTopSection';
import { useRouter } from 'next/router';
import { useLendingPair } from 'functions/credit';
import { LendingPair } from 'types/credit';
import CreditActionCard from '../CreditActionCard';

export type Type = 'Lend' | 'Borrow' | 'Provide Liquidity';

export default function CreditPools() {
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<Type>('Lend');

  const router = useRouter();
  const { query, isReady } = router;

  const { asset, collateral } = useMemo(() => {
    return Array.isArray(query?.addresses)
      ? {
          asset: query?.addresses[0],
          collateral: query?.addresses[1],
        }
      : { asset: undefined, collateral: undefined };
  }, [query]);

  useEffect(() => {
    if (isReady) {
      if (!asset || !collateral) {
        if (router) {
          router.push('/credit');
        }
      }
    }
  }, [router, asset, collateral, isReady]);

  const lendingPair = useLendingPair(asset as string, collateral as string);

  useEffect(() => {
    if (asset && collateral && !lendingPair.isValidating) {
      if (!lendingPair.data) {
        if (router) {
          alert('This lending pair does not exist!');
          router.push('/credit');
        }
      }
    }
  }, [asset, collateral, lendingPair.data, lendingPair.isValidating, router]);

  const handleOpenModal = (card: Type) => {
    setType(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <CreditActionCard
        type={type}
        lendingPair={lendingPair.data as LendingPair}
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
      />
      <PoolTopSection
        pair={lendingPair.data as LendingPair}
        isLoading={lendingPair.isLoading}
        openModal={handleOpenModal}
      />
      <Box
        display="flex"
        flexDirection="row-reverse"
        justifyContent="center"
        paddingTop="16px"
        columnGap="24px"
        flexWrap="wrap"
        paddingX="12px"
      >
        <CreditPositionCard
          lendingPair={lendingPair.data}
          openModal={handleOpenModal}
          loading={lendingPair.isValidating}
        />
        <PoolDetailPage />
      </Box>
    </>
  );
}
