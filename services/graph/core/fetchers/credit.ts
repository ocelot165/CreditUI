import { NATIVE_DECIMALS, NATIVE_NAME, NATIVE_SYMBOL } from 'constants/';
import { ChainIds } from 'constants/chains';
import {
  NATIVE_ADDRESS,
  WRAPPED_NATIVE_ADDRESS,
} from 'constants/contracts/addresses';
import request from 'graphql-request';
import { XCAL_EXCHANGE_URI } from 'services/graph/config';
import { Token } from 'types/assets';
import { GenericObject } from 'types/web3';
import {
  activeLendingPairsQuery,
  creditPairData,
  lendingPairQuery,
  lendingPairUsingTokens,
  lendingPairWithPoolsQuery,
} from '../queries/credit';
import { LendingPairQuery } from '../types';

const fetcher = async (
  chainId: number,
  query: any,
  variables: Record<string, any>,
): Promise<any> => request(XCAL_EXCHANGE_URI[chainId], query, variables);

export const getLendingPairs = async (
  chainId: number,
  opts: any = {},
): Promise<LendingPairQuery[]> => {
  try {
    const active = opts?.active ?? false;
    const now = new Date();
    const beginning = new Date('2022-05-01'); // all pairs
    // TODO(optimization): fetch the timestamp from the blockchain instead for localhost (running on a past block)
    const minMaturity =
      chainId === ChainIds.LOCALHOST
        ? 0
        : Math.round((active ? now : beginning).getTime() / 1000);
    const { lendingPairs }: { lendingPairs: LendingPairQuery[] } =
      await fetcher(chainId, activeLendingPairsQuery, {
        minMaturity,
      });
    return lendingPairs
      .filter((pair: LendingPairQuery) => Boolean(pair.pools.length))
      .map((pair: LendingPairQuery) => ({
        ...pair,
        asset: _getTokenOrNative(pair.asset, chainId),
        collateral: _getTokenOrNative(pair.collateral, chainId),
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLendingPair = async (
  pairAddress: string,
  opts: GenericObject,
): Promise<LendingPairQuery> => {
  const chainId: number = opts.chainId;
  const withPools = opts.withPools === undefined ? true : opts.withPools;

  const { lendingPair: pair }: { lendingPair: LendingPairQuery } =
    await fetcher(
      chainId,
      withPools ? lendingPairWithPoolsQuery : lendingPairQuery,
      {
        id: pairAddress.toLowerCase(),
      },
    );
  return {
    ...pair,
    asset: _getTokenOrNative(pair.asset, chainId),
    collateral: _getTokenOrNative(pair.collateral, chainId),
  };
};

export const getMaturitiesForLendingPair = async (
  asset: Token,
  collateral: Token,
  chainId: number,
): Promise<number[]> => {
  const { lendingPairs: pair }: { lendingPairs: LendingPairQuery[] } =
    await fetcher(chainId, lendingPairUsingTokens, {
      asset: asset.address.toLowerCase(),
      collateral: collateral.address.toLowerCase(),
    });

  return pair[0].pools.map((pool) => pool.maturity);
};

const _getTokenOrNative = (token: Token, chainId: number) => {
  return token.address === WRAPPED_NATIVE_ADDRESS[chainId].toLowerCase()
    ? {
        decimals: NATIVE_DECIMALS[chainId],
        name: NATIVE_NAME[chainId],
        symbol: NATIVE_SYMBOL[chainId],
        address: NATIVE_ADDRESS[chainId],
      }
    : token;
};

export const allPairsCredit = async (chainId: number) => {
  const { pairs: data } = await fetcher(chainId, creditPairData, {
    maturity: '0',
  });
  return data;
};
