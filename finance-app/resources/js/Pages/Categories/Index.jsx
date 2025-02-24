import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
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
import { Label } from "@/Components/ui/label";

export default function Index({ categories }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense'
    });

    const [subCategoryForm, setSubCategoryForm] = useState({
        category_id: '',
        name: ''
    });

    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        type: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/categories', formData);
    };

    const handleSubCategorySubmit = (categoryId, e) => {
        e.preventDefault();
        if (!subCategoryForm.name) return;

        router.post('/sub-categories', {
            category_id: categoryId,
            name: subCategoryForm.name
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSubCategoryForm({ category_id: '', name: '' });
                router.visit('/categories', { 
                    preserveScroll: true,
                    preserveState: false 
                });
            }
        });
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleEditSubCategory = (subCategory) => {
        setSubCategoryForm({
            category_id: subCategory.category_id,
            name: subCategory.name
        });
    };

    const handleDeleteSubCategory = (subCategory) => {
        router.delete(`/sub-categories/${subCategory.id}`);
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('categories.destroy', categoryToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                },
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setEditForm({
            name: category.name,
            type: category.type
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('categories.update', editingCategory.id), editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Categories</h2>}
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Form for adding new category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Category Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                    <select
                                        className="rounded-md border-gray-300"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                    <Button type="submit">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Category
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Categories List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Card key={category.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleCategory(category.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                {expandedCategory === category.id ? 
                                                    <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                                }
                                                <span className="font-medium">{category.name}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    category.type === 'income' 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {category.type}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(category)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {expandedCategory === category.id && (
                                        <div className="border-t border-gray-100">
                                            {/* Add Sub Category Form */}
                                            <form 
                                                onSubmit={(e) => handleSubCategorySubmit(category.id, e)} 
                                                className="p-4 bg-gray-50"
                                            >
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Add sub-category"
                                                        value={subCategoryForm.name}
                                                        onChange={(e) => setSubCategoryForm({
                                                            category_id: category.id,
                                                            name: e.target.value
                                                        })}
                                                        className="text-sm"
                                                    />
                                                    <Button 
                                                        type="submit"
                                                        disabled={!subCategoryForm.name}
                                                        size="sm"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </form>

                                            {/* Sub Categories List */}
                                            <div className="divide-y divide-gray-100">
                                                {category.sub_categories?.map((subCategory) => (
                                                    <div 
                                                        key={subCategory.id}
                                                        className="flex items-center justify-between px-4 py-2 pl-11 text-sm text-gray-600 hover:bg-gray-50"
                                                    >
                                                        <span>{subCategory.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditSubCategory(subCategory)}
                                                            >
                                                                <Pencil className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteSubCategory(subCategory)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the category and all its subcategories. 
                            This action cannot be undone.
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

            {/* Edit Category Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                className="w-full rounded-md border-gray-300"
                                value={editForm.type}
                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
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