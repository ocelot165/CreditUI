import React from 'react';
import { useLendingPairsInfo } from 'functions/credit';
import CreditMarketCard from './MarketCard';
import { Box } from '@mui/material';
import { LendingPair } from 'types/credit';
import { useRouter } from 'next/router';

export default function CreditMarketPage() {
  const lendingPairsInfo = useLendingPairsInfo();

  const router = useRouter();

  const handleCardClick = (lendingPair: LendingPair) => {
    const assetAddress = lendingPair?.asset?.address;
    const collateralAddress = lendingPair?.collateral?.address;

    router.push(`/credit/pools/${assetAddress}/${collateralAddress}`);
  };

  return (
    <>
      {lendingPairsInfo.data?.map((lendingPair, index) => (
        <Box
          key={index}
          style={{ textDecoration: 'none', cursor: 'pointer' }}
          onClick={() => handleCardClick(lendingPair)}
        >
          <CreditMarketCard pair={lendingPair} />
        </Box>
      ))}
    </>
  );
}
