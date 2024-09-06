import useSWR, { SWRResponse } from 'swr';
import BigNumber from 'bignumber.js';
import { assetSWRConfig } from 'constants/swr';
import { getLendingPair } from 'services/graph/core/fetchers/credit';
import { getCDContract, getCreditPairContract } from 'constants/contracts';
import { useMultiCall } from 'hooks/useMulticall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';
import { LendingPair, LendingPool } from 'types/credit';
import { useMemo } from 'react';

type DueInfo = {
  debt: BigNumber;
  collateral: BigNumber;
  positionId: string;
};

type LendingPoolInfo = {
  X: BigNumber;
  Y: BigNumber;
  Z: BigNumber;
  assetReserve: BigNumber;
  collateralReserve: BigNumber;
  fee: BigNumber;
  protocolFee: BigNumber;
  maturity: number;
};

/////////////////////////////////////// HOOKS /////////////////////////////////////////////////////
export function useLendingPoolInfo(
  pairAddress: string,
  maturity: number,
): SWRResponse<LendingPoolInfo> {
  const { chainId, web3 } = useActiveWeb3React();
  const multicall = useMultiCall();

  return useSWR(
    chainId && multicall && web3
      ? ['lending-pool', pairAddress, maturity]
      : null,
    async () => {
      if (!multicall) throw new Error('Multicall does not exist');
      const pairContract = getCreditPairContract(web3, pairAddress);
      const [contractInfo, pair] = await Promise.all([
        multicall.aggregate([
          pairContract.methods.constantProduct(maturity),
          pairContract.methods.totalReserves(maturity),
          pairContract.methods.fee(),
          pairContract.methods.protocolFee(),
        ]),
        getLendingPair(pairAddress, { chainId, withPools: false }),
      ]);

      const [CP, totalReserves, rawFee, rawProtocolFee] = contractInfo;
      return {
        X: new BigNumber(CP[0]),
        Y: new BigNumber(CP[1]),
        Z: new BigNumber(CP[2]),
        assetReserve: new BigNumber(totalReserves[0]).div(
          Math.pow(10, pair.asset.decimals),
        ),
        collateralReserve: new BigNumber(totalReserves[1]).div(
          Math.pow(10, pair.collateral.decimals),
        ),
        fee: new BigNumber(rawFee),
        protocolFee: new BigNumber(rawProtocolFee),
        maturity,
      };
    },
    assetSWRConfig,
  );
}

export function useLendingPoolsByMaturity(pair: LendingPair) {
  return useMemo(() => {
    let poolsByMaturity: { [maturity: number]: LendingPool } = {};
    pair?.pools &&
      pair.pools.forEach((pool) => {
        poolsByMaturity[pool.maturity] = pool;
      });

    return poolsByMaturity;
  }, [pair]);
}

export function useDueInfo(
  cdPAddress: string,
  positionId: string,
): SWRResponse<DueInfo> {
  const { chainId, web3 } = useActiveWeb3React();

  return useSWR(
    chainId && web3 ? ['due-info', cdPAddress, positionId] : null,
    async () => {
      const cdpContract = getCDContract(web3, cdPAddress);
      const due = await cdpContract.methods.dueOf(positionId).call();
      return {
        debt: new BigNumber(due[0]).div(10 ** 18),
        collateral: new BigNumber(due[1]).div(10 ** 18),
        positionId,
      };
    },
  );
}
