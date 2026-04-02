'use client';

import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-form';
import { type Category } from '@/types/Category';
import z from 'zod';
import { createTransaction } from './actions';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await createTransaction({
      amount: data.amount,
      transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
      categoryId: data.categoryId,
      description: data.description,
    });

    if (result.error) {
      toast.error('Error', {
        description: result.message,
      });
      return;
    }

    toast.success('Success', {
      description: 'Transaction created',
      className: 'bg-green-500 text-white',
    });

    router.push(
      `/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`,
    );

    console.log(result.id);
  };
  return <TransactionForm onSubmit={handleSubmit} categories={categories} />;
}
