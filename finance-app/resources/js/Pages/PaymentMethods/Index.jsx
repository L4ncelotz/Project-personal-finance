import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Index({ paymentMethods = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'cash'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/payment-methods', formData);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Payment Methods</h2>}
        >
            <Head title="Payment Methods" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Form for adding new payment method */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Payment Method Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="rounded-md border-gray-300"
                                />
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="rounded-md border-gray-300"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Account</option>
                                    <option value="credit">Credit Card</option>
                                    <option value="debit">Debit Card</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Add Payment Method
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Payment Methods List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Type</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentMethods.map((method) => (
                                    <tr key={method.id}>
                                        <td className="px-6 py-4">{method.name}</td>
                                        <td className="px-6 py-4">{method.type}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => router.delete(`/payment-methods/${method.id}`)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
