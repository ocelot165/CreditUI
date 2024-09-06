import { assetSWRConfig } from 'constants/swr';
import useSWR from 'swr';
import {
  allPairsCredit,
  getMaturitiesForLendingPair,
} from '../fetchers/credit';
import { Token } from 'types/assets';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

export function useMaturitiesForLendingPair(asset: Token, collateral: Token) {
  const { chainId } = useActiveWeb3React();
  return useSWR(
    asset && collateral && chainId
      ? ['maturitiesForLendingPair', asset, collateral, chainId]
      : null,
    () => getMaturitiesForLendingPair(asset, collateral, chainId),
    assetSWRConfig,
  );
}
