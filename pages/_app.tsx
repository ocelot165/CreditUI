import React from 'react';
import Head from 'next/head';
import 'styles/globals.css';
import { Web3OnboardProvider } from '@web3-onboard/react';
import { web3Onboard } from 'store/Wallet';
import SnackController from 'components/snackbar/SnackController';
import { ThemeContextProvider } from 'theme/themeContext';
import { Layout } from 'components/layout';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache({ key: 'css', prepend: true });
export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: any) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>3xcalibur</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <RecoilRoot>
        <RecoilNexus />
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <ThemeContextProvider>
            <SnackController />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeContextProvider>
        </Web3OnboardProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}
