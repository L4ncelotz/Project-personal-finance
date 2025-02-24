// Import necessary components and utilities
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";

export default function Index({ transactions = [], categories = [], paymentMethods = [] }) {
    // Initialize form state with default values
    const [formData, setFormData] = useState({
        category_id: '',
        payment_method_id: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/transactions', formData);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Transaction Form Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Add New Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Category Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                        <select
                                            value={formData.payment_method_id}
                                            onChange={(e) => setFormData({...formData, payment_method_id: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        >
                                            <option value="">Select Payment Method</option>
                                            {paymentMethods.map(method => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Amount Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                                        <input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            step="0.01"
                                        />
                                    </div>

                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            value={formData.transaction_date}
                                            onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                                    >
                                        Add Transaction
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Transactions List Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Render transactions if they exist, otherwise show empty state */}
                            {transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {transactions.map(transaction => (
                                        // Individual Transaction Item
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50"
                                        >
                                            {/* Transaction Details */}
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
                                            {/* Transaction Amount with conditional styling based on type */}
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
                                // Empty State
                                <div className="text-center py-4 text-gray-500">
                                    No transactions found
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}