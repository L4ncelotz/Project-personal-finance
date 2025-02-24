<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetPlanController extends Controller
{
    public function index()
    {
        $budgetPlans = BudgetPlan::with('category')
            ->where('user_id', auth()->id())
            ->get();

        return Inertia::render('BudgetPlans/Index', [
            'budgetPlans' => $budgetPlans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $budgetPlan = BudgetPlan::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return redirect()->back();
    }

    public function update(Request $request, BudgetPlan $budgetPlan)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $budgetPlan->update($validated);

        return redirect()->back();
    }

    public function destroy(BudgetPlan $budgetPlan)
    {
        $budgetPlan->delete();
        return redirect()->back();
    }
}
