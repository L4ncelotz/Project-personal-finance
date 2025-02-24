import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
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

export default function Index({ paymentMethods }) {
    const [formData, setFormData] = useState({
        name: '',
    });

    const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
    });

    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/payment-methods', formData);
        setFormData({ name: '' });
    };

    const handleEdit = (paymentMethod) => {
        setEditingPaymentMethod(paymentMethod);
        setEditForm({
            name: paymentMethod.name,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('payment-methods.update', editingPaymentMethod.id), editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPaymentMethod(null);
            },
        });
    };

    const handleDelete = (paymentMethod) => {
        setPaymentMethodToDelete(paymentMethod);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (paymentMethodToDelete) {
            router.delete(route('payment-methods.destroy', paymentMethodToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setPaymentMethodToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Payment Methods</h2>}
        >
            <Head title="Payment Methods" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Payment Method Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                    />
                                    <Button type="submit">
                                        Add Payment Method
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethods.map((paymentMethod) => (
                            <Card key={paymentMethod.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{paymentMethod.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(paymentMethod)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(paymentMethod)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Payment Method Dialog */}
            <Dialog open={!!editingPaymentMethod} onOpenChange={() => setEditingPaymentMethod(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Payment Method</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ name: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingPaymentMethod(null)}>
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
                            This action cannot be undone. This will permanently delete the payment method.
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
