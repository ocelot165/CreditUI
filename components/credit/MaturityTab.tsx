import { Box, Typography } from '@mui/material';
import { formatCurrency, formatTimestampToDate } from '@utils/index';
import { CreditPair, useLendingPoolsByMaturity } from 'functions/credit';
import { LendingPair } from 'types/credit';
import { Type } from './Pools';
import BigNumber from 'bignumber.js';
import ToggleButton from '@components/componentLibrary/ToggleButton';

interface TermFilterProps {
  value: any;
  setValue: (newValue: any) => void;
  pair: LendingPair;
  type: Type;
}

export default function MaturityTab({
  value,
  setValue,
  pair,
  type,
}: TermFilterProps) {
  const poolsByMaturity = useLendingPoolsByMaturity(pair);

  const maturities = Object.keys(poolsByMaturity).map((val) => Number(val));

  const setValueAsNum = (maturity: number) => {
    setValue(maturities.findIndex((val) => val === maturity));
  };

  return (
    <ToggleButton
      header={'Select a maturity data'}
      value={maturities[value]}
      setValue={setValueAsNum}
      isSelected={(data, val) => data === val}
      values={maturities}
      renderedOption={(value: number) => (
        <Box>
          <Typography fontFamily="Inter" fontSize="12px" fontWeight="400">
            {formatTimestampToDate(Number(value) * 1000)
              .split(' ')
              .slice(1, 4)
              .reduce((prev, curr) => prev + ' ' + curr, '')}
          </Typography>
          <Typography fontFamily="Retron2000" fontSize="18px">
            {type !== 'Provide Liquidity'
              ? formatCurrency(
                  poolsByMaturity[value].maxAPR
                    ? poolsByMaturity[value].maxAPR?.toFixed()
                    : '0',
                )
              : formatCurrency(
                  CreditPair.calculateApr(
                    new BigNumber(poolsByMaturity[value].X),
                    poolsByMaturity[value].Y,
                  )
                    .times(100)
                    .toFixed(),
                )}
            %
          </Typography>
        </Box>
      )}
    />
  );
}
