'use client';

import { addDays, format } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Input } from './ui/input';
import { type Category } from '@/types/Category';

export const transactionFormSchema = z.object({
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

type Props = {
  categories: Category[];
  onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
  defaultValues?: {
    transactionType: 'income' | 'expense';
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  };
};

export default function TransactionForm({
  categories,
  onSubmit,
  defaultValues,
}: Props) {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: standardSchemaResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: '',
      transactionDate: new Date(),
      transactionType: 'income',
      ...defaultValues,
    },
  });
  const transactionType = form.watch('transactionType');
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType,
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset
        disabled={form.formState.isSubmitting}
        className="grid grid-cols-2 gap-y-5 gap-x-2"
      >
        <Controller
          name="transactionType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Transaction Type</FieldLabel>
              <Select
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  form.setValue('categoryId', 0);
                }}
                value={field.value}
              >
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
                <SelectContent>
                  {filteredCategories.map((category) => {
                    return (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="transactionDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="transaction-date">
                Transaction Date
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="transaction-date"
                    className={cn(
                      'justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={{
                      after: new Date(),
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Amount</FieldLabel>
              <Input type="number" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </fieldset>
      <fieldset
        disabled={form.formState.isSubmitting}
        className="mt-5 flex flex-col gap-5"
      >
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Submit</Button>
      </fieldset>
    </form>
  );
}
