'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-form';
import { type Category } from '@/types/Category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

export default function EditTransactionForm({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction: {
    id: number;
    categoryId: number;
    amount: string;
    description: string;
    transactionDate: string;
  };
}) {
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result: any = {};

    if (result.error) {
      toast.error('Error', {
        description: result.message,
      });
      return;
    }

    toast.success('Success', {
      description: 'Transaction updated',
      className: 'bg-green-500 text-white',
    });

    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );

    console.log(result.id);
  };
  return (
    <TransactionForm
      defaultValues={{
        amount: Number(transaction.amount),
        categoryId: transaction.categoryId,
        description: transaction.description,
        transactionDate: new Date(transaction.transactionDate),
        transactionType:
          categories.find((category) => category.id === transaction.categoryId)
            ?.type ?? 'income',
      }}
      onSubmit={handleSubmit}
      categories={categories}
    />
  );
}
