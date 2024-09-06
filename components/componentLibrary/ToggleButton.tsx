import { Box, Typography, styled } from '@mui/material';
import Toggle from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px;
  gap: 8px;
`;

const StyledToggleButton = styled<any>(Toggle)`
  display: flex;
  padding: 11.5px 20px;
  width: 100%;

  border-radius: 6px;
  border: none;

  font-family: 'Inter', 'sans-serif';
  font-weight: ${({ selected }: { selected: number }) =>
    selected ? 700 : 400};
  font-size: 14px;
  line-height: 150%;
  color: #8d8d8d;

  &.Mui-selected,
  &:hover {
    color: #f4f4f4;
    border-radius: 8px;
    background: #2b2d2f;
  }
`;

type Options<T> = {
  header?: string;
  value: T;
  setValue: (val: T) => any;
  values: T[];
  isSelected: (val: T, currentVal: T) => boolean;
  renderedOption: (value: T) => JSX.Element;
};

export default function ToggleButton<T>({
  header,
  value,
  setValue,
  renderedOption,
  values,
  isSelected,
}: Options<T>) {
  const onClick = (newValue: T) => {
    setValue(newValue);
  };

  const handleChange = (_: any, newValue: T) => {
    onClick(newValue);
  };

  return (
    <StyledContainer>
      {header && (
        <Typography
          color="#8D8D8D"
          fontFamily="Inter"
          fontWeight="400"
          fontSize="12px"
        >
          {header}
        </Typography>
      )}
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="Term"
        style={{
          background: '#1d1e1f',
          padding: '8px',
          gap: '10px',
          borderRadius: '8px',
        }}
      >
        {values.map((data: T) => (
          <StyledToggleButton
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 16px',
              borderRadius: '8px',
            }}
            value={data}
            selected={isSelected(data, value)}
            onClick={() => onClick(data)}
            key={data}
          >
            {renderedOption(data)}
          </StyledToggleButton>
        ))}
      </ToggleButtonGroup>
    </StyledContainer>
  );
}
