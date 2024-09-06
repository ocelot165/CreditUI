//@ts-check
import {
  CONVENIENCE_ADDRESS,
  CREDIT_POSITION_ADDRESS,
  LP_FARMING_ADDRESS,
} from './addresses';
import CONVENIENCE_ABI from './ABIs/convenience.json';
import ERC_20_ABI from './ABIs/erc20.json';
import COLLATERALIZED_DEBT_ABI from 'constants/contracts/ABIs/collateralizedDebt.json';
import CREDIT_PAIR_ABI from './ABIs/creditPair.json';
import MULTICALL_ABI from './ABIs/multicall.json';
import CREDIT_POSITION_ABI from './ABIs/creditPosition.json';
import LP_FARMING_ABI from './ABIs/lpFarming.json';
import Web3 from 'web3';
import {
  CollateralizedDebt,
  Convenience,
  CreditPair,
  CreditPosition,
  Erc20,
  LpFarming,
  Multicall,
} from 'types/web3Typings';

export const getConvenienceContract = (
  web3: Web3,
  chainId: number,
): Convenience =>
  new web3.eth.Contract(CONVENIENCE_ABI, CONVENIENCE_ADDRESS[chainId]);

export const getTokenContract = (web3: Web3, address: string): Erc20 => {
  return new web3.eth.Contract(ERC_20_ABI, address);
};

export const getCDContract = (
  web3: Web3,
  address: string,
): CollateralizedDebt =>
  new web3.eth.Contract(COLLATERALIZED_DEBT_ABI, address);

export const getCreditPairContract = (
  web3: Web3,
  address: string,
): CreditPair => new web3.eth.Contract(CREDIT_PAIR_ABI, address);

export const getMulticallContract = (web3: Web3, address: string): Multicall =>
  new web3.eth.Contract(MULTICALL_ABI, address);

export const getCreditPositionContract = (
  web3: Web3,
  chainId: number,
): CreditPosition =>
  new web3.eth.Contract(CREDIT_POSITION_ABI, CREDIT_POSITION_ADDRESS[chainId]);

export const getLPFarmingContract = (web3: Web3, chainId: number): LpFarming =>
  new web3.eth.Contract(LP_FARMING_ABI, LP_FARMING_ADDRESS[chainId]);
