import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BUTTON_HEIGHTS: { [key: string]: string } = {
  m: '48px',
  s: '38px',
  auto: 'auto',
};

export const BUTTON_ORIENTATION = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
};

export const ButtonRipple = styled(Box)();

export const Container = (
  type: string,
  disabled: boolean,
  hover: any,
  borderRadius: string | undefined,
  baseColorProperties: any,
  activeProperties: any,
  rounded: boolean,
  size: string,
) => {
  return styled(Box)(
    ({ theme }: any) => `
      background:${baseColorProperties.backgroundColor};
      border:${baseColorProperties.border};
      width:${
        rounded
          ? BUTTON_HEIGHTS[size]
          : type === 'filled'
          ? '100%'
          : 'max-content'
      };
      height:${BUTTON_HEIGHTS[size]};
      border-radius:${borderRadius ?? `8px`};
      cursor:pointer;
      position:relative;
      opacity:${disabled ? '0.5' : '1'};
      pointer-events:none;
      box-sizing:border-box;
      & .MuiTypography-root,& .MuiIcon-root,& svg path	{
        color:${baseColorProperties.color} !important;
        fill:${baseColorProperties.color} !important;
      }
      & .MuiCircularProgress-circle	{
        color:${baseColorProperties.color} !important;
      }
      &:hover .MuiTypography-root,&:hover .MuiIcon-root,&:hover svg path	{
        color:${hover.color} !important;
        fill:${hover.color} !important;
      }
      &:active .MuiTypography-root,&:active .MuiIcon-root,&:active svg path	{
        color:${activeProperties.color} !important;
        fill:${activeProperties.color} !important;
      }
      &:hover{
          border:${hover.border} !important;
          transition: all 0.2s;
      }
      &:active{
        border:${activeProperties.border} !important;
        transition: all 0.2s;
      }
  `,
  );
};
