import BigNumber from 'bignumber.js';
import useSWR from 'swr';
import { assetSWRConfig } from 'constants/swr';
import { CreditPair } from 'functions/credit';
import {
  CreditPosition,
  useCreditPositions,
} from 'functions/credit/creditPositions';
import { useMultiCall } from 'hooks/useMulticall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { LendingPairQuery } from '@graph/core/types';
import { LendingPair, LendingPool, Lp } from 'types/credit';
import {
  calcMaturationPercentage,
  isPoolMatured,
} from 'functions/credit/utils';
import { getLendingPairs } from '@graph/core/fetchers/credit';

function formatLendingPoolContractDataForLiq(
  pool: any, // Update the type of 'pool' to the actual type
  pair: any, // Update the type of 'pair' to the actual type
): LendingPool {
  const X = new BigNumber(pool.X);
  const Y = new BigNumber(pool.Y);
  const Z = new BigNumber(pool.Z);
  const maxAPR = CreditPair.calculateApr(X, Y).times(100);
  const minCDP = CreditPair.calculateCdp(
    X,
    Z,
    pair.asset.decimals,
    pair.collateral.decimals,
  );

  return {
    X,
    Y,
    Z,
    maxAPR,
    minCDP,
    maturationPercentage: calcMaturationPercentage(
      pool.timestamp,
      pool.maturity,
    ),
    matured: isPoolMatured(pool.maturity),
    maturity: pool.maturity,
    bondInterestAddress: pool.bondInterestAddress,
    bondPrincipalAddress: pool.bondPrincipalAddress,
    insuranceInterestAddress: pool.insuranceInterestAddress,
    insurancePrincipalAddress: pool.insurancePrincipalAddress,
    liquidityAddress: pool.liquidityAddress,
    collateralizedDebtAddress: pool.collateralizedDebtAddress,
    dues: [],
    pair,
  };
}

function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  pair: LendingPairQuery,
): LendingPair {
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );
  const positions: any[] = [];

  pair.pools.forEach((pool) => {
    positions.push(
      positionsForPair.filter(
        (position) => pool.maturity === position.maturity,
      ),
    );
  });

  const finalPairs = pair.pools.map((pool, index) => {
    const poolInfo = formatLendingPoolContractDataForLiq(pool, pair);
    const poolPositions = positionsForPair.filter(
      (value) =>
        value.pair.toLowerCase() === pair.address.toLowerCase() &&
        value.maturity === pool.maturity,
    );
    const lps: Lp[] = poolPositions.map((position) => {
      const balance = new BigNumber(position.liquidityToken?.totalAmount ?? 0);
      const positionId = Number(position.positionIndex);
      return { balance, positionId, position };
    });
    return { ...poolInfo, lps };
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: finalPairs,
  };
}

function getLiquidityPositionsData(
  pairs: LendingPairQuery[],
  creditPositions: CreditPosition[],
): LendingPair[] {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = pairs.map((pair) => {
    const pairContractData = formatLendingPairContractData(
      creditPositions,
      pair,
    );
    return pairContractData;
  });

  return pairsContractData.filter((pair) => pair.pools.length > 0);
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////

export function useLiquidityPositions() {
  const multicall = useMultiCall();
  const { data: allPositions, isValidating: allPositionsLoading } =
    useCreditPositions();

  const { account, chainId, web3 } = useActiveWeb3React();
  const liqPositionsData = useSWR(
    account && chainId && multicall && web3
      ? ['liq-positions-data', chainId, account, allPositions]
      : null,
    async () => {
      if (!account || !allPositions) return [];
      const pairs = await getLendingPairs(chainId);
      return getLiquidityPositionsData(pairs, allPositions.liquidityPositions);
    },
    assetSWRConfig,
  );

  return {
    ...liqPositionsData,
    isValidating: liqPositionsData.isValidating || allPositionsLoading,
    data: liqPositionsData.data ?? [],
  };
}
