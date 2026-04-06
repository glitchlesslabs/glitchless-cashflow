import { getAnnualCashflow } from '@/data/getAnnualCashflow';

export default async function Cashflow() {
  const cashflow = await getAnnualCashflow(2026);
  return <div></div>;
}
