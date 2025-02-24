// Import necessary components and utilities
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

export default function Index({ transactions = [], categories = [], paymentMethods = [] }) {
    const [formData, setFormData] = useState({
        category_id: '',
        sub_category_id: '',
        payment_method_id: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);

    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editForm, setEditForm] = useState({
        category_id: '',
        sub_category_id: '',
        payment_method_id: '',
        amount: '',
        description: '',
        transaction_date: ''
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const category = categories.find(c => c.id === parseInt(categoryId));
        setSelectedCategory(category);
        setAvailableSubCategories(category?.sub_categories || []);
        
        setFormData(prev => ({
            ...prev,
            category_id: categoryId,
            sub_category_id: '' // Reset sub-category when category changes
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/transactions', formData);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setEditForm({
            category_id: transaction.category_id,
            sub_category_id: transaction.sub_category_id || '',
            payment_method_id: transaction.payment_method_id,
            amount: transaction.amount,
            description: transaction.description || '',
            transaction_date: transaction.transaction_date
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('transactions.update', editingTransaction.id), editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingTransaction(null);
            },
        });
    };

    const handleDelete = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            router.delete(route('transactions.destroy', transactionToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setTransactionToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Transaction Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            className="w-full rounded-md border-gray-300"
                                            value={formData.category_id}
                                            onChange={handleCategoryChange}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name} ({category.type})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sub Category Selection */}
                                    {selectedCategory && availableSubCategories.length > 0 && (
                                        <div className="space-y-2">
                                            <Label htmlFor="sub_category">Sub Category</Label>
                                            <select
                                                id="sub_category"
                                                className="w-full rounded-md border-gray-300"
                                                value={formData.sub_category_id}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    sub_category_id: e.target.value
                                                })}
                                            >
                                                <option value="">Select Sub Category</option>
                                                {availableSubCategories.map((subCategory) => (
                                                    <option key={subCategory.id} value={subCategory.id}>
                                                        {subCategory.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_method">Payment Method</Label>
                                        <select
                                            id="payment_method"
                                            className="w-full rounded-md border-gray-300"
                                            value={formData.payment_method_id}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                payment_method_id: e.target.value
                                            })}
                                        >
                                            <option value="">Select Payment Method</option>
                                            {paymentMethods.map((method) => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                amount: e.target.value
                                            })}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Transaction Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.transaction_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                transaction_date: e.target.value
                                            })}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                description: e.target.value
                                            })}
                                            placeholder="Transaction description"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button 
                                        type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Add Transaction
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Transactions List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {transaction.category?.name}
                                                </span>
                                                {transaction.sub_category && (
                                                    <>
                                                        <span className="text-gray-400">/</span>
                                                        <span className="text-sm text-gray-600">
                                                            {transaction.sub_category.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {transaction.description}
                                            </p>
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(transaction.transaction_date), 'PPP')} • {transaction.payment_method?.name}
                                            </div>
                                        </div>
                                        <span className={`font-medium ${
                                            transaction.category?.type === 'income' 
                                                ? 'text-emerald-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {transaction.category?.type === 'income' ? '+' : '-'}
                                            ${parseFloat(transaction.amount).toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(transaction)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Transaction Dialog */}
            <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <select
                                id="edit-category"
                                className="w-full rounded-md border-gray-300"
                                value={editForm.category_id}
                                onChange={(e) => {
                                    const categoryId = e.target.value;
                                    setEditForm({
                                        ...editForm,
                                        category_id: categoryId,
                                        sub_category_id: ''
                                    });
                                }}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {editForm.category_id && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-sub-category">Sub Category</Label>
                                <select
                                    id="edit-sub-category"
                                    className="w-full rounded-md border-gray-300"
                                    value={editForm.sub_category_id}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        sub_category_id: e.target.value
                                    })}
                                >
                                    <option value="">Select Sub Category</option>
                                    {categories
                                        .find(c => c.id === parseInt(editForm.category_id))
                                        ?.sub_categories?.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit-payment-method">Payment Method</Label>
                            <select
                                id="edit-payment-method"
                                className="w-full rounded-md border-gray-300"
                                value={editForm.payment_method_id}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    payment_method_id: e.target.value
                                })}
                            >
                                <option value="">Select Payment Method</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-amount">Amount</Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    amount: e.target.value
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    description: e.target.value
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={editForm.transaction_date}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    transaction_date: e.target.value
                                })}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingTransaction(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}