import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ButtonRipple } from './ButtonContainer';

export const CustomRippleBg = (
  disabled: boolean,
  hover: any,
  activeProperties: any,
  borderRadius: string | undefined,
) => {
  return styled(Box)(
    ({ theme }: any) => `
      position:absolute;
      left:50%;
      top:0%;
      transform:translate(-50%);
      pointer-events:${disabled ? 'none' : 'auto'};
      width:100%;
      height:100%;
      box-sizing:border-box;
      border-radius:${borderRadius ?? `${theme.shape.borderRadius}px`};
      overflow:hidden;
      & ${ButtonRipple}{
        position:absolute;
        left:50%;
        top:40%;
        transform: scale(0) translate(-50%,-5px);
        width:10px;
        height:10px;
        box-sizing:border-box;
        border-radius:${borderRadius ?? `${theme.shape.borderRadius}px`};
        transform-origin:0 0;
      }
      &:hover ~ .MuiTypography-root,&:hover ~ .MuiIcon-root,&:hover ~ svg path	{
          color:${hover.color ? hover.color : 'initial'} !important;
          fill:${hover.color ? hover.color : 'initial'} !important;
      }
      &:hover ${ButtonRipple}{
        opacity:${disabled ? 0 : 1};
        transform: scale(100) translate(-50%,-5px);
        transition:opacity 1s,transform 1s;
        background-color:${hover.backgroundColor};
      }
      &:active ${ButtonRipple}{
        background-color:${activeProperties.backgroundColor} !important;
        opacity:${disabled ? 0 : 1};
        transform: scale(100) translate(-50%,-5px);
        transition:opacity 1s,transform 1s;
      }
  `,
  );
};
