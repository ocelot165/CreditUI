import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { getLendingPairs } from 'services/graph/core/fetchers/credit';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import { LendingPair, LendingPool } from 'types/credit';
import CreditPair from './helpers/CreditPair';
import { LendingPairQuery, LendingPoolQuery } from '@graph/core/types';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { useMemo } from 'react';
import { getCreditPairContract } from 'constants/contracts';
import Web3 from 'web3';
import { multicallSplitOnOverflow } from '@/lib/multicall/helpers';
import Multicall from '@/lib/multicall';
import { useMultiCall } from 'hooks/useMulticall';

function formatLendingPool(
  pool: LendingPoolQuery,
  pair: LendingPairQuery,
  totalSupply: string,
  feeStored: string,
): LendingPool & {
  maxAPR: BigNumber;
  minCDP: BigNumber;
  assetReserve: BigNumber;
} {
  const { asset, collateral } = pair;
  const X = new BigNumber(pool.X);
  const Y = new BigNumber(pool.Y);
  const Z = new BigNumber(pool.Z);
  const assetReserve = new BigNumber(pool.assetReserve).div(
    10 ** asset.decimals,
  );
  const collateralReserve = new BigNumber(pool.collateralReserve).div(
    10 ** collateral.decimals,
  );
  const maxAPR = CreditPair.calculateApr(X, Y).times(100);
  const minCDP = CreditPair.calculateCdp(
    X,
    Z,
    asset.decimals,
    collateral.decimals,
  );

  return {
    ...pool,
    X,
    Y,
    Z,
    maturationPercentage: calcMaturationPercentage(
      pool.timestamp,
      pool.maturity,
    ),
    matured: isPoolMatured(pool.maturity),
    assetReserve,
    collateralReserve,
    minCDP,
    maxAPR,
    collateralFactor: assetReserve.div(collateralReserve),
    pair: {
      ...pair,
      fee: new BigNumber(pair.fee),
      protocolFee: new BigNumber(pair.protocolFee),
    },
    totalSupply: new BigNumber(totalSupply),
    feeStored: new BigNumber(feeStored),
  };
}

async function formatLendingPair(
  pair: LendingPairQuery,
  web3: Web3,
  multicall: Multicall,
): Promise<LendingPair> {
  let totalLiquidity = new BigNumber(0),
    bestAPR = new BigNumber(0);

  const calls = pair.pools.flatMap((pool) => {
    const creditPair = getCreditPairContract(web3, pair.address);
    return [
      creditPair.methods.totalLiquidity(pool.maturity),
      creditPair.methods.feeStored(pool.maturity),
    ];
  });

  const multicallResults = await multicallSplitOnOverflow(calls, multicall);

  let index = 0;

  const formattedPools: LendingPool[] = pair.pools.map((pool) => {
    const [totalSupply, feeStored] = multicallResults.slice(index, index + 2);
    index += 2;
    const lendingPoolContractData = formatLendingPool(
      pool,
      pair,
      totalSupply,
      feeStored,
    );
    bestAPR = BigNumber.max(bestAPR, lendingPoolContractData.maxAPR);
    totalLiquidity = totalLiquidity.plus(lendingPoolContractData.assetReserve);
    return lendingPoolContractData;
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    bestAPR,
    totalLiquidity,
    pools: formattedPools,
  };
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLendingPairsInfo(): SWRResponse<LendingPair[]> {
  const { chainId, web3 } = useActiveWeb3React();

  const multicall = useMultiCall();

  return useSWR(
    chainId && web3 && multicall ? ['lending-pairs', chainId] : null,
    async () => {
      // @TODO: hide pairs expired for longer than 2 weeks (TBD)
      const pairs = await getLendingPairs(chainId, { active: true });
      return await Promise.all(
        pairs.map(
          async (pair) =>
            await formatLendingPair(pair, web3, multicall as Multicall),
        ),
      );
    },
  );
}

export function useLendingPair(asset: string, collateral: string) {
  const lendingPairs = useLendingPairsInfo();

  const data = useMemo(() => {
    return lendingPairs.data?.find((val) => {
      return (
        val.asset.address.toLowerCase() === asset.toLowerCase() &&
        val.collateral.address.toLowerCase() === collateral.toLowerCase()
      );
    });
  }, [lendingPairs, asset, collateral]);

  return { ...lendingPairs, data };
}
