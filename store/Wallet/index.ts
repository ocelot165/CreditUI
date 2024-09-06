import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import { chains } from 'constants/chains';

const wallets = [injectedModule(), coinbaseWalletModule({ darkMode: true })];

export const web3Onboard = init({
  wallets,
  chains,
  theme: 'dark',
  connect: {
    autoConnectLastWallet: true,
  },
});
