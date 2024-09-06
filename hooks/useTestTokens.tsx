import { ChainIds } from 'constants/chains';
import { useMemo } from 'react';
import { Token } from 'types/credit';

export const routeAssets = {
  [ChainIds.ARBITRUM]: [
    {
      name: 'Wrapped Ether',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      symbol: 'WETH',
      decimals: 18,
      chainId: ChainIds.ARBITRUM,
      logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      chainId: ChainIds.ARBITRUM,
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg',
    },
  ],
  [ChainIds.GOERLI]: [
    {
      chainId: 5,
      address: '0xf14753b9831B718C2Ca0f0ba050eed31B088aE02',
      decimals: 18,
      symbol: 'LEEZ',
      name: 'LeezToken',
    },
    {
      chainId: 5,
      address: '0x390Aae874F1876F9789765A6D1E7d77AC36138d4',
      decimals: 18,
      symbol: 'REV',
      name: 'RevToken',
    },
  ],
  [ChainIds.ARBITRUM_GOERLI]: [
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3',
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0x17c1fec7A3EF0252e013e84104C531E3C160447d',
      decimals: 6,
      symbol: 'USDC',
      name: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg',
    },

    {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0x3c3D1eFa02C3a4Ba6fDb0dc4D081a150250bf9CB',
      chainId: ChainIds.ARBITRUM_GOERLI,
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/usdt.jpg',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      name: 'DAI',
      symbol: 'DAI',
      decimals: 18,
      address: '0x338b8AE83fC53CB3E73509e52Ba262432f51746D',
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0xebe37ed5bdefcefd3c32db628a35e4f720cd5f8d',
      decimals: 18,
      name: 'RevToken',
      symbol: 'REV',
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0x98d6f38f75bf0612df5b9cfa116e56514dd745a7',
      decimals: 18,
      name: 'NogoToken',
      symbol: 'NOGO',
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0xead9c1f4d2cebe9c0473f61c6907d46e7b205e5b',
      decimals: 18,
      name: '3xcalibur Ecosystem Token',
      symbol: 'XCAL',
      logoURI:
        'https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg',
    },
    {
      chainId: ChainIds.ARBITRUM_GOERLI,
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
      logoURI:
        'https://github.com/sushiswap/list/blob/master/logos/token-logos/token/eth.jpg',
    },
  ],
};

export const useTestTokens = (): Token[] => {
  return useMemo(() => routeAssets[ChainIds.ARBITRUM_GOERLI], [ChainIds]);
};
