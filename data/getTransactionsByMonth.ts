import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { transactionsTable } from '@/db/schema';
import { db } from '@/db';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { format } from 'date-fns';

export async function getTransactionsByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const earliestDate = new Date(year, month - 1, 1);
  const latestDate = new Date(year, month, 0);
  const transactions = await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.userId, userId),
        gte(
          transactionsTable.transactionDate,
          format(earliestDate, 'yyyy-MM-dd'),
        ),
        lte(
          transactionsTable.transactionDate,
          format(latestDate, 'yyyy-MM-dd'),
        ),
      ),
    )
    .orderBy(desc(transactionsTable.transactionDate));
  return transactions;
}
