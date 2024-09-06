import { keyframes } from '@emotion/react';

export const LoadingAnimation = (baseColorProperties: any) => keyframes`
  0% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  16.667% {
    box-shadow: 9994px -5px 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  33.333% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  50% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px -5px 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  66.667% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
  83.333% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px -5px 0 0 ${baseColorProperties.color};
  }
  100% {
    box-shadow: 9994px 0 0 0 ${baseColorProperties.color}, 10001px 0 0 0 ${baseColorProperties.color}, 10008px 0 0 0 ${baseColorProperties.color};
  }
`;
