export enum ChainIds {
  ETHEREUM = 1,
  ARBITRUM = 42161,
  FANTOM = 250,
  ARBITRUM_RINKEBY = 421611,
  ARBITRUM_GOERLI = 421613,
  KOVAN = 42,
  GOERLI = 5,
  LOCALHOST = 31337,
}

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const arbitrumGoerliChain = {
  id: '0x66eed',
  token: 'AETH',
  label: 'Arbitrum Goerli',
  rpcUrl: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const arbitrumOneChain = {
  id: '0xa4b1',
  token: 'AETH',
  label: 'Arbitrum One',
  rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const localhostChain = {
  id: '0x7a69',
  token: 'ETH',
  label: 'Localhost',
  rpcUrl: 'http://localhost:8545',
};

export const chains = [arbitrumGoerliChain, arbitrumOneChain, localhostChain];

export const supportedChainIds = chains.map((chain) =>
  Number.parseInt(chain.id),
);
