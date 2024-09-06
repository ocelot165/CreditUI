import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Dots = (baseColorProperties: any) => {
  return styled(Box)(
    ({ theme }: any) => `
      position: relative;
      left: -9999px;
      width: 5px;
      height: 5px;
      border-radius: 5px;
      color: ${baseColorProperties.color};
      box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 9999px 0 0 0 ${baseColorProperties.color}, 10014px 0 0 0 ${baseColorProperties.color};
  `,
  );
};
