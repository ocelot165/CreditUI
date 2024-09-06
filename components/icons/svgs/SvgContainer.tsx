import { Box } from '@mui/material';

type SvgContainerProps = {
  height: string;
  width: string;
  color?: string;
  viewBox?: string;
  children: JSX.Element;
};

export const SvgContainer = ({
  height = '20px',
  width = '20px',
  color,
  viewBox,
  children,
}: SvgContainerProps) => (
  <Box
    component="svg"
    width={width}
    height={height}
    {...{ viewBox: viewBox || `0 0 ${width} ${height}` }}
    {...{ fill: color }}
    {...{ xmlns: 'http://www.w3.org/2000/svg' }}
  >
    {children}
  </Box>
);
