import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { categoriesTable, transactionsTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getRecentTransactions() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const transactions = await db
    .select({
      id: transactionsTable.id,
      description: transactionsTable.description,
      amount: transactionsTable.amount,
      transactionDate: transactionsTable.transactionDate,
      category: categoriesTable.name,
      transactionType: categoriesTable.type,
    })
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(desc(transactionsTable.transactionDate))
    .limit(5)
    .leftJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    );

  return transactions;
}
