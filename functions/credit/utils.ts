export const calcMaturationPercentage = (
  poolStart: number,
  maturity: number,
) => {
  const now = new Date().getTime() / 1000;
  if (now > maturity) return 100;
  const total = maturity - poolStart;
  const elapsed = now - poolStart;
  return (elapsed / total) * 100;
};

export const isPoolMatured = (maturity: number) => {
  return maturity < new Date().getTime() / 1000;
};
