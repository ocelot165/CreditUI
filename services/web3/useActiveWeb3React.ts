import { useConnectWallet } from '@web3-onboard/react';
import Web3 from 'web3';
import { ChainIds } from 'constants/chains';

export function useActiveWeb3React() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const account = wallet?.accounts?.[0]?.address;
  const chainId = wallet?.chains?.[0]
    ? parseInt(wallet?.chains?.[0]?.id)
    : ChainIds.ARBITRUM;

  const web3 = new Web3(wallet?.provider);

  return {
    account,
    chainId,
    connecting,
    connect,
    disconnect,
    web3,
  };
}
