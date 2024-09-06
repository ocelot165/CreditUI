import { Box, keyframes } from '@mui/material';
import { useAccountCenter } from '@web3-onboard/react';
import { XCaliButton } from 'components/componentLibrary/Button/XCaliButton';
import { CreditIcon } from 'components/icons/svgs/Credit';
import { supportedChainIds } from 'constants/chains';
import { useWindowSize } from 'hooks/useWindowSize';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useActiveWeb3React } from 'services/web3/useActiveWeb3React';

// shorten the input address to have 0x + 4 characters at start and end
function shortenAddress(address: string, chars = 4) {
  try {
    return `${address.substring(0, chars + 2)}...${address.substring(
      42 - chars,
    )}`;
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
}

const hitQueries = [0, 768];

const cssProperties: any = {
  0: {
    paddingLeft: '12px',
    paddingRight: '12px',
    width: 'calc(100% - 24px)',
  },
  768: {
    paddingLeft: '80px',
    paddingRight: '80px',
    width: 'calc(100% - 160px)',
  },
};

export function Nav() {
  const { account, chainId, connect } = useActiveWeb3React();

  const router = useRouter();

  const update = useAccountCenter();

  const openRef = useRef(false);

  const wrongChain = !supportedChainIds.includes(chainId);

  const [width] = useWindowSize();

  const currentHitQuery = useMemo(() => {
    let query = 0;
    hitQueries.forEach((currentQuery) => {
      if (width >= currentQuery) {
        query = currentQuery;
      }
    });
    return query;
  }, [width]);

  const currentProperties = cssProperties[currentHitQuery];

  const changeAccountModalState = () => {
    openRef.current = !openRef.current;
    update({
      enabled: openRef.current,
      expanded: openRef.current,
      minimal: false,
      position: 'topRight',
    });
  };

  useEffect(() => {
    update({
      enabled: false,
      expanded: false,
      minimal: false,
      position: 'topRight',
    });
    window.addEventListener('click', (e) => {
      if (openRef.current) changeAccountModalState();
    });
    return () => {
      window.removeEventListener('click', (e) => {
        if (openRef.current) changeAccountModalState();
      });
    };
  }, [account, changeAccountModalState, update]);

  const web3Function = () =>
    account ? setTimeout(() => changeAccountModalState()) : connect();

  const AccountButton = () => {
    return (
      <Box>
        {wrongChain
          ? 'Wrong Chain'
          : account
          ? shortenAddress(account)
          : 'Connect'}
      </Box>
    );
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '79px',
        zIndex: '1',
        borderBottom: `thin #1D1E1F solid`,
        ...currentProperties,
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(16px)',

          alignItems: 'center',
        }}
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      />
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => router.push('/credit')}
        width="200px"
        height="80%"
      >
        <CreditIcon width="200px" height="80%" />
      </Box>

      <XCaliButton
        variant="blue"
        onClickFn={web3Function}
        Component={<AccountButton />}
      />
    </nav>
  );
}
