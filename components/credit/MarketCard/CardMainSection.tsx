import { Box } from '@mui/material';
import React from 'react';
import { formatUnixTime } from '@utils/index';
import { AprSection } from './Common/AprSection';
import { PositionSection } from './Common/PositionSection';
import { UtilizationRate } from './Common/UtilizationRate';

export interface CardMainInfo {
  averageAPR: string;
  borrowAPR: string;
  cdp: string;
  maturity: number[];
  utilizationRate: string;
  tvl: string;
}

type CardMainSectionProps = {
  info: CardMainInfo;
};

export default function CardMainSection({ info }: CardMainSectionProps) {
  const { averageAPR, borrowAPR, cdp, maturity, utilizationRate, tvl } = info;

  return (
    <Box>
      <AprSection averageAPR={averageAPR} borrowAPR={borrowAPR} />
      <PositionSection cdp={cdp} maturity={formatUnixTime(maturity)} />
      <UtilizationRate utilizationRate={utilizationRate} tvl={tvl} />
    </Box>
  );
}
