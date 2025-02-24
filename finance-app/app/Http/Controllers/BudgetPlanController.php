<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetPlanController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('BudgetPlans/Index', [
            'budgetPlans' => BudgetPlan::with(['category', 'subCategory'])
                ->where('user_id', $userId)
                ->get()
                ->map(function ($plan) {
                    return [
                        ...$plan->toArray(),
                        'actual_spent' => $plan->actual_spent,
                        'remaining_budget' => $plan->remaining_budget,
                        'progress_percentage' => $plan->progress_percentage,
                    ];
                }),
            'categories' => Category::with('subCategories')
                ->where('user_id', $userId)
                ->where('type', 'expense')  // เฉพาะประเภทรายจ่าย
                ->get(),
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
