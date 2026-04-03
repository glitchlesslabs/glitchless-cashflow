import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/data/getCategories';
import Link from 'next/link';
import EditTransactionForm from './edit-transaction-form';
import { getTransaction } from '@/data/getTransaction';
import { notFound } from 'next/navigation';

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const paramsValues = await params;
  const transactionId = Number(paramsValues.transactionId);

  if (isNaN(transactionId)) {
    notFound();
  }

  const categories = await getCategories();
  const transaction = await getTransaction(transactionId);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-7xl w-full mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/transactions">Transactions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Transaction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4 max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTransactionForm categories={categories} transaction={transaction} />
        </CardContent>
      </Card>
    </div>
  );
}
