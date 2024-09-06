import { assetSWRConfig } from 'constants/swr';
import { CreditToken, TokenType } from 'types/credit';
import useSWR, { SWRResponse } from 'swr';
import { useMultiCall } from 'hooks/useMulticall';
import { getCreditPositionContract } from 'constants/contracts';
import { multicallSplitOnOverflow } from 'lib/multicall/helpers';
import { CreditPosition as CreditPositionContract } from 'types/web3Typings/CreditPosition';
import Multicall from 'lib/multicall';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

export enum PositionType {
  LIQUIDITY,
  CREDIT,
  DEBT,
}

export type CreditPosition = {
  positionType: PositionType;
  pair: string;
  maturity: number;
  CDT?: CreditToken;
  liquidityToken?: CreditToken;
  bondPrincipal?: CreditToken;
  bondInterest?: CreditToken;
  insurancePrincipal?: CreditToken;
  insuranceInterest?: CreditToken;
  positionIndex: string;
};

export type AllPositions = {
  creditPositions: CreditPosition[];
  liquidityPositions: CreditPosition[];
  debtPositions: CreditPosition[];
};

async function getPositionIds(
  account: string,
  positionBalance: number,
  creditPositionsContract: CreditPositionContract,
  multicall: Multicall,
): Promise<string[]> {
  const positionIdCalls = new Array(positionBalance)
    .fill(null)
    .map((_, index) =>
      creditPositionsContract.methods.tokenOfOwnerByIndex(account, index),
    );
  const positionIds = await multicall.aggregate(positionIdCalls);

  return positionIds;
}

type PositionData = {
  assetContract: string;
  tokenId: string;
  totalAmount: string;
  tokenType: TokenType;
};

const formatDataIntoCreditToken = (data: PositionData): CreditToken => ({
  assetContract: data.assetContract,
  tokenId: data.tokenId,
  totalAmount: Number(data.totalAmount),
  tokenType: Number(data.tokenType),
});

async function getPositionTypes(
  positionIds: string[],
  creditPositionsContract: CreditPositionContract,
  multicall: Multicall,
) {
  const calls = positionIds.map((positionId) =>
    creditPositionsContract.methods.getPositionType(positionId),
  );

  const data = await multicallSplitOnOverflow(calls, multicall, {
    maxCallsPerBatch: 500,
  });

  return data.map((value) => Number(value));
}

function getPositionCalls(
  positionIds: string[],
  positionTypes: PositionType[],
  creditPositionsContract: CreditPositionContract,
) {
  return positionIds.flatMap((positionId, index) => [
    creditPositionsContract.methods.getPair(positionId),
    creditPositionsContract.methods.getMaturity(positionId),
    ...(positionTypes[index] === PositionType.LIQUIDITY
      ? [creditPositionsContract.methods.getLiquidity(positionId)]
      : []),
    ...(positionTypes[index] === PositionType.CREDIT
      ? [creditPositionsContract.methods.getCredit(positionId)]
      : []),
    ...(positionTypes[index] === PositionType.DEBT
      ? [creditPositionsContract.methods.getDebt(positionId)]
      : []),
  ]);
}

async function getPositionData(
  positionIds: string[],
  creditPositionsContract: CreditPositionContract,
  multicall: Multicall,
): Promise<AllPositions> {
  const positionTypes = await getPositionTypes(
    positionIds,
    creditPositionsContract,
    multicall,
  );
  const positionDataCalls = getPositionCalls(
    positionIds,
    positionTypes,
    creditPositionsContract,
  );

  const liquidityPositions = [];
  const creditPositions = [];
  const debtPositions = [];
  const positionData = await multicallSplitOnOverflow(
    positionDataCalls,
    multicall,
    { maxCallsPerBatch: 500 },
  );
  let index = 0;
  let positionIndex = 0;
  while (index < positionData.length) {
    const positionType = positionTypes[positionIndex];
    const [pair, maturity, positionSpecificData] = positionData.slice(
      index,
      index + 3,
    );
    let extraData = {};
    switch (Number(positionType)) {
      case PositionType.CREDIT: {
        const bondPrincipal = formatDataIntoCreditToken(
          positionSpecificData[0],
        );
        const bondInterest = formatDataIntoCreditToken(positionSpecificData[1]);
        const insurancePrincipal = formatDataIntoCreditToken(
          positionSpecificData[2],
        );
        const insuranceInterest = formatDataIntoCreditToken(
          positionSpecificData[3],
        );
        extraData = {
          bondPrincipal,
          bondInterest,
          insurancePrincipal,
          insuranceInterest,
        };
        break;
      }
      case PositionType.LIQUIDITY: {
        const liquidityToken = formatDataIntoCreditToken(positionSpecificData);
        extraData = { liquidityToken };
        break;
      }
      case PositionType.DEBT: {
        const CDT = formatDataIntoCreditToken(positionSpecificData);
        extraData = { CDT };
        break;
      }
    }

    const position: CreditPosition = {
      positionIndex: positionIds[positionIndex],
      positionType: Number(positionType),
      pair,
      maturity,
      ...extraData,
    };

    if (Number(positionType) === PositionType.CREDIT) {
      creditPositions.push(position);
    } else if (Number(positionType) === PositionType.LIQUIDITY) {
      liquidityPositions.push(position);
    } else {
      debtPositions.push(position);
    }

    index += 3;
    positionIndex++;
  }

  return {
    creditPositions,
    liquidityPositions,
    debtPositions,
  };
}

export function useCreditPositions(): SWRResponse<AllPositions> {
  const multicall = useMultiCall();
  const { account, chainId, web3 } = useActiveWeb3React();

  return useSWR<AllPositions>(
    chainId && multicall && web3 && account
      ? ['my-credit-positions', account]
      : null,
    async () => {
      try {
        const creditPositionsContract = getCreditPositionContract(
          web3,
          chainId,
        );
        const totalPositions = Number(
          await creditPositionsContract.methods
            .balanceOf(account as string)
            .call(),
        );
        if (Number(totalPositions) < 0) {
          return {
            creditPositions: [],
            liquidityPositions: [],
            debtPositions: [],
          };
        }
        const positionIds = await getPositionIds(
          account as string,
          totalPositions,
          creditPositionsContract,
          multicall as Multicall,
        );
        const allPositionData = await getPositionData(
          positionIds,
          creditPositionsContract,
          multicall as Multicall,
        );
        return allPositionData;
      } catch (error) {
        return {
          creditPositions: [],
          liquidityPositions: [],
          debtPositions: [],
        };
      }
    },
    { ...assetSWRConfig, revalidateOnFocus: true },
  );
}
