<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TransactionController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('Transactions/Index', [
            'transactions' => Transaction::with(['category', 'subCategory', 'paymentMethod'])
                ->where('user_id', $userId)
                ->latest('transaction_date')
                ->get(),
            'categories' => Category::with('subCategories')
                ->where('user_id', $userId)
                ->orWhereNull('user_id')
                ->get(),
            'paymentMethods' => PaymentMethod::where('user_id', $userId)
                ->orWhereNull('user_id')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        Transaction::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update($validated);

        return redirect()->back();
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);
        
        $transaction->delete();

        return redirect()->back();
    }
}