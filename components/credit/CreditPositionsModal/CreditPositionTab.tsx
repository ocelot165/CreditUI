import * as React from 'react';
import { Box, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import TabsUnstyled from '@mui/base/Tabs';
import TabsListUnstyled from '@mui/base/TabsList';
import { Typography } from '@mui/material';

const TabBox = styled(Box)();

interface TabProps {
  children: React.ReactNode;
  onClick: (arg: number) => void;
  value: number;
}

const CustomTab = ({ children, onClick, value }: TabProps) => {
  const TabElem = styled(TabsUnstyled)(
    `
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 12px;
    background-color: transparent;
    border: none;
    text-align: center;

    & .MuiBox-root {
      transition: transform 0.3s;
    }
    
    &:hover {
      & > .MuiBox-root > .MuiBox-root {
        transform: translateY(-42px);
        background-color: white;
      }
    }
  `,
  );

  return (
    <TabElem onClick={onClick} value={value}>
      {children}
    </TabElem>
  );
};

const TabsList = styled(TabsListUnstyled)(
  `
    background-color:transparent;
    display: flex;
    align-items: baseline;
    justify-content: center;
    width: 100%;
  `,
);

interface CreditPositionTabProps {
  labels: string[];
  selectedIndex: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
}

export function CreditPositionTab({
  labels,
  selectedIndex,
  setSelected,
}: CreditPositionTabProps) {
  const handleChange = (value: number) => {
    setSelected(value);
  };

  return (
    <TabsUnstyled value={selectedIndex}>
      <TabsList sx={{ columnGap: '1rem' }}>
        {labels.map((label, index) => (
          <CustomTab
            onClick={() => handleChange(index)}
            value={index}
            key={index}
          >
            <Box
              width="100%"
              display="flex"
              flexDirection="column-reverse"
              gap="8px"
            >
              <TabBox
                border={
                  index === selectedIndex
                    ? '1px solid #71C9C9'
                    : '1px solid #8D8D8D'
                }
              />
              <Typography
                sx={{
                  color: index === selectedIndex ? '#71C9C9' : '#8D8D8D',
                  fontWeight: index === selectedIndex ? '700' : '500',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  lineHeight: '150%',
                }}
              >
                {label}
              </Typography>
            </Box>
          </CustomTab>
        ))}
      </TabsList>
    </TabsUnstyled>
  );
}
