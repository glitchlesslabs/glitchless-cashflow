import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnnualCashflow } from '@/data/getAnnualCashflow';
import CashflowFilters from './cashflow-filters';
import { getTransactionYearsRange } from '@/data/getTransactionYearsRange';

export default async function Cashflow({ year }: { year: number }) {
  const [cashflow, yearsRange] = await Promise.all([
    getAnnualCashflow(year),
    getTransactionYearsRange(),
  ]);

  return (
    <Card className='mb-5'>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashflowFilters year={year} yearsRange={yearsRange} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
