import { ChainIds } from 'constants/chains';
import { ChainMapping } from 'types/web3';

export const XCAL_EXCHANGE_URI: ChainMapping = {
  [ChainIds.ARBITRUM_GOERLI]:
    'https://api.thegraph.com/subgraphs/name/revolver0cel0t/3xcalibur-arbitrum-goerli',
  [ChainIds.ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/revolver0cel0t/3xcalibur-arbitrum',
  [ChainIds.LOCALHOST]: 'http://localhost:8000/subgraphs/name/3six9/Credit',
};
