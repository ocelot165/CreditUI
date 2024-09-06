import { useBorrowedPositions, useLentPositions } from 'functions/credit';
import { useMemo } from 'react';
import { LendingPair, LendingPool } from 'types/credit';
import { useLiquidityPositions } from 'functions/liquidity/liquidityPairs';

export const useLentPositionsFormatted = (
  asset?: string,
  collateral?: string,
) => {
  const swrObject = useLentPositions();
  const userLent = useMemo(() => {
    return (
      (swrObject.data as LendingPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: LendingPair) =>
          pair.pools.flatMap((pool: LendingPool, idx: number) =>
            pool.creditedPools?.flatMap((positionData, index: number) => ({
              id: pair.address + pool.maturity + idx + index,
              pair,
              pool: { ...pool, ...positionData, index: index },
            })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral]);

  return { ...swrObject, data: userLent };
};

export const useBorrowPositionsFormatted = (
  asset?: string,
  collateral?: string,
) => {
  const swrObject = useBorrowedPositions();
  const userBorrowed = useMemo(() => {
    return (
      (swrObject.data as LendingPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: LendingPair) =>
          pair.pools.flatMap((pool: LendingPool, index: number) =>
            pool.dues?.map((due, dueIndex: number) => ({
              id: pair.address + pool.maturity + index + dueIndex,
              pair,
              pool,
              due,
            })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral]);

  return { ...swrObject, data: userBorrowed };
};

export const useLiquidityPositionsFormatted = (
  asset?: string,
  collateral?: string,
) => {
  const swrObject = useLiquidityPositions();

  const userLP = useMemo(() => {
    return (
      (swrObject.data as LendingPair[])
        .filter(
          (pair) =>
            pair.asset.address.toLowerCase() === asset?.toLowerCase() &&
            pair.collateral.address.toLowerCase() === collateral?.toLowerCase(),
        )
        .flatMap((pair: LendingPair) =>
          pair.pools.flatMap((pool: LendingPool, index: number) =>
            pool.lps?.flatMap((lp, lpIndex: number) => ({
              id: pair.address + pool.maturity + index + lpIndex,
              pair,
              pool,
              lp,
            })),
          ),
        ) || []
    );
  }, [swrObject.data, asset, collateral]);

  return { ...swrObject, data: userLP };
};

export const useUserTotalPositions = (asset: string, collateral: string) => {
  const { data: borrowedPositions } = useBorrowPositionsFormatted(
    asset,
    collateral,
  );
  const { data: liqPositions } = useLiquidityPositionsFormatted(
    asset,
    collateral,
  );
  const { data: lentPositions } = useLentPositionsFormatted(asset, collateral);

  return borrowedPositions.length + liqPositions.length + lentPositions.length;
};
