<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('Transactions/Index', [
            'transactions' => Transaction::with(['category', 'paymentMethod'])
                ->where('user_id', $userId)
                ->latest('transaction_date')
                ->get(),
            'categories' => Category::where('user_id', $userId)
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
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        $validated['user_id'] = auth()->id();

        Transaction::create($validated);

        return redirect()->back()
            ->with('message', 'Transaction created successfully.');
    }
}