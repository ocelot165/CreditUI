import useSWR, { SWRResponse } from 'swr';
import { getLendingPairs } from 'services/graph/core/fetchers/credit';
import { Due, LendingPair, LendingPool } from 'types/credit';
import { calcMaturationPercentage, isPoolMatured } from './utils';
import CreditPair from './helpers/CreditPair';
import { assetSWRConfig } from 'constants/swr';
import { useMultiCall } from 'hooks/useMulticall';
import { CDTQuery, LendingPairQuery } from '@graph/core/types';
import Multicall from '@/lib/multicall';
import Web3 from 'web3';
import { getCDContract } from 'constants/contracts';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { CreditPosition, useCreditPositions } from './creditPositions';
import collateralizedDebtABI from 'constants/contracts/ABIs/collateralizedDebt.json';
import { AbiItem } from 'web3-utils';
import BigNumber from 'bignumber.js';

type DueData = {
  '0': string;
  '1': string;
  '2': number;
};

export function formatLendingPoolContractDataForBorrows(
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

async function formatLendingPairContractData(
  creditPositions: CreditPosition[],
  pair: LendingPairQuery,
  web3: Web3,
  multicall: Multicall | undefined,
): Promise<LendingPair> {
  const positionsForPair = creditPositions.filter(
    (value) => value.pair.toLowerCase() === pair.address.toLowerCase(),
  );

  const debtCalls: any[] = [];
  const positions: any[] = [];

  const formattedPools = pair.pools.map((pool, index) => {
    positions.push(
      positionsForPair.filter(
        (position) => pool.maturity === position.maturity,
      ),
    );
    const formattedPool = formatLendingPoolContractDataForBorrows(pool, pair);
    positions[index].forEach((position: any) => {
      debtCalls.push(
        new web3.eth.Contract(
          collateralizedDebtABI as AbiItem[],
          position.CDT.assetContract,
        ).methods.dueOf(position.CDT.tokenId),
      );
    });
    return formattedPool;
  });

  const debtData = await multicall?.aggregate(debtCalls);

  const finalPairs = formattedPools.map((pool, index) => {
    const dues: any[] = [];
    positions[index].forEach((position: any) => {
      const debtStruct = debtData.shift();
      if (new BigNumber(debtStruct.debt).gt(0)) {
        dues.push({
          debt: new BigNumber(debtStruct.debt).div(10 ** 18),
          collateral: new BigNumber(debtStruct.collateral).div(10 ** 18),
          positionId: position.CDT.tokenId,
          position,
        });
      }
    });
    return { ...pool, dues };
  });

  return {
    ...pair,
    fee: new BigNumber(pair.fee),
    protocolFee: new BigNumber(pair.protocolFee),
    pools: finalPairs,
  };
}

async function getBorrowedPositionsData(
  pairs: LendingPairQuery[],
  creditPositions: CreditPosition[],
  web3: Web3,
  multicall: Multicall | undefined,
): Promise<LendingPair[]> {
  if (!pairs?.length) return [];

  // destruct multicall result into pairs
  const pairsContractData = pairs.map(async (pair) => {
    const pairContractData = await formatLendingPairContractData(
      creditPositions,
      pair,
      web3,
      multicall,
    );
    return pairContractData;
  });

  const finalPairs = await Promise.all(pairsContractData);
  return finalPairs.filter((pair) => pair.pools.length > 0);
}

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////

export function useBorrowedPositions() {
  const multicall = useMultiCall();
  const { data: allPositions, isValidating: allPositionsLoading } =
    useCreditPositions();

  const { account, chainId, web3 } = useActiveWeb3React();
  const borrowPositionsData = useSWR(
    account && chainId && multicall && web3
      ? ['borrowed-positions', chainId, account, allPositions]
      : null,
    async () => {
      if (!account || !allPositions) return [];
      const pairs = await getLendingPairs(chainId);
      return getBorrowedPositionsData(
        pairs,
        allPositions.debtPositions,
        web3,
        multicall,
      );
    },
    assetSWRConfig,
  );

  return {
    ...borrowPositionsData,
    isValidating: borrowPositionsData.isValidating || allPositionsLoading,
    data: borrowPositionsData.data ?? [],
  };
}
