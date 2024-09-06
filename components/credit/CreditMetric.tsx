import { Box, Typography, styled } from '@mui/material';
import SubCard from 'components/componentLibrary/Card/SubCard';

type CreditMetricProps = {
  title: string;
  data: string;
  color?: string;
  titleSize?: string;
  dataSize?: string;
  titleWeight?: string;
  borderRadius?: string;
  boxShadow?: string;
  background?: string;
  backdropFilter?: string;
  width?: string;
  gradient?: string;
  opacity?: string;
  showCircle?: boolean;
  padding?: string;
};
export default function CreditMetric({
  title = 'Supply Balance',
  data = '$43.56M',
  color = '#B3F7F7',
  titleSize = '14px',
  dataSize = '24px',
  titleWeight = '500',
  borderRadius = '12px',
  boxShadow = '',
  background = 'auto',
  opacity = '0.6',
  gradient,
  showCircle = false,
  padding = '0px',
}: CreditMetricProps) {
  return (
    <Box
      padding={padding}
      //  style={{ maxWidth: '20%', flex: '1' }}
      style={{
        borderRadius,
        boxShadow,
        background,
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0',
          gap: '4px',
          width: '100%',
        }}
      >
        <Box display="flex" alignItems="center">
          {showCircle && (
            <Box
              style={{
                background: gradient,
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            />
          )}
          <Box
            style={{
              fontSize: titleSize,
              fontWeight: titleWeight,
              fontFamily: "'Inter', 'sans-serif'",
              lineHeight: '150%',
              color,
              opacity,
            }}
          >
            {title}
          </Box>
        </Box>
        <Box
          style={{
            fontFamily: "'Retron2000', 'sans-serif'",
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: dataSize,
            lineHeight: '32px',
            paddingBottom: '4px',
            borderBottom: '1px dashed #ffffff',
            color: '#ffffff',
          }}
        >
          {data}
        </Box>
      </Box>
    </Box>
  );
}
