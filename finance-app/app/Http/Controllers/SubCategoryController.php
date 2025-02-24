<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
        ]);

        SubCategory::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, SubCategory $subCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subCategory->update($validated);

        return redirect()->back();
    }

    public function destroy(SubCategory $subCategory)
    {
        // Check if there are any transactions using this subcategory
        if ($subCategory->transactions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete sub-category that has transactions.');
        }

        $subCategory->delete();
        return redirect()->back();
    }
}