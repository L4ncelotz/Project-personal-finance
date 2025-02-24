import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import PageHeader from '@/Components/ui/PageHeader';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard({ 
    auth, 
    totalBalance ='' , 
    totalIncome = '', 
    totalExpenses = '', 
    recentTransactions = [] 
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <PageHeader
                    title="Financial Overview"
                    description="Monitor your financial activities and track your progress"
                />
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
                                <Wallet className="h-5 w-5 text-emerald-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${Number(totalBalance || 0).toLocaleString()}
                                </div>

                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Total Income</CardTitle>
                                <TrendingUp className="h-5 w-5 text-blue-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${Number(totalIncome || 0).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
                                <TrendingDown className="h-5 w-5 text-rose-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${Number(totalExpenses || 0).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTransactions.map(transaction => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {transaction.category?.name || 'Uncategorized'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {transaction.description || 'No description'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(transaction.transaction_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`text-lg font-semibold ${
                                                transaction.category?.type === 'income' 
                                                    ? 'text-emerald-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {transaction.category?.type === 'income' ? '+' : '-'}
                                                ${Number(transaction.amount).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No recent transactions
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}