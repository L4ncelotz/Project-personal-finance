<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index()
    {
        return Inertia::render('PaymentMethods/Index', [
            'paymentMethods' => PaymentMethod::where('user_id', auth()->id())
                ->orWhereNull('user_id')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = auth()->id();

        PaymentMethod::create($validated);

        return redirect()->back()
            ->with('message', 'Payment method created successfully.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $paymentMethod->update($validated);

        return redirect()->back()
            ->with('message', 'Payment method updated successfully.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        if ($paymentMethod->user_id === auth()->id()) {
            $paymentMethod->delete();
            return redirect()->back()
                ->with('message', 'Payment method deleted successfully.');
        }

        return redirect()->back()
            ->with('error', 'You cannot delete this payment method.');
    }
}