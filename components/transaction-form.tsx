'use client';

import { addDays } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from './ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number().positive('Please select a category'),
  transactionDate: z.coerce
    .date()
    .max(addDays(new Date(), 1), 'Transaction date cannot be in the future'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
});

export default function TransactionForm() {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: standardSchemaResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: '',
      transactionDate: new Date(),
      transactionType: 'income',
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof transactionFormSchema>,
  ) => {};

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <fieldset className="grid grid-cols-2 gap-y-5 gap-x-2">
        <Controller
          name="transactionType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Transaction Type</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Category</FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value.toString()}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </fieldset>
    </form>
  );
}
