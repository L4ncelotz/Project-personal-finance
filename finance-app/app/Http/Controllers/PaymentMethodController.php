<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PaymentMethodController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Inertia::render('PaymentMethods/Index', [
            'paymentMethods' => PaymentMethod::where('user_id', auth()->id())->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $validated['user_id'] = auth()->id();

        PaymentMethod::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $this->authorize('update', $paymentMethod);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $paymentMethod->update($validated);

        return redirect()->back();
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->authorize('delete', $paymentMethod);

        // Check if payment method is used in any transactions
        if ($paymentMethod->transactions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete payment method that has transactions.');
        }

        $paymentMethod->delete();

        return redirect()->back();
    }
}