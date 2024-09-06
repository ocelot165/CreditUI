import { Box } from '@mui/material';
import Modal from 'components/componentLibrary/ModalCard';
import { LendingPair, LendingPool } from 'types/credit';
import { Type } from '../Pools';
import LendCard from './LendCard';
import BorrowCard from './BorrowCard';
import LpCard from './LpCard';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLendingPoolsByMaturity } from 'functions/credit';

type CreditActionCardProps = {
  type: Type;
  lendingPair: LendingPair;
  modalOpen: boolean;
  handleCloseModal: any;
};

const getCardByType = (
  type: Type,
  pair: LendingPair,
  maturity: number,
  setMaturity: Dispatch<SetStateAction<number>>,
  handleCloseModal: any,
  selectedPool: LendingPool,
): JSX.Element =>
  ({
    Lend: (
      <LendCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
    Borrow: (
      <BorrowCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
    'Provide Liquidity': (
      <LpCard
        type={type}
        pair={pair}
        maturity={maturity}
        setMaturity={setMaturity}
        handleCloseModal={handleCloseModal}
        selectedPool={selectedPool}
      />
    ),
  }[type]);

function CreditActionCard({
  type,
  lendingPair,
  modalOpen,
  handleCloseModal,
}: CreditActionCardProps) {
  const [maturity, setMaturity] = useState(0);

  const poolsByMaturity = useLendingPoolsByMaturity(lendingPair);

  const maturities = Object.keys(poolsByMaturity).map((val) => Number(val));

  const selectedPool = poolsByMaturity[maturities[maturity]];

  useEffect(() => {
    setMaturity(0);
  }, [type, modalOpen]);

  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box width="480px">
        {getCardByType(
          type,
          lendingPair as LendingPair,
          maturity,
          setMaturity,
          handleCloseModal,
          selectedPool,
        )}
      </Box>
    </Modal>
  );
}

export default CreditActionCard;
