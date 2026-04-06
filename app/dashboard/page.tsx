import RecentTransactions from './recent-transactions';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl w-full mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <RecentTransactions />
    </div>
  );
}
