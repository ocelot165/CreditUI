import { Box, Typography, styled } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;

  white-space: nowrap;
  overflow: hidden;

  margin: 5px;
`;

const StyledToggleButton = styled(ToggleButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 11.5px 20px;

  border-radius: 6px;
  background: #181b22;
  border: none;

  font-family: 'Inter', 'sans-serif';
  font-weight: ${({ selected }) => (selected ? 700 : 400)};
  font-size: 14px;
  line-height: 150%;
  color: #8a9fb3;

  &.Mui-selected,
  &:hover {
    color: #f5f5f5;
    background: #1c2230;
  }
`;

interface TermFilterProps {
  value: any;
  setValue: (newValue: any) => void;
}

export default function TermFilter({ value, setValue }: TermFilterProps) {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target.value === value) {
      onClick('All');
    } else {
      onClick(newValue);
    }
  };

  const onClick = (newValue: any) => {
    setValue(newValue);
  };

  return (
    <StyledContainer>
      <Typography
        color="#8A9FB3"
        fontFamily="Inter"
        fontWeight="400"
        fontSize="14px"
        lineHeight="150%"
      >
        Loan Term:
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="Term"
      >
        <StyledToggleButton
          style={{ padding: '10px 20px' }}
          value="All"
          selected={value === 'All'}
          onClick={() => onClick('All')}
        >
          All
        </StyledToggleButton>
        <StyledToggleButton
          value="1 Month"
          selected={value === '1 Month'}
          onClick={() => onClick('1 Month')}
        >
          1 Month
        </StyledToggleButton>
        <StyledToggleButton
          value="2 Months"
          selected={value === '2 Months'}
          onClick={() => onClick('2 Months')}
        >
          2 Months
        </StyledToggleButton>
        <StyledToggleButton
          value="3 Months"
          selected={value === '3 Months'}
          onClick={() => onClick('3 Months')}
        >
          3 Months
        </StyledToggleButton>
      </ToggleButtonGroup>
    </StyledContainer>
  );
}
