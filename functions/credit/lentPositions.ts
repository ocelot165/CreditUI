import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { getLendingPairs } from 'services/graph/core/fetchers/credit';
import { LendingPair, LendingPool } from 'types/credit';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import CreditPair from './helpers/CreditPair';
import { assetSWRConfig } from 'constants/swr';
import {
  AllPositions,
  CreditPosition,
  useCreditPositions,
} from './creditPositions';
import { LendingPairQuery, LendingPoolQuery } from '@graph/core/types';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

export function formatLendingPoolContractData(
  pool: LendingPoolQuery,
  pair: LendingPairQuery,
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
    creditedPools: [],
    pair: {
      ...pair,
      fee: new BigNumber(pair.fee),
      protocolFee: new BigNumber(pair.protocolFee),
    },
  };
}

export default function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  pair: LendingPairQuery,
): LendingPair {
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );
  let formattedPools: LendingPool[] = [];
  if (positionsForPair.length > 0) {
    formattedPools = pair.pools.flatMap((pool) => {
      const positionsForPool = creditPositions.filter(
        (value) =>
          value.maturity === pool.maturity &&
          value.pair.toLowerCase() === pair.address.toLowerCase(),
      );
      const formattedData = formatLendingPoolContractData(pool, pair);
      if (positionsForPool.length > 0) {
        return {
          ...formattedData,
          creditedPools: positionsForPool.map((position) => ({
            bondInterestBalance: new BigNumber(
              position.bondInterest?.totalAmount ?? 0,
            ).div(10 ** 18),
            bondPrincipalBalance: new BigNumber(
              position.bondPrincipal?.totalAmount ?? 0,
            ).div(10 ** 18),
            insuranceInterestBalance: new BigNumber(
              position.insuranceInterest?.totalAmount ?? 0,
            ).div(10 ** 18),
            insurancePrincipalBalance: new BigNumber(
              position.insurancePrincipal?.totalAmount ?? 0,
            ).div(10 ** 18),
            position,
          })),
        };
      }
      return [];
    });
  }

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: formattedPools,
  };
}

async function getLentPositionsData(
  pairs: LendingPairQuery[],
  creditPositions: CreditPosition[],
): Promise<LendingPair[]> {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = pairs
    .map((pair) => {
      const pairContractData = formatLendingPairContractData(
        creditPositions,
        pair,
      );
      return pairContractData;
    })
    .filter((pair) => pair.pools.length > 0);

  return pairsContractData;
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLentPositions() {
  const { data: allPositions, isValidating: allPositionsLoading } =
    useCreditPositions();

  const { account, chainId } = useActiveWeb3React();

  const lentPositionsData = useSWR<LendingPair[]>(
    account && chainId && allPositions
      ? ['lent-positions', chainId, account, allPositions]
      : null,
    async () => {
      if (!account) return [];
      const pairs = await getLendingPairs(chainId);
      // @todo: improve performance on lent positions fetching
      const lentPositionsData = await getLentPositionsData(
        pairs,
        (allPositions as AllPositions).creditPositions,
      );
      return lentPositionsData;
    },
    assetSWRConfig,
  );

  return {
    ...lentPositionsData,
    isValidating: lentPositionsData.isValidating || allPositionsLoading,
    data: lentPositionsData.data ?? [],
  };
}
