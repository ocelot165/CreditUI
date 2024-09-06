import BigNumber from 'bignumber.js';
import stringify from 'fast-json-stable-stringify';
import { useToken } from 'hooks/useToken';
import { useSWRConfig } from 'swr';
import { LendingPool } from 'types/credit';

export function useClaimBalances(pool: LendingPool) {
  const { mutate } = useSWRConfig();

  const bondInterestToken = useToken(pool?.bondInterestAddress);
  const bondPrincipalToken = useToken(pool?.bondPrincipalAddress);
  const insuranceInterestToken = useToken(pool?.insuranceInterestAddress);
  const insurancePrincipalToken = useToken(pool?.insurancePrincipalAddress);
  const nativeTokens = [
    bondInterestToken,
    bondPrincipalToken,
    insuranceInterestToken,
    insurancePrincipalToken,
  ];

  const bondInterestBalance = pool?.bondInterestBalance || new BigNumber(0);
  const bondPrincipalBalance = pool?.bondPrincipalBalance || new BigNumber(0);
  const insuranceInterestBalance =
    pool?.insuranceInterestBalance || new BigNumber(0);
  const insurancePrincipalBalance =
    pool?.insurancePrincipalBalance || new BigNumber(0);

  const refreshNativesBalances = () => {
    mutate(['myTokenBalances', stringify(nativeTokens)]);
  };

  return {
    bondInterestBalance,
    bondPrincipalBalance,
    insuranceInterestBalance,
    insurancePrincipalBalance,
    nativeTokens: {
      bondInterest: bondInterestToken,
      bondPrincipal: bondPrincipalToken,
      insuranceInterest: insuranceInterestToken,
      insurancePrincipal: insurancePrincipalToken,
    },
    refreshNativesBalances,
  };
}
