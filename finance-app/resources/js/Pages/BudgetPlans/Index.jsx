import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Pencil, Trash2 } from 'lucide-react';
import { Progress } from "@/Components/ui/progress";
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

export default function Index({ budgetPlans = [], categories = [] }) {
    const [formData, setFormData] = useState({
        category_id: '',
        sub_category_id: '',
        amount: '',
        period_type: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        notes: ''
    });

    const [editingBudget, setEditingBudget] = useState(null);
    const [editForm, setEditForm] = useState({
        category_id: '',
        sub_category_id: '',
        amount: '',
        period_type: '',
        start_date: '',
        end_date: '',
        notes: ''
    });

    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/budget-plans', formData);
        setFormData({
            category_id: '',
            sub_category_id: '',
            amount: '',
            period_type: 'monthly',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            notes: ''
        });
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setEditForm({
            category_id: budget.category_id,
            sub_category_id: budget.sub_category_id || '',
            amount: budget.amount,
            period_type: budget.period_type,
            start_date: budget.start_date,
            end_date: budget.end_date || '',
            notes: budget.notes || ''
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('budget-plans.update', editingBudget.id), editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingBudget(null);
            },
        });
    };

    const handleDelete = (budget) => {
        setBudgetToDelete(budget);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (budgetToDelete) {
            router.delete(route('budget-plans.destroy', budgetToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setBudgetToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Budget Plans</h2>}
        >
            <Head title="Budget Plans" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Add Budget Plan Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Budget Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <select
                                            className="w-full rounded-md border-gray-300"
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                category_id: e.target.value,
                                                sub_category_id: ''
                                            })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.category_id && (
                                        <div className="space-y-2">
                                            <Label>Sub Category</Label>
                                            <select
                                                className="w-full rounded-md border-gray-300"
                                                value={formData.sub_category_id}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    sub_category_id: e.target.value
                                                })}
                                            >
                                                <option value="">Select Sub Category</option>
                                                {categories
                                                    .find(c => c.id === parseInt(formData.category_id))
                                                    ?.sub_categories?.map((sub) => (
                                                        <option key={sub.id} value={sub.id}>
                                                            {sub.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Amount</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                amount: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Period Type</Label>
                                        <select
                                            className="w-full rounded-md border-gray-300"
                                            value={formData.period_type}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                period_type: e.target.value
                                            })}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                start_date: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                end_date: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2 col-span-2">
                                        <Label>Notes</Label>
                                        <Input
                                            value={formData.notes}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                notes: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit">Add Budget Plan</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Budget Plans List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgetPlans.map((budget) => (
                            <Card key={budget.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-medium">
                                                {budget.category?.name}
                                                {budget.sub_category && (
                                                    <span className="text-gray-500">
                                                        {' > '}{budget.sub_category.name}
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {budget.period_type} budget
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(budget)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(budget)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Budget: ${Number(budget.amount).toLocaleString()}</span>
                                            <span>Spent: ${Number(budget.actual_spent).toLocaleString()}</span>
                                        </div>
                                        <Progress value={budget.progress_percentage} />
                                        <p className="text-sm text-gray-500">
                                            Remaining: ${Number(budget.remaining_budget).toLocaleString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Budget Plan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <select
                                    className="w-full rounded-md border-gray-300"
                                    value={editForm.category_id}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        category_id: e.target.value,
                                        sub_category_id: ''
                                    })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {editForm.category_id && (
                                <div className="space-y-2">
                                    <Label>Sub Category</Label>
                                    <select
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
                                <Label>Amount</Label>
                                <Input
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
                                <Label>Period Type</Label>
                                <select
                                    className="w-full rounded-md border-gray-300"
                                    value={editForm.period_type}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        period_type: e.target.value
                                    })}
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={editForm.start_date}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        start_date: e.target.value
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={editForm.end_date}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        end_date: e.target.value
                                    })}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Notes</Label>
                                <Input
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        notes: e.target.value
                                    })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingBudget(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this budget plan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
