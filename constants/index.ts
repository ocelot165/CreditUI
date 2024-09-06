import BigNumber from 'bignumber.js';
import { ChainMapping } from 'types/web3';
import { ChainIds } from './chains';

export const WRAPPED_NATIVE_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Wrapped Ether',
  [ChainIds.ARBITRUM_GOERLI]: 'Wrapped Ether',
  [ChainIds.LOCALHOST]: 'Wrapped Ether',
};
export const WRAPPED_NATIVE_SYMBOL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'WETH',
  [ChainIds.ARBITRUM_GOERLI]: 'WETH',
  [ChainIds.LOCALHOST]: 'WETH',
};
export const WRAPPED_NATIVE_DECIMALS: ChainMapping = {
  [ChainIds.ARBITRUM]: 18,
  [ChainIds.ARBITRUM_GOERLI]: 18,
  [ChainIds.LOCALHOST]: 18,
};

export const NATIVE_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Ether',
  [ChainIds.ARBITRUM_GOERLI]: 'Ether',
  [ChainIds.LOCALHOST]: 'Ether',
};
export const NATIVE_SYMBOL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'ETH',
  [ChainIds.ARBITRUM_GOERLI]: 'ETH',
  [ChainIds.LOCALHOST]: 'ETH',
};
export const NATIVE_DECIMALS: ChainMapping = {
  [ChainIds.ARBITRUM]: 18,
  [ChainIds.ARBITRUM_GOERLI]: 18,
  [ChainIds.LOCALHOST]: 18,
};

export const ETHERSCAN_URL: ChainMapping = {
  [ChainIds.ARBITRUM]: 'https://arbiscan.io/',
  [ChainIds.ARBITRUM_GOERLI]: 'https://goerli-rollup-explorer.arbitrum.io/',
  [ChainIds.LOCALHOST]: '',
};

export const ETHERSCAN_NAME: ChainMapping = {
  [ChainIds.ARBITRUM]: 'Arbiscan',
  [ChainIds.ARBITRUM_GOERLI]: 'Explorer',
};

export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0);

export const DEFI_LLAMA_API = 'https://coins.llama.fi';
